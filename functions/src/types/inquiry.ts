import { Timestamp } from "firebase-admin/firestore";

/**
 * Buyer identity passed in by the client (Anonymous Auth flow).
 * Both callables prefer this over Firebase Auth token claims so that
 * unauthenticated-but-anon-signed-in users can identify themselves
 * via a lightweight form rather than a full sign-up.
 *
 * `phone` is optional; everything else is required by the form.
 */
export interface BuyerInfo {
  name: string;
  email: string;
  company: string;
  country: string;
  phone?: string;
}

/**
 * Lifecycle of an inquiry document.
 *
 *   draft     → created by sendInquiry before the email send is attempted
 *   sent      → Resend accepted the email for delivery
 *   delivered → Resend webhook confirmed delivery to recipient MX
 *   opened    → Resend webhook confirmed open (image pixel / link click)
 *   replied   → supplier replied (markInquiryReplied function)
 *   failed    → Resend rejected, or any prior step threw
 */
export type InquiryStatus =
  | "draft"
  | "sent"
  | "delivered"
  | "opened"
  | "replied"
  | "failed";

/**
 * Shape of an inquiries/{inquiryId} document.
 *
 * All Firestore writes go through Cloud Functions (Admin SDK).
 * Clients read via security rules: buyer (buyerId) or claimed
 * supplier user (supplierUid) only.
 */
export interface Inquiry {
  // Identity
  id: string;                    // Same as Firestore doc ID (denormalized)
  buyerId: string;               // Auth UID of the buyer
  buyerEmail: string;
  buyerName: string;
  buyerCompany?: string;
  buyerCountry?: string;
  buyerPhone?: string;

  // Target (supplier)
  supplierId: string;            // Company ID from mockData/companies seed
  supplierUid?: string;          // Auth UID — set once supplier claims profile
  supplierName: string;
  supplierEmail: string;
  supplierCountry: string;

  // Content
  subject: string;               // AI-generated subject line
  message: string;               // AI-generated body (\n line breaks)
  editedByUser: boolean;         // True if buyer modified before sending

  // Status flow
  status: InquiryStatus;
  statusReason?: string;         // Populated when status === "failed"

  // Timestamps
  createdAt: Timestamp;
  sentAt?: Timestamp;
  openedAt?: Timestamp;
  repliedAt?: Timestamp;

  // Email tracking
  resendEmailId?: string;        // ID returned by Resend on send

  // AI metadata (analytics)
  aiPromptVersion: string;       // e.g. "v1"
  aiModel: string;               // e.g. "claude-sonnet-4-20250514"
  aiTokensUsed?: number;
}

/**
 * Fields callers must supply when creating a new inquiry.
 * The function fills in id, status, createdAt, and AI metadata.
 */
export type InquiryCreateInput = Omit<
  Inquiry,
  "id" | "status" | "createdAt" | "sentAt" | "openedAt" | "repliedAt" |
  "resendEmailId" | "statusReason"
>;
