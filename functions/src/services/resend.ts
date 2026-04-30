import { Resend } from "resend";
import { defineSecret } from "firebase-functions/params";
import { HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/**
 * Secret for the Resend API key. Functions that call sendEmail
 * MUST list this in their `secrets: [...]` option so Firebase
 * binds the secret value at invocation time.
 */
export const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

let cachedClient: Resend | null = null;

function getClient(): Resend {
  if (cachedClient) return cachedClient;
  cachedClient = new Resend(RESEND_API_KEY.value());
  return cachedClient;
}

export interface SendEmailArgs {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  /**
   * Free-form key/value pairs surfaced as Resend tags for analytics.
   * Tag names and values must be ASCII letters/numbers/underscores/
   * dashes only, max 256 chars each (Resend constraint). Callers
   * should already conform — invalid tags are dropped silently.
   */
  metadata?: Record<string, string>;
}

export interface SendEmailResult {
  id: string;
}

const TAG_PATTERN = /^[A-Za-z0-9_-]{1,256}$/;

function metadataToTags(meta: Record<string, string> | undefined) {
  if (!meta) return undefined;
  const tags = Object.entries(meta)
    .filter(([name, value]) => TAG_PATTERN.test(name) && TAG_PATTERN.test(value))
    .map(([name, value]) => ({ name, value }));
  return tags.length > 0 ? tags : undefined;
}

/**
 * Send an email via Resend. Logs sender + recipient + tag count;
 * never logs subject text, HTML, or the API key.
 */
export async function sendEmail(args: SendEmailArgs): Promise<SendEmailResult> {
  const client = getClient();

  const payload = {
    from: args.from,
    to: args.to,
    subject: args.subject,
    html: args.html,
    ...(args.text ? { text: args.text } : {}),
    ...(args.replyTo ? { replyTo: args.replyTo } : {}),
    ...(metadataToTags(args.metadata) ?
      { tags: metadataToTags(args.metadata) } : {}),
  };

  try {
    const { data, error } = await client.emails.send(payload);

    if (error) {
      logger.error("Resend send rejected", {
        from: args.from,
        to: args.to,
        statusCode: error.statusCode,
        name: error.name,
      });
      throw new HttpsError(
        "internal",
        `Email service rejected the message: ${error.message}`,
      );
    }

    if (!data) {
      throw new HttpsError(
        "internal",
        "Email service returned no result.",
      );
    }

    logger.info("Resend send ok", {
      resendId: data.id,
      from: args.from,
      to: args.to,
      hasReplyTo: Boolean(args.replyTo),
      tagCount: metadataToTags(args.metadata)?.length ?? 0,
    });

    return { id: data.id };
  } catch (err: unknown) {
    if (err instanceof HttpsError) throw err;
    logger.error("Resend unknown error", {
      from: args.from,
      to: args.to,
      message: err instanceof Error ? err.message : "unknown",
    });
    throw new HttpsError(
      "internal",
      "Email send failed unexpectedly.",
    );
  }
}
