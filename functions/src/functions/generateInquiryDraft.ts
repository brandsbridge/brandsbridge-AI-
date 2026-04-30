import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL,
  generateText,
} from "../services/anthropic";
import {
  INQUIRY_SYSTEM_PROMPT,
  INQUIRY_PROMPT_VERSION,
  buildInquiryUserPrompt,
  type InquiryPromptInput,
} from "../prompts/inquiryPromptV1";

interface GenerateInquiryDraftData {
  supplier: {
    id: string;
    name: string;
    country: string;
    categories: string[];
    certifications?: string[];
  };
  buyer?: {
    company?: string;
    country?: string;
  };
  intent?: string;
}

interface GenerateInquiryDraftResult {
  subject: string;
  body: string;
  metadata: {
    model: string;
    promptVersion: string;
    tokensUsed: number;
  };
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * Strip ```json ... ``` markdown fences that Claude sometimes wraps
 * around JSON output despite "no markdown fences" in the system prompt.
 */
function stripFences(s: string): string {
  return s
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

function validate(data: unknown): GenerateInquiryDraftData {
  if (!data || typeof data !== "object") {
    throw new HttpsError("invalid-argument", "Request body is required.");
  }
  const d = data as Partial<GenerateInquiryDraftData>;

  if (!d.supplier || typeof d.supplier !== "object") {
    throw new HttpsError("invalid-argument", "supplier is required.");
  }
  const { supplier } = d;

  if (!isNonEmptyString(supplier.id)) {
    throw new HttpsError("invalid-argument", "supplier.id is required.");
  }
  if (!isNonEmptyString(supplier.name)) {
    throw new HttpsError("invalid-argument", "supplier.name is required.");
  }
  if (!isNonEmptyString(supplier.country)) {
    throw new HttpsError("invalid-argument", "supplier.country is required.");
  }
  if (!Array.isArray(supplier.categories) || supplier.categories.length === 0) {
    throw new HttpsError(
      "invalid-argument",
      "supplier.categories must be a non-empty array.",
    );
  }
  if (!supplier.categories.every(isNonEmptyString)) {
    throw new HttpsError(
      "invalid-argument",
      "supplier.categories must contain non-empty strings.",
    );
  }
  if (
    supplier.certifications !== undefined &&
    (!Array.isArray(supplier.certifications) ||
      !supplier.certifications.every(isNonEmptyString))
  ) {
    throw new HttpsError(
      "invalid-argument",
      "supplier.certifications must be an array of non-empty strings.",
    );
  }

  return d as GenerateInquiryDraftData;
}

export const generateInquiryDraft = onCall(
  {
    secrets: [ANTHROPIC_API_KEY],
    cors: true,
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async (
    request: CallableRequest<unknown>,
  ): Promise<GenerateInquiryDraftResult> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Sign in required to generate inquiries.",
      );
    }

    const data = validate(request.data);
    const token = request.auth.token;

    const input: InquiryPromptInput = {
      buyer: {
        name: (token.name as string | undefined) || "Buyer",
        company:
          data.buyer?.company ||
          (token.companyName as string | undefined) ||
          undefined,
        country:
          data.buyer?.country ||
          (token.country as string | undefined) ||
          undefined,
        email: (token.email as string | undefined) || "",
      },
      supplier: {
        name: data.supplier.name,
        country: data.supplier.country,
        categories: data.supplier.categories,
        certifications: data.supplier.certifications,
      },
      intent: data.intent,
    };

    const userPrompt = buildInquiryUserPrompt(input);
    const result = await generateText({
      systemPrompt: INQUIRY_SYSTEM_PROMPT,
      userPrompt,
      maxTokens: 1024,
    });

    let parsed: { subject: string; body: string };
    try {
      parsed = JSON.parse(stripFences(result.text));
    } catch {
      logger.error("AI returned non-JSON", {
        textPreview: result.text.slice(0, 100),
      });
      throw new HttpsError(
        "internal",
        "AI response could not be parsed. Try again.",
      );
    }

    if (!isNonEmptyString(parsed.subject) || !isNonEmptyString(parsed.body)) {
      logger.error("AI JSON missing fields", {
        hasSubject: typeof parsed.subject,
        hasBody: typeof parsed.body,
      });
      throw new HttpsError(
        "internal",
        "AI response missing subject or body. Try again.",
      );
    }

    logger.info("Inquiry draft generated", {
      buyerId: request.auth.uid,
      supplierId: data.supplier.id,
      model: ANTHROPIC_MODEL,
      promptVersion: INQUIRY_PROMPT_VERSION,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    });

    return {
      subject: parsed.subject,
      body: parsed.body,
      metadata: {
        model: ANTHROPIC_MODEL,
        promptVersion: INQUIRY_PROMPT_VERSION,
        tokensUsed: result.inputTokens + result.outputTokens,
      },
    };
  },
);
