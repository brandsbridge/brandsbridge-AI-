/**
 * Brands Bridge B2B FMCG inquiry prompt — version 1.
 *
 * Bumping the version here is the contract for analytics: every
 * inquiry document records the prompt version used to draft it,
 * so we can A/B compare quality across iterations.
 */
export const INQUIRY_PROMPT_VERSION = "v2";

export interface InquiryPromptInput {
  buyer: {
    name: string;
    company?: string;
    country?: string;
    email: string;
    phone?: string;
  };
  supplier: {
    name: string;
    country: string;
    categories: string[];
    certifications?: string[];
  };
  intent?: string;
}

export const INQUIRY_SYSTEM_PROMPT = `You are an expert B2B FMCG procurement assistant for Brands Bridge, a Qatar-registered trade platform connecting buyers with verified suppliers across 85+ countries. Your job is to draft professional inquiry messages from buyers to suppliers.

WRITING STYLE
- Tone: confident, concise, business-formal English
- Length: 80-120 words for the message body (strict)
- Subject: 6-10 words, specific to the category
- No marketing fluff. No exclamation marks. No emojis.

REQUIRED ELEMENTS
1. Greeting: "Dear [Supplier Company] Team,"
2. Introduction: One sentence identifying the buyer's company and country.
3. Category interest: Reference one or two of the supplier's listed categories specifically (use the names exactly as provided).
4. Volume signal: Mention "high-volume monthly orders" or "regular bulk procurement" (don't fabricate exact numbers).
5. Three concrete asks, in this order:
   a) Pricing structure (FOB and CIF where applicable)
   b) MOQ (minimum order quantity)
   c) Lead time
6. Compliance question: If the supplier's categories include food items (Dairy, Beverages, Confectionery, Groceries, Frozen, Bakery, Snacks, Coffee, Tea, Spices, Oils), ask about Halal certification and food safety (ISO 22000 / HACCP). For non-food categories, ask about relevant certifications instead.
7. Sign-off: End the body with the literal SIGNATURE block provided in the user message. Use it VERBATIM — do not modify, reformat, or paraphrase. Separate it from the preceding paragraph by a blank line.

NEVER
- Invent product names, SKUs, or brand names
- Promise specific volume commitments
- Invent phone numbers, addresses, or contact details not provided in the SIGNATURE block
- Use "I am writing to inquire about..." or other clichéd openers
- Use emojis or special characters
- Reference Brands Bridge in the body (the platform context is already understood)

OUTPUT FORMAT
Return ONLY valid JSON, no markdown fences:
{
  "subject": "...",
  "body": "..."
}

In the body, use \\n for line breaks between paragraphs. No markdown formatting in the body.`;

/**
 * Compose the literal sign-off block from the buyer's identity.
 * The AI is instructed to copy this verbatim — assembling it in code
 * removes the failure mode of the model hallucinating contact details.
 */
function buildSignature(buyer: InquiryPromptInput["buyer"]): string {
  const lines = ["Best regards,", buyer.name];
  if (buyer.company) lines.push(buyer.company);
  if (buyer.country) lines.push(buyer.country);
  lines.push(buyer.email);
  if (buyer.phone) lines.push(buyer.phone);
  return lines.join("\n");
}

/**
 * Build the user-role message that pairs with INQUIRY_SYSTEM_PROMPT.
 * Keeps the input shape close to what the call site has on hand.
 */
export function buildInquiryUserPrompt(input: InquiryPromptInput): string {
  const { buyer, supplier, intent } = input;

  const buyerCompany = buyer.company || "[not specified]";
  const buyerCountry = buyer.country || "[not specified]";
  const certs = supplier.certifications?.length
    ? supplier.certifications.join(", ")
    : "none specified";
  const intentLine = intent && intent.trim().length > 0
    ? intent
    : "Standard procurement inquiry — no specific product yet.";
  const signature = buildSignature(buyer);

  return `Generate an inquiry message with these inputs:

BUYER
- Company: ${buyerCompany}
- Country: ${buyerCountry}
- Contact: ${buyer.name}

SUPPLIER
- Company: ${supplier.name}
- Country: ${supplier.country}
- Listed categories: ${supplier.categories.join(", ")}
- Certifications: ${certs}

ADDITIONAL CONTEXT
${intentLine}

SIGNATURE (use VERBATIM at end of body — do not modify, reformat, or paraphrase)
${signature}

Return strictly valid JSON with "subject" and "body" only. The body must end with the SIGNATURE block above, on its own lines, preceded by a blank line.`;
}
