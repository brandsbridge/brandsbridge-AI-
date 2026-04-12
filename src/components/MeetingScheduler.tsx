import { useState } from 'react';
import { X, Video, Phone, Calendar, Clock, Globe, Send, CheckCircle } from 'lucide-react';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  companyId: string;
}

const MeetingScheduler = ({ isOpen, onClose, companyName, companyId }: MeetingSchedulerProps) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    meetingType: 'video' as 'video' | 'voice',
    preferredDate: '',
    preferredTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    buyerName: '',
    buyerEmail: '',
    buyerCompany: '',
    buyerCountry: '',
    inquiry: ''
  });

  const timezones = [
    'Asia/Dubai', 'Asia/Riyadh', 'Europe/London', 'Europe/Berlin',
    'America/New_York', 'America/Los_Angeles', 'Asia/Singapore', 'Asia/Tokyo'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = () => {
    // Here you would send to backend
    console.log('Meeting request:', { companyId, ...formData });
    setSubmitted(true);
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Meeting Requested!</h3>
          <p className="text-slate-600 mb-6">
            Your meeting request with <span className="font-semibold">{companyName}</span> has been submitted.
            They will confirm your meeting within 24 hours.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
            <Calendar className="w-4 h-4" />
            Schedule Business Meeting
          </div>
          <h3 className="text-xl font-bold">Request Meeting with {companyName}</h3>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-amber-400' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Meeting Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Meeting Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, meetingType: 'video' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.meetingType === 'video'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Video className={`w-8 h-8 mx-auto mb-2 ${
                      formData.meetingType === 'video' ? 'text-amber-600' : 'text-slate-400'
                    }`} />
                    <div className="font-semibold text-slate-900">Video Call</div>
                    <div className="text-xs text-slate-500">Face-to-face meeting</div>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, meetingType: 'voice' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.meetingType === 'voice'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Phone className={`w-8 h-8 mx-auto mb-2 ${
                      formData.meetingType === 'voice' ? 'text-amber-600' : 'text-slate-400'
                    }`} />
                    <div className="font-semibold text-slate-900">Voice Call</div>
                    <div className="text-xs text-slate-500">Audio only</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Time
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData({ ...formData, preferredTime: time })}
                      className={`py-2 text-sm rounded-lg transition-colors ${
                        formData.preferredTime === time
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Your Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.preferredDate || !formData.preferredTime}
                className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.buyerEmail}
                  onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={formData.buyerCompany}
                  onChange={(e) => setFormData({ ...formData, buyerCompany: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Your Company Ltd."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.buyerCountry}
                  onChange={(e) => setFormData({ ...formData, buyerCountry: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="United Arab Emirates"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.buyerName || !formData.buyerEmail || !formData.buyerCompany || !formData.buyerCountry}
                  className="flex-1 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Inquiry */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What would you like to discuss? *
                </label>
                <textarea
                  value={formData.inquiry}
                  onChange={(e) => setFormData({ ...formData, inquiry: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Please describe your business inquiry, products of interest, target quantities, etc."
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="font-semibold text-slate-900 mb-2">Meeting Summary</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Type:</span>
                  <span className="text-slate-900 capitalize">{formData.meetingType} Call</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="text-slate-900">{formData.preferredDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time:</span>
                  <span className="text-slate-900">{formData.preferredTime} ({formData.timezone})</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.inquiry}
                  className="flex-1 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingScheduler;
