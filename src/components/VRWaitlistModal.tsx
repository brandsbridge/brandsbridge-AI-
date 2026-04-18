import { useState } from 'react';
import { X, CheckCircle, PartyPopper } from 'lucide-react';

interface VRWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VRWaitlistModal = ({ isOpen, onClose }: VRWaitlistModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    country: '',
    role: '',
    vrPlatforms: [] as string[],
    excitement: ''
  });
  const [keepUpdated, setKeepUpdated] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistNumber] = useState(() => Math.floor(Math.random() * 200) + 400);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      country: '',
      role: '',
      vrPlatforms: [],
      excitement: ''
    });
    setKeepUpdated(true);
    onClose();
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      vrPlatforms: prev.vrPlatforms.includes(platform)
        ? prev.vrPlatforms.filter(p => p !== platform)
        : [...prev.vrPlatforms, platform]
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
          border: '1px solid rgba(123, 97, 255, 0.3)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(123, 97, 255, 0.1)'
        }}
      >
        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-slate-700/50"
                style={{ color: '#94A3B8' }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
                >
                  <span className="text-3xl">🥽</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Join the VR Revolution</h3>
                <p className="text-slate-400 text-sm">
                  Be first in line when Brands Bridge VR launches in 2027
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(100, 116, 139, 0.3)'
                  }}
                  placeholder="Ahmed Al-Rashid"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Company Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(100, 116, 139, 0.3)'
                  }}
                  placeholder="Almarai Company"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Email <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(100, 116, 139, 0.3)'
                  }}
                  placeholder="ahmed@almarai.com"
                  required
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Country <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(100, 116, 139, 0.3)'
                  }}
                  required
                >
                  <option value="">Select your country</option>
                  <option value="🇸🇦 Saudi Arabia">🇸🇦 Saudi Arabia</option>
                  <option value="🇦🇪 UAE">🇦🇪 UAE</option>
                  <option value="🇶🇦 Qatar">🇶🇦 Qatar</option>
                  <option value="🇰🇼 Kuwait">🇰🇼 Kuwait</option>
                  <option value="🇧🇭 Bahrain">🇧🇭 Bahrain</option>
                  <option value="🇴🇲 Oman">🇴🇲 Oman</option>
                  <option value="🇹🇷 Turkey">🇹🇷 Turkey</option>
                  <option value="🇩🇪 Germany">🇩🇪 Germany</option>
                  <option value="🇳🇱 Netherlands">🇳🇱 Netherlands</option>
                  <option value="🇬🇧 UK">🇬🇧 UK</option>
                  <option value="🇺🇸 USA">🇺🇸 USA</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Role <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Supplier', 'Buyer', 'Freight', '3PL'].map((role) => (
                    <label
                      key={role}
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.role === role
                          ? 'bg-violet-500/20 border-violet-500/50'
                          : 'bg-slate-700/30 border-slate-600/50'
                      }`}
                      style={{
                        borderColor: formData.role === role ? '#8B5CF6' : 'rgba(100, 116, 139, 0.3)'
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium" style={{
                        color: formData.role === role ? '#C4B5FD' : '#94A3B8'
                      }}>
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* VR Platform Preference */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Which VR platform do you prefer?
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'meta-quest', label: 'Meta Quest' },
                    { value: 'apple-vision', label: 'Apple Vision Pro' },
                    { value: 'webvr', label: 'WebVR (browser)' },
                    { value: 'not-sure', label: 'Not sure yet' }
                  ].map((platform) => (
                    <label
                      key={platform.value}
                      className={`flex items-center px-4 py-2 rounded-full border cursor-pointer transition-all ${
                        formData.vrPlatforms.includes(platform.value)
                          ? 'bg-cyan-500/20 border-cyan-500/50'
                          : 'bg-slate-700/30 border-slate-600/50'
                      }`}
                      style={{
                        borderColor: formData.vrPlatforms.includes(platform.value) ? '#22D3EE' : 'rgba(100, 116, 139, 0.3)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.vrPlatforms.includes(platform.value)}
                        onChange={() => togglePlatform(platform.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium" style={{
                        color: formData.vrPlatforms.includes(platform.value) ? '#67E8F9' : '#94A3B8'
                      }}>
                        {platform.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Excitement Textarea */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  What excites you most about VR trade? <span className="text-slate-500">(optional)</span>
                </label>
                <textarea
                  value={formData.excitement}
                  onChange={(e) => setFormData({...formData, excitement: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 resize-none"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    minHeight: '80px'
                  }}
                  placeholder="I'm excited about walking through virtual booths and meeting suppliers face-to-face..."
                  rows={3}
                />
              </div>

              {/* Keep Updated Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="keepUpdated"
                  checked={keepUpdated}
                  onChange={(e) => setKeepUpdated(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded"
                  style={{ accentColor: '#7C3AED' }}
                />
                <label htmlFor="keepUpdated" className="text-slate-300 text-sm cursor-pointer">
                  Keep me updated on VR progress and exclusive early access opportunities
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
                  color: '#0F172A',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                }}
              >
                <span>🥽</span>
                Join Waitlist
                <span>→</span>
              </button>

              {/* Benefits */}
              <div className="flex items-center justify-center gap-6 text-sm text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Free to join
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Early access
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  No obligation
                </span>
              </div>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                boxShadow: '0 0 60px rgba(16, 185, 129, 0.4)'
              }}
            >
              <PartyPopper className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-3xl font-bold text-white mb-2">
              You're on the list!
            </h3>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(123, 97, 255, 0.2)',
                border: '1px solid rgba(123, 97, 255, 0.3)'
              }}
            >
              <span className="text-2xl font-bold" style={{ color: '#A78BFA' }}>
                #{waitlistNumber}
              </span>
              <span className="text-slate-300">on the waitlist</span>
            </div>

            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              We'll email you when VR access becomes available. Get ready to experience the future of trade!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Brands Bridge VR Waitlist',
                      text: `I just joined the Brands Bridge VR waitlist! I'm #${waitlistNumber}. Join me:`,
                      url: window.location.origin
                    });
                  } else {
                    navigator.clipboard.writeText(`I just joined the Brands Bridge VR waitlist! Join me: ${window.location.origin}/vr-experience`);
                  }
                }}
                className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  color: '#F8FAFC'
                }}
              >
                Share with team
              </button>

              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
                  color: '#0F172A'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VRWaitlistModal;
