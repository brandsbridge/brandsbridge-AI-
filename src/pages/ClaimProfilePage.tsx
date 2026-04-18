import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Building2, Globe, Users, Eye, MessageCircle, Shield, CheckCircle,
  ArrowRight, Lock, AlertTriangle, Loader2, MapPin, Package
} from 'lucide-react';
import { companies } from '../data/mockData';

const ClaimProfilePage = () => {
  const { companySlug } = useParams();
  const navigate = useNavigate();

  // Find the company by slug
  const company = companies.find(c => c.slug === companySlug);

  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If company not found
  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #020817 0%, #0A0F1E 100%)' }}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Company Not Found</h1>
          <p className="text-slate-400 mb-6">
            The company profile you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/companies"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            Browse Companies
          </Link>
        </div>
      </div>
    );
  }

  // Generate random stats for unclaimed companies
  const profileViews = company.profileViews || Math.floor(Math.random() * 300) + 100;
  const pendingInquiries = company.pendingInquiries || Math.floor(Math.random() * 10) + 1;
  const countriesCount = Math.floor(Math.random() * 15) + 5;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #020817 0%, #0A0F1E 100%)' }}>
      {/* Header */}
      <nav className="py-4 px-6 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center text-[#0A0F1E] font-bold">
              BB
            </div>
            <span className="text-white font-bold text-lg">Brands Bridge AI</span>
          </Link>
          <Link
            to="/companies"
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            Back to Expo Hall
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left — Company Info */}
          <div>
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 mb-8">
              {/* Company Header */}
              <div className="flex items-center gap-4 mb-6">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-20 h-20 rounded-2xl object-cover bg-white" />
                ) : (
                  <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{company.name}</h1>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{company.countryFlag}</span>
                    <span>{company.city}, {company.country}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                      {company.businessType}
                    </span>
                    {company.categories.slice(0, 2).map(cat => (
                      <span key={cat} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  This profile hasn't been claimed yet
                </div>
                <p className="text-slate-400 text-sm">
                  Claim this profile to get full control and start receiving buyer inquiries directly.
                </p>
              </div>

              {/* Profile Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-white font-bold text-xl mb-1">
                    <Eye className="w-4 h-4" />
                    {profileViews}
                  </div>
                  <div className="text-slate-400 text-xs">profile views</div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-white font-bold text-xl mb-1">
                    <Globe className="w-4 h-4" />
                    {countriesCount}
                  </div>
                  <div className="text-slate-400 text-xs">countries</div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-white font-bold text-xl mb-1">
                    <MessageCircle className="w-4 h-4" />
                    {pendingInquiries}
                  </div>
                  <div className="text-slate-400 text-xs">inquiries</div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Claim in 3 Steps</h3>
                {[
                  { step: 1, title: 'Verify', desc: 'Confirm you work at this company' },
                  { step: 2, title: 'Complete', desc: 'Set up your profile & dashboard' },
                  { step: 3, title: 'Receive', desc: 'Start receiving buyer inquiries' },
                ].map(item => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-slate-400 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Why Claim Your Profile?
              </h3>
              <div className="space-y-3">
                {[
                  'Receive buyer inquiries directly',
                  'Update company information instantly',
                  'Upload products, photos & videos',
                  'Access Live Deal Room broadcasts',
                  'Enable Virtual Booth for VR Expo',
                  'Full analytics on profile performance',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Claim Form */}
          <div>
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-[#050D1A]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Claim This Profile</h2>
                <p className="text-slate-400">Verify your identity and take control of {company.name}'s Brands Bridge profile</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-600/50 focus:ring-[#D4AF37]'
                    }`}
                    placeholder="John Smith"
                  />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Position at Company *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 ${
                      errors.position ? 'border-red-500 focus:ring-red-500' : 'border-slate-600/50 focus:ring-[#D4AF37]'
                    }`}
                    placeholder="Export Manager"
                  />
                  {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-600/50 focus:ring-[#D4AF37]'
                    }`}
                    placeholder="john.smith@company.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Work Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-600/50 focus:ring-[#D4AF37]'
                    }`}
                    placeholder="+974 XXXX XXXX"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-600/50 focus:ring-[#D4AF37]'
                    }`}
                    placeholder="Min 8 characters"
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-600/50 focus:ring-[#D4AF37]'
                    }`}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#0B6E8C] to-[#0EA5C9] text-white rounded-xl font-semibold hover:from-[#0B6E8C]/90 hover:to-[#0EA5C9]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Claim Profile
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-slate-400 text-xs">
                  By claiming, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </div>

            {/* Help */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-[#D4AF37] hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Claim Submitted!</h3>
            <p className="text-slate-400 mb-6">
              We'll verify your identity within <span className="text-white font-medium">24 hours</span>.
              You'll receive an email once your profile is approved and ready to manage.
            </p>
            <div className="bg-slate-700/30 rounded-xl p-4 mb-6 text-left">
              <h4 className="text-white font-medium mb-2">What happens next?</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-[#0B6E8C] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">1</div>
                  <span>Our team verifies your employment at {company.name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-[#0B6E8C] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">2</div>
                  <span>You receive approval email with login details</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-[#0B6E8C] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">3</div>
                  <span>Start managing your profile and receiving inquiries!</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/companies');
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              Back to Expo Hall
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimProfilePage;
