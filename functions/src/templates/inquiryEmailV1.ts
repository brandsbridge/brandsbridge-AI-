/**
 * Brands Bridge inquiry email template — version 1.
 * Table-based layout, inline CSS, mobile-responsive (600px container).
 *
 * Bumping the version is the contract for analytics: every inquiry
 * doc records the template version used to render its email.
 */
export const INQUIRY_EMAIL_TEMPLATE_VERSION = "v1";

export interface InquiryEmailInput {
  subject: string;
  body: string;
  /**
   * @deprecated v1 no longer renders buyerCompany in the header — the
   * platform ("Brands Bridge AI") is the visible sender; the buyer is
   * identified inside the AI body. Field is retained on the input for
   * future template versions that may surface it elsewhere.
   */
  buyerCompany: string;
  buyerEmail: string;
  supplierName: string;
  inquiryId: string;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphsToHtml(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px 0;">${escape(p).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

export function buildInquiryEmailHtml(input: InquiryEmailInput): string {
  const subject = escape(input.subject);
  const buyerEmail = escape(input.buyerEmail);
  const inquiryId = escape(input.inquiryId);
  const bodyHtml = paragraphsToHtml(input.body);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .padding-mobile { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F5F5F5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F5F5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#0D1B2A;padding:32px 40px;border-bottom:3px solid #F5A623;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;background-color:#F5A623;color:#0D1B2A;font-weight:bold;font-size:18px;padding:8px 12px;border-radius:6px;letter-spacing:1px;">BB</span>
                    <span style="color:#FFFFFF;font-size:22px;font-weight:600;margin-left:12px;letter-spacing:0.5px;">Brands Bridge</span>
                    <span style="display:inline-block;background-color:#102D3F;color:#00D4D4;font-size:12px;font-weight:600;padding:4px 8px;border-radius:4px;margin-left:8px;letter-spacing:1px;">AI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="padding-mobile" style="background-color:#0D1B2A;padding:0 40px 32px 40px;">
              <h1 style="margin:0;color:#FFFFFF;font-size:24px;font-weight:600;line-height:1.3;">From Brands Bridge AI</h1>
            </td>
          </tr>
          <tr>
            <td class="padding-mobile" style="padding:40px;background-color:#FFFFFF;">
              <div style="color:#1F2937;font-size:15px;line-height:1.7;">
                ${bodyHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td class="padding-mobile" style="padding:0 40px 32px 40px;background-color:#FFFFFF;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E5E7EB;">
                <tr>
                  <td style="padding-top:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <span style="display:inline-block;background-color:#F5A623;color:#0D1B2A;font-weight:bold;font-size:14px;padding:6px 10px;border-radius:4px;letter-spacing:1px;">BB</span>
                        </td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="color:#0D1B2A;font-size:16px;font-weight:600;">Brands Bridge</span>
                          <span style="display:inline-block;background-color:#E0F7F7;color:#02838C;font-size:10px;font-weight:600;padding:2px 6px;border-radius:3px;margin-left:6px;letter-spacing:1px;">AI</span>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                      <tr>
                        <td style="color:#6B7280;font-size:14px;line-height:1.8;">
                          &#128222; +974 6610 800<br />
                          &#128231; <a href="mailto:info@brandsbridge.net" style="color:#02C39A;text-decoration:none;">info@brandsbridge.net</a><br />
                          &#128205; Doha, Qatar
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0D1B2A;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#F5A623;font-size:18px;font-weight:700;letter-spacing:0.5px;">Connect. Trade. Grow.</p>
              <p style="margin:6px 0 0 0;color:#94A3B8;font-size:12px;letter-spacing:1px;text-transform:uppercase;">The Digital Alternative to Trade Shows</p>
            </td>
          </tr>
          <tr>
            <td class="padding-mobile" style="padding:24px 40px;background-color:#F9FAFB;border-top:1px solid #E5E7EB;text-align:center;">
              <p style="margin:0;color:#6B7280;font-size:13px;line-height:1.6;">
                Reply directly to this email &mdash; your reply goes to <a href="mailto:${buyerEmail}" style="color:#02C39A;text-decoration:none;">${buyerEmail}</a>.
              </p>
              <p style="margin:12px 0 0 0;color:#9CA3AF;font-size:11px;">
                Inquiry ID: ${inquiryId}<br />
                Sent via Brands Bridge AI &middot; brandsbridge.net
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildInquiryEmailText(input: InquiryEmailInput): string {
  const sep = "===============================";
  const dash = "-------------------------------";
  return `${sep}
From Brands Bridge AI
${sep}

${input.body}

${dash}
Brands Bridge AI
+974 6610 800
info@brandsbridge.net
Doha, Qatar
${dash}

Connect. Trade. Grow.
The Digital Alternative to Trade Shows.

Reply directly to this email -- your reply goes to ${input.buyerEmail}.

Inquiry ID: ${input.inquiryId}
Sent via Brands Bridge AI - brandsbridge.net
`;
}
