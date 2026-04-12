import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, CheckCircle2, Building2, Upload, ChevronRight, Sparkles, Package, Truck, Building, Check, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type UserRole = 'guest' | 'supplier' | 'buyer' | 'shipping' | 'admin';

const steps = [
  { id: 1, name: 'Role Selection', icon: Building2 },
  { id: 2, name: 'Company Info', icon: Building },
  { id: 3, name: 'Verification', icon: Upload },
  { id: 4, name: 'Welcome', icon: Sparkles },
];

const roleOptions = [
  { id: 'supplier', label: 'Supplier / Manufacturer', desc: 'List your products and connect with global buyers', icon: Package, color: 'from-amber-500 to-orange-600' },
  { id: 'buyer', label: 'Buyer / Importer', desc: 'Discover suppliers and source products efficiently', icon: Building2, color: 'from-blue-500 to-cyan-600' },
  { id: 'shipping', label: 'Freight Provider', desc: 'Offer shipping and logistics services', icon: Truck, color: 'from-emerald-500 to-teal-600' },
];

const countries = [
  'UAE', 'Saudi Arabia', 'Turkey', 'India', 'China', 'Singapore', 'USA',
  'UK', 'Germany', 'France', 'Spain', 'Italy', 'Brazil', 'Argentina',
];

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    role: '' as UserRole | '',
    companyName: '',
    country: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleRoleSelect = (role: string) => {
    setFormData(prev => ({ ...prev, role: role as UserRole }));
    setCurrentStep(2);
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentStep(4);
  };

  const handleFinish = () => {
    login(formData.email, formData.password);
    navigate('/');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!formData.role;
      case 2: return formData.companyName && formData.country && formData.email;
      case 3: return formData.password && formData.password === formData.confirmPassword;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B5E75]/20 via-transparent to-[#D4AF37]/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#0B5E75]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
              <Globe className="w-8 h-8 text-[#0A0F1E]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Brands Bridge</span>
              <span className="text-2xl font-bold text-[#D4AF37]"> AI</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Join the Global
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-300">
              Trade Revolution
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg">
            Register in 4 simple steps and start connecting with FMCG partners worldwide.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 text-slate-500">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>No credit card required</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Free basic plan</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-[#0A0F1E]" />
            </div>
            <span className="text-xl font-bold text-white">Brands Bridge <span className="text-[#D4AF37]">AI</span></span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all ${
                  currentStep >= step.id
                    ? 'bg-[#D4AF37] text-[#0A0F1E]'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-[#D4AF37]' : 'bg-slate-800'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#111827] rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Role</h2>
                <p className="text-slate-400 mb-6">Select how you want to use Brands Bridge AI</p>
                <div className="space-y-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        formData.role === role.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                        <role.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-white">{role.label}</div>
                        <div className="text-sm text-slate-400">{role.desc}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Company Info */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Company Information</h2>
                <p className="text-slate-400 mb-6">Tell us about your business</p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Your company name"
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] appearance-none"
                      >
                        <option value="">Select country</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Business Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!formData.companyName || !formData.country || !formData.email}
                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50"
                  >
                    Continue
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Account Security</h2>
                <p className="text-slate-400 mb-6">Create your password to secure your account</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Minimum 8 characters"
                        minLength={8}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Re-enter your password"
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!isStepValid() || isLoading}
                      className="flex-1 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-[#0A0F1E]/30 border-t-[#0A0F1E] rounded-full animate-spin" />
                      ) : 'Complete'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 4: Welcome */}
            {currentStep === 4 && (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Brands Bridge AI!</h2>
                <p className="text-slate-400 mb-6">Your account has been created successfully</p>
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
                  <div className="text-sm text-slate-400">Account Type</div>
                  <div className="text-white font-semibold capitalize">{formData.role}</div>
                </div>
                <button
                  onClick={handleFinish}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#D4AF37] hover:text-amber-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
