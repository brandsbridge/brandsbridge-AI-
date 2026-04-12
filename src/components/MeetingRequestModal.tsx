import { useState } from 'react';
import { X, Calendar, Clock, Video, Phone, Send, CheckCircle, Building2, User, Mail, Globe, MapPin, Package, MessageSquare } from 'lucide-react';
import { Company, MeetingRequest } from '../data/mockData';

interface MeetingRequestModalProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate confirmation token
const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Timezones for international trade
const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (AST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
];

// Countries for dropdown
const countries = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'Egypt', 'Jordan', 'Lebanon', 'Iraq', 'Morocco', 'Algeria', 'Tunisia', 'Libya',
  'Turkey', 'Germany', 'France', 'United Kingdom', 'Netherlands', 'Poland', 'Italy', 'Spain',
  'USA', 'Canada', 'Brazil', 'Mexico', 'Argentina',
  'China', 'India', 'Japan', 'South Korea', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam',
  'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia',
  'Australia', 'New Zealand',
  'Russia', 'Ukraine', 'Kazakhstan',
  'Other'
];

export default function MeetingRequestModal({ company, isOpen, onClose }: MeetingRequestModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingRequest, setMeetingRequest] = useState<MeetingRequest | null>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    clientCountry: '',
    clientPhone: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'Asia/Dubai',
    meetingType: 'video' as 'video' | 'voice',
    productInterest: '',
    message: '',
    estimatedVolume: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create meeting request
    const newRequest: MeetingRequest = {
      id: generateId(),
      companyId: company.id,
      companyName: company.name,
      companySlug: company.slug,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientCompany: formData.clientCompany,
      clientCountry: formData.clientCountry,
      clientPhone: formData.clientPhone,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      timezone: formData.timezone,
      meetingType: formData.meetingType,
      googleMeetLink: company.googleMeetLink || `https://meet.google.com/${generateId()}`,
      productInterest: formData.productInterest,
      message: formData.message,
      estimatedVolume: formData.estimatedVolume,
      status: 'pending',
      createdAt: new Date().toISOString(),
      confirmationToken: generateToken(),
      companyNotified: true,
      clientNotified: true,
      adminNotified: true,
    };

    setMeetingRequest(newRequest);
    setIsSubmitting(false);
    setStep('success');

    // In production, this would:
    // 1. Save to database
    // 2. Send email to company.internationalSalesEmail or company.exportManager.email
    // 3. Send confirmation email to client
    // 4. Notify admin
    console.log('Meeting Request Created:', newRequest);
  };

  const resetForm = () => {
    setStep('form');
    setFormData({
      clientName: '',
      clientEmail: '',
      clientCompany: '',
      clientCountry: '',
      clientPhone: '',
      preferredDate: '',
      preferredTime: '',
      timezone: 'Asia/Dubai',
      meetingType: 'video',
      productInterest: '',
      message: '',
      estimatedVolume: '',
    });
    setMeetingRequest(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand to-luxury-chocolate p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Request a Meeting</h2>
                <p className="text-white/80 text-sm">with {company.name}</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); onClose(); }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Your Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand flex items-center gap-2">
                  <User className="w-5 h-5 text-luxury-gold" />
                  Your Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        required
                        className="input-luxury pl-10"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                        required
                        className="input-luxury pl-10"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="clientCompany"
                        value={formData.clientCompany}
                        onChange={handleInputChange}
                        required
                        className="input-luxury pl-10"
                        placeholder="Your Company Ltd."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="clientCountry"
                        value={formData.clientCountry}
                        onChange={handleInputChange}
                        required
                        className="input-luxury pl-10 appearance-none cursor-pointer"
                      >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (WhatsApp preferred)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleInputChange}
                        className="input-luxury pl-10"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-luxury-gold" />
                  Meeting Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="input-luxury pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        required
                        className="input-luxury pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone *</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        required
                        className="input-luxury pl-10 appearance-none cursor-pointer"
                      >
                        {timezones.map(tz => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type *</label>
                    <div className="flex gap-3">
                      <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.meetingType === 'video' ? 'border-luxury-gold bg-luxury-gold/10' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="meetingType"
                          value="video"
                          checked={formData.meetingType === 'video'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <Video className={`w-5 h-5 ${formData.meetingType === 'video' ? 'text-luxury-gold' : 'text-gray-400'}`} />
                        <span className={`font-medium ${formData.meetingType === 'video' ? 'text-brand' : 'text-gray-600'}`}>Video Call</span>
                      </label>
                      <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.meetingType === 'voice' ? 'border-luxury-gold bg-luxury-gold/10' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="meetingType"
                          value="voice"
                          checked={formData.meetingType === 'voice'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <Phone className={`w-5 h-5 ${formData.meetingType === 'voice' ? 'text-luxury-gold' : 'text-gray-400'}`} />
                        <span className={`font-medium ${formData.meetingType === 'voice' ? 'text-brand' : 'text-gray-600'}`}>Voice Call</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Interest */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand flex items-center gap-2">
                  <Package className="w-5 h-5 text-luxury-gold" />
                  Product Interest
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Products of Interest *</label>
                    <input
                      type="text"
                      name="productInterest"
                      value={formData.productInterest}
                      onChange={handleInputChange}
                      required
                      className="input-luxury"
                      placeholder="e.g., Chocolate bars, Biscuits, Snacks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Volume</label>
                    <input
                      type="text"
                      name="estimatedVolume"
                      value={formData.estimatedVolume}
                      onChange={handleInputChange}
                      className="input-luxury"
                      placeholder="e.g., 2 containers/month"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Message to {company.name} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="input-luxury resize-none"
                    placeholder="Introduce yourself and describe what you're looking for..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Meeting Request
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  {company.name} will receive your request and respond within 24 hours.
                </p>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>

              <h3 className="text-2xl font-bold text-brand mb-2">Meeting Request Sent!</h3>
              <p className="text-gray-600 mb-6">
                Your meeting request has been sent to <span className="font-semibold">{company.name}</span>.
              </p>

              <div className="bg-luxury-ivory rounded-xl p-6 text-left mb-6">
                <h4 className="font-semibold text-brand mb-4">Request Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference ID:</span>
                    <span className="font-mono text-brand">{meetingRequest?.id.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="text-brand">{formData.preferredDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="text-brand">{formData.preferredTime} ({formData.timezone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="text-brand capitalize flex items-center gap-1">
                      {formData.meetingType === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      {formData.meetingType} Call
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="text-amber-600 font-medium">Pending Confirmation</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-800 text-sm">
                  <strong>What happens next?</strong><br />
                  {company.name}'s international sales team will review your request and send you a confirmation email with the Google Meet link.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { resetForm(); onClose(); }}
                  className="flex-1 py-3 px-4 border-2 border-brand text-brand rounded-xl font-semibold hover:bg-brand hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 btn-gold py-3"
                >
                  Request Another Meeting
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
