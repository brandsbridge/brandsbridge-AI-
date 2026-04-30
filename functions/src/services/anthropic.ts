import Anthropic from "@anthropic-ai/sdk";
import { defineSecret } from "firebase-functions/params";
import { HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/**
 * Secret for the Anthropic API key. Functions that call generateText
 * MUST list this in their `secrets: [...]` option so Firebase binds
 * the secret value at invocation time.
 */
export const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");

/**
 * The Claude model used for all inquiry drafting. Pinned explicitly
 * so prompt-version migrations don't accidentally ride a model bump.
 */
export const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (cachedClient) return cachedClient;
  cachedClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY.value() });
  return cachedClient;
}

export interface GenerateTextArgs {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export interface GenerateTextResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Wraps Anthropic.messages.create with consistent error handling
 * and logging. Logs token counts only — never the prompt content
 * or the API key.
 */
export async function generateText(
  args: GenerateTextArgs,
): Promise<GenerateTextResult> {
  const { systemPrompt, userPrompt, maxTokens = 1024 } = args;
  const client = getClient();

  try {
    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new HttpsError(
        "internal",
        "Anthropic returned no text content.",
      );
    }

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;

    logger.info("Anthropic generateText ok", {
      model: ANTHROPIC_MODEL,
      inputTokens,
      outputTokens,
      stopReason: response.stop_reason,
    });

    return {
      text: textBlock.text,
      inputTokens,
      outputTokens,
    };
  } catch (err: unknown) {
    if (err instanceof HttpsError) throw err;

    if (err instanceof Anthropic.RateLimitError) {
      logger.warn("Anthropic rate limit hit", { status: err.status });
      throw new HttpsError(
        "resource-exhausted",
        "AI service is temporarily rate-limited. Please try again shortly.",
      );
    }

    if (err instanceof Anthropic.APIError) {
      logger.error("Anthropic API error", {
        status: err.status,
        type: err.name,
      });
      throw new HttpsError(
        "internal",
        `AI service error: ${err.message}`,
      );
    }

    logger.error("Anthropic unknown error", {
      message: err instanceof Error ? err.message : "unknown",
    });
    throw err;
  }
}
