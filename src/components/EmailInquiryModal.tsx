import { useState } from 'react';
import { X, Send, Sparkles, Loader2, CheckCircle, AlertCircle, User, Building2, Mail, Phone, Globe, MessageSquare } from 'lucide-react';
import { improveExportInquiry } from '../services/aiProvider';
import { submitEmailInquiry, InquiryFormData, validateInquiryForm } from '../services/emailService';

interface EmailInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
  companyEmail: string;
}

const COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Jordan',
  'Egypt', 'Turkey', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Netherlands',
  'USA', 'Canada', 'Brazil', 'Mexico', 'India', 'China', 'Japan', 'South Korea', 'Australia',
  'South Africa', 'Nigeria', 'Kenya', 'Morocco', 'Algeria', 'Tunisia', 'Russia', 'Poland'
].sort();

export default function EmailInquiryModal({
  isOpen,
  onClose,
  companyId,
  companyName,
  companyEmail
}: EmailInquiryModalProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientCountry: '',
    clientPhone: '',
    clientWhatsapp: '',
    subject: 'Export Inquiry',
    message: ''
  });

  const [aiMessage, setAiMessage] = useState<string>('');
  const [isImproving, setIsImproving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [inquiryId, setInquiryId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear AI message if original message changes
    if (name === 'message') {
      setAiMessage('');
    }
  };

  // AI Improve - Only triggered on user click
  const handleImproveWithAI = async () => {
    if (!formData.message.trim() || formData.message.length < 20) {
      setErrorMessage('Please write at least 20 characters before improving');
      return;
    }

    setIsImproving(true);
    setErrorMessage('');

    try {
      const result = await improveExportInquiry({
        clientName: formData.clientName || 'Client',
        clientCompany: formData.clientCompany || 'Company',
        country: formData.clientCountry || 'International',
        originalMessage: formData.message
      });

      if (result.success) {
        setAiMessage(result.content);
      } else {
        setErrorMessage(result.error || 'Failed to improve message');
      }
    } catch {
      setErrorMessage('Failed to connect to AI service');
    } finally {
      setIsImproving(false);
    }
  };

  // Send Inquiry
  const handleSendInquiry = async () => {
    // Validate form
    const validation = validateInquiryForm(formData);
    if (!validation.valid) {
      setErrorMessage(validation.errors[0]);
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    try {
      const result = await submitEmailInquiry(
        companyId,
        companyName,
        companyEmail,
        formData,
        aiMessage || undefined
      );

      if (result.success) {
        setStatus('success');
        setInquiryId(result.inquiryId || '');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to send inquiry');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Failed to send inquiry. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setFormData({
      clientName: '',
      clientCompany: '',
      clientEmail: '',
      clientCountry: '',
      clientPhone: '',
      clientWhatsapp: '',
      subject: 'Export Inquiry',
      message: ''
    });
    setAiMessage('');
    setStatus('idle');
    setErrorMessage('');
    setInquiryId('');
    onClose();
  };

  if (!isOpen) return null;

  // Success state
  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Inquiry Sent Successfully!</h3>
          <p className="text-slate-600 mb-4">
            Your export inquiry has been sent to <strong>{companyName}</strong>.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-500">Reference ID</p>
            <p className="font-mono font-bold text-lg text-slate-900">{inquiryId}</p>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            The company will reply to your email at <strong>{formData.clientEmail}</strong>
          </p>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send Export Inquiry</h2>
            <p className="text-sm text-slate-500">To: {companyName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Error message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Building2 className="w-4 h-4 inline mr-1" />
                Company Name *
              </label>
              <input
                type="text"
                name="clientCompany"
                value={formData.clientCompany}
                onChange={handleChange}
                placeholder="Your company name"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Row 2: Email & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Globe className="w-4 h-4 inline mr-1" />
                Country *
              </label>
              <select
                name="clientCountry"
                value={formData.clientCountry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                required
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Phone & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="+971 50 123 4567"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                WhatsApp (Optional)
              </label>
              <input
                type="tel"
                name="clientWhatsapp"
                value={formData.clientWhatsapp}
                onChange={handleChange}
                placeholder="+971 50 123 4567"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Export Inquiry"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your inquiry: products of interest, estimated quantities, target market, certifications needed, etc."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Minimum 20 characters. {formData.message.length}/20
            </p>
          </div>

          {/* AI Improved Message Preview */}
          {aiMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm mb-2">
                <Sparkles className="w-4 h-4" />
                AI-Improved Message
              </div>
              <p className="text-slate-700 text-sm whitespace-pre-line">{aiMessage}</p>
              <button
                onClick={() => setAiMessage('')}
                className="text-xs text-emerald-600 hover:text-emerald-700 mt-2 underline"
              >
                Use original message instead
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          {/* Improve with AI button */}
          <button
            onClick={handleImproveWithAI}
            disabled={isImproving || isSending || !formData.message.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-purple-200 text-purple-700 font-medium rounded-xl hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isImproving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Improving...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Improve with AI
              </>
            )}
          </button>

          {/* Send button */}
          <button
            onClick={handleSendInquiry}
            disabled={isSending || isImproving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Inquiry
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
