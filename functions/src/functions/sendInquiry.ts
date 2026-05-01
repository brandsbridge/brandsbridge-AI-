import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { RESEND_API_KEY, sendEmail } from "../services/resend";
import { ANTHROPIC_MODEL } from "../services/anthropic";
import { INQUIRY_PROMPT_VERSION } from "../prompts/inquiryPromptV1";
import {
  buildInquiryEmailHtml,
  buildInquiryEmailText,
  INQUIRY_EMAIL_TEMPLATE_VERSION,
} from "../templates/inquiryEmailV1";
import type { BuyerInfo, Inquiry, InquiryStatus } from "../types/inquiry";

/**
 * Sender identity for Resend. Hardcoded to the resend.dev test domain
 * until DNS verification for noreply@brandsbridgeglobal.com is live.
 */
const FROM_ADDRESS = "Brands Bridge <onboarding@resend.dev>";

interface SendInquiryData {
  supplier: {
    id: string;
    name: string;
    email: string;
    country: string;
    uid?: string;
  };
  buyer?: BuyerInfo;
  subject: string;
  message: string;
  editedByUser: boolean;
  aiMeta?: {
    tokensUsed?: number;
  };
}

interface SendInquiryResult {
  inquiryId: string;
  status: InquiryStatus;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isEmail(v: unknown): v is string {
  return isNonEmptyString(v) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validate(data: unknown): SendInquiryData {
  if (!data || typeof data !== "object") {
    throw new HttpsError("invalid-argument", "Request body is required.");
  }
  const d = data as Partial<SendInquiryData>;

  if (!d.supplier || typeof d.supplier !== "object") {
    throw new HttpsError("invalid-argument", "supplier is required.");
  }
  if (!isNonEmptyString(d.supplier.id)) {
    throw new HttpsError("invalid-argument", "supplier.id is required.");
  }
  if (!isNonEmptyString(d.supplier.name)) {
    throw new HttpsError("invalid-argument", "supplier.name is required.");
  }
  if (!isEmail(d.supplier.email)) {
    throw new HttpsError("invalid-argument", "supplier.email must be a valid email.");
  }
  if (!isNonEmptyString(d.supplier.country)) {
    throw new HttpsError("invalid-argument", "supplier.country is required.");
  }
  if (d.supplier.uid !== undefined && !isNonEmptyString(d.supplier.uid)) {
    throw new HttpsError("invalid-argument", "supplier.uid must be a non-empty string when provided.");
  }
  if (!isNonEmptyString(d.subject)) {
    throw new HttpsError("invalid-argument", "subject is required.");
  }
  if (!isNonEmptyString(d.message)) {
    throw new HttpsError("invalid-argument", "message is required.");
  }
  if (typeof d.editedByUser !== "boolean") {
    throw new HttpsError("invalid-argument", "editedByUser must be a boolean.");
  }

  return d as SendInquiryData;
}

export const sendInquiry = onCall(
  {
    secrets: [RESEND_API_KEY],
    cors: true,
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async (
    request: CallableRequest<unknown>,
  ): Promise<SendInquiryResult> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Sign in required to send inquiries.",
      );
    }

    const data = validate(request.data);
    const token = request.auth.token;

    const buyerId = request.auth.uid;
    const payloadBuyer = data.buyer;

    // Payload-first, token-fallback. Email is the last line of defense —
    // fail closed if neither source has a valid address.
    const buyerEmail =
      payloadBuyer?.email ||
      (token.email as string | undefined) ||
      "";
    if (!isEmail(buyerEmail)) {
      throw new HttpsError(
        "failed-precondition",
        "Buyer email is required to send an inquiry.",
      );
    }
    const buyerName =
      payloadBuyer?.name ||
      (token.name as string | undefined) ||
      "Buyer";
    const buyerCompany =
      payloadBuyer?.company ||
      (token.companyName as string | undefined) ||
      undefined;
    const buyerCountry =
      payloadBuyer?.country ||
      (token.country as string | undefined) ||
      undefined;
    const buyerPhone = payloadBuyer?.phone || undefined;

    const db = getFirestore();
    const docRef = db.collection("inquiries").doc();
    const inquiryId = docRef.id;

    const baseDoc: Inquiry = {
      id: inquiryId,
      buyerId,
      buyerEmail,
      buyerName,
      buyerCompany,
      buyerCountry,
      buyerPhone,

      supplierId: data.supplier.id,
      supplierUid: data.supplier.uid,
      supplierName: data.supplier.name,
      supplierEmail: data.supplier.email,
      supplierCountry: data.supplier.country,

      subject: data.subject,
      message: data.message,
      editedByUser: data.editedByUser,

      status: "draft",

      createdAt: Timestamp.now(),

      aiPromptVersion: INQUIRY_PROMPT_VERSION,
      aiModel: ANTHROPIC_MODEL,
      aiTokensUsed: data.aiMeta?.tokensUsed,
    };

    await docRef.set(baseDoc);

    logger.info("Inquiry draft created", {
      inquiryId,
      buyerId,
      supplierId: data.supplier.id,
      editedByUser: data.editedByUser,
    });

    try {
      const templateInput = {
        subject: data.subject,
        body: data.message,
        buyerCompany: buyerCompany || buyerName,
        buyerEmail,
        supplierName: data.supplier.name,
        inquiryId,
      };
      const html = buildInquiryEmailHtml(templateInput);
      const text = buildInquiryEmailText(templateInput);

      const result = await sendEmail({
        from: FROM_ADDRESS,
        to: data.supplier.email,
        subject: data.subject,
        html,
        text,
        replyTo: buyerEmail,
        metadata: {
          inquiryId,
          buyerId,
          supplierId: data.supplier.id,
          promptVersion: INQUIRY_PROMPT_VERSION,
          templateVersion: INQUIRY_EMAIL_TEMPLATE_VERSION,
        },
      });

      await docRef.update({
        status: "sent" as InquiryStatus,
        sentAt: Timestamp.now(),
        resendEmailId: result.id,
      });

      logger.info("Inquiry sent", {
        inquiryId,
        buyerId,
        supplierId: data.supplier.id,
        resendId: result.id,
      });

      return { inquiryId, status: "sent" };
    } catch (err: unknown) {
      const reason = err instanceof Error ? err.message : "unknown send error";
      await docRef
        .update({
          status: "failed" as InquiryStatus,
          statusReason: reason,
          sentAt: FieldValue.delete(),
        })
        .catch((updateErr) => {
          logger.error("Failed to mark inquiry as failed", {
            inquiryId,
            updateError:
              updateErr instanceof Error ? updateErr.message : "unknown",
          });
        });

      logger.error("Inquiry send failed", {
        inquiryId,
        buyerId,
        supplierId: data.supplier.id,
        reason,
      });

      if (err instanceof HttpsError) throw err;
      throw new HttpsError("internal", "Failed to send inquiry. Please try again.");
    }
  },
);
