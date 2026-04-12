// Email Inquiry Service - Handles export inquiry emails
// FROM: Info@brandsbridge.net

export const BRANDS_BRIDGE_EMAIL = 'Info@brandsbridge.net';

export interface EmailInquiry {
  id: string;
  companyId: string;
  companyName: string;
  companyEmail: string;
  // Client details
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientCountry: string;
  clientPhone: string;
  clientWhatsapp?: string;
  // Message
  subject: string;
  originalMessage: string;
  aiGeneratedMessage?: string;
  // Status
  status: 'draft' | 'sent' | 'replied';
  createdAt: string;
  repliedAt?: string;
}

export interface InquiryFormData {
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientCountry: string;
  clientPhone: string;
  clientWhatsapp?: string;
  subject: string;
  message: string;
}

// In-memory storage for demo (would be database in production)
let inquiries: EmailInquiry[] = [];
let nextInquiryId = 1000;

// Validate inquiry form data
export function validateInquiryForm(data: InquiryFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.push('Full name is required (minimum 2 characters)');
  }

  if (!data.clientCompany || data.clientCompany.trim().length < 2) {
    errors.push('Company name is required (minimum 2 characters)');
  }

  if (!data.clientEmail || !isValidEmail(data.clientEmail)) {
    errors.push('Valid email address is required');
  }

  if (!data.clientCountry || data.clientCountry.trim().length < 2) {
    errors.push('Country is required');
  }

  if (!data.clientPhone || !isValidPhone(data.clientPhone)) {
    errors.push('Valid phone number is required');
  }

  if (!data.message || data.message.trim().length < 20) {
    errors.push('Message is required (minimum 20 characters)');
  }

  // Sanitize for email header injection
  if (containsHeaderInjection(data.clientName) ||
      containsHeaderInjection(data.clientEmail) ||
      containsHeaderInjection(data.subject)) {
    errors.push('Invalid characters detected');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{8,20}$/;
  return phoneRegex.test(phone);
}

// Check for email header injection attempts
function containsHeaderInjection(input: string): boolean {
  const dangerous = /[\r\n]|bcc:|cc:|to:|from:|subject:|content-type:/i;
  return dangerous.test(input);
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[\r\n]/g, ' ')
    .replace(/<[^>]*>/g, '')
    .trim();
}

// Generate unique inquiry ID
function generateInquiryId(): string {
  nextInquiryId++;
  return `INQ-${nextInquiryId}`;
}

// Create email subject
export function formatEmailSubject(clientCompany: string, inquiryId: string): string {
  return `Export Inquiry – ${clientCompany} – ID #${inquiryId}`;
}

// Create email body
export function formatEmailBody(inquiry: EmailInquiry): string {
  const messageContent = inquiry.aiGeneratedMessage || inquiry.originalMessage;

  return `This inquiry was submitted via Brands Bridge AI Platform.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${inquiry.clientName}
Company: ${inquiry.clientCompany}
Country: ${inquiry.clientCountry}
Email: ${inquiry.clientEmail}
Phone: ${inquiry.clientPhone}
WhatsApp: ${inquiry.clientWhatsapp || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${messageContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please reply to this email.
Your response will be automatically forwarded to the client.

---
Powered by Brands Bridge AI
https://brandsbridge.net
`;
}

// Submit email inquiry
export async function submitEmailInquiry(
  companyId: string,
  companyName: string,
  companyEmail: string,
  formData: InquiryFormData,
  aiMessage?: string
): Promise<{ success: boolean; inquiryId?: string; error?: string }> {
  // Validate
  const validation = validateInquiryForm(formData);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors[0]
    };
  }

  // Create inquiry
  const inquiryId = generateInquiryId();
  const subject = formatEmailSubject(sanitizeInput(formData.clientCompany), inquiryId);

  const inquiry: EmailInquiry = {
    id: inquiryId,
    companyId,
    companyName,
    companyEmail,
    clientName: sanitizeInput(formData.clientName),
    clientCompany: sanitizeInput(formData.clientCompany),
    clientEmail: sanitizeInput(formData.clientEmail),
    clientCountry: sanitizeInput(formData.clientCountry),
    clientPhone: sanitizeInput(formData.clientPhone),
    clientWhatsapp: formData.clientWhatsapp ? sanitizeInput(formData.clientWhatsapp) : undefined,
    subject,
    originalMessage: sanitizeInput(formData.message),
    aiGeneratedMessage: aiMessage ? sanitizeInput(aiMessage) : undefined,
    status: 'sent',
    createdAt: new Date().toISOString()
  };

  // Save to storage
  inquiries.push(inquiry);

  // Log inquiry (for debugging)
  console.log('Email Inquiry Created:', {
    id: inquiry.id,
    from: BRANDS_BRIDGE_EMAIL,
    to: companyEmail,
    replyTo: BRANDS_BRIDGE_EMAIL,
    cc: BRANDS_BRIDGE_EMAIL,
    subject: inquiry.subject
  });

  // In production, this would call an email API
  // For now, simulate successful send
  await simulateEmailSend(inquiry);

  return {
    success: true,
    inquiryId: inquiry.id
  };
}

// Simulate email sending (replace with actual API in production)
async function simulateEmailSend(inquiry: EmailInquiry): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Email sent successfully:', {
        id: inquiry.id,
        to: inquiry.companyEmail,
        subject: inquiry.subject
      });
      resolve();
    }, 500);
  });
}

// Get inquiry by ID
export function getInquiryById(id: string): EmailInquiry | undefined {
  return inquiries.find(i => i.id === id);
}

// Get all inquiries for a company
export function getInquiriesByCompany(companyId: string): EmailInquiry[] {
  return inquiries.filter(i => i.companyId === companyId);
}

// Update inquiry status (for webhook handling)
export function updateInquiryStatus(
  inquiryId: string,
  status: 'replied',
  repliedAt?: string
): boolean {
  const inquiry = inquiries.find(i => i.id === inquiryId);
  if (inquiry) {
    inquiry.status = status;
    inquiry.repliedAt = repliedAt || new Date().toISOString();
    return true;
  }
  return false;
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Max 5 inquiries per hour per IP
const RATE_WINDOW = 3600000; // 1 hour in milliseconds

export function checkRateLimit(ipAddress: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ipAddress);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ipAddress, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}
