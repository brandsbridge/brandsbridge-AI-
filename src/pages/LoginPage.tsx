import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight, Users, Shield, Bot, Globe2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    document.title = 'Brands Bridge AI | Sign In';
  }, []);

  useEffect(() => {
    if (user) {
      const dashboardPath = user.role === 'supplier' ? '/supplier/dashboard' :
                            user.role === 'buyer' ? '/buyer/dashboard' :
                            user.role === 'shipping' ? '/freight/dashboard' :
                            user.role === 'admin' ? '/super-admin' : '/';
      navigate(dashboardPath);
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = login(email, password);
      if (success) {
        toast.success('Welcome back! Redirecting...');
      } else {
        setError('Invalid email or password. Try a demo account below.');
        toast.error('Invalid credentials');
      }
    } catch {
      setError('Login failed. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError('');
    setIsLoading(true);

    try {
      login(demoEmail, 'demo123');
      toast.success('Logging in...');
    } catch {
      setError('Demo login failed.');
      toast.error('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Shield, text: 'Secure & KYB Verified Network' },
    { icon: Bot, text: 'AI-Powered Trade Matching' },
    { icon: Globe2, text: '85+ Countries Connected' },
  ];

  const demoAccounts = [
    { role: 'Supplier', email: 'supplier@brandsbridge.ai', color: 'from-amber-500 to-orange-600', icon: '🏭' },
    { role: 'Buyer', email: 'buyer@brandsbridge.ai', color: 'from-blue-500 to-cyan-600', icon: '🛒' },
    { role: 'Freight', email: 'shipping@brandsbridge.ai', color: 'from-emerald-500 to-teal-600', icon: '🚢' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B5E75]/20 via-transparent to-[#D4AF37]/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#0B5E75]/20 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
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

        {/* Main Content */}
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            The Global FMCG
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-300">
              Trade OS
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg mb-8">
            Connect with verified manufacturers, buyers, and logistics partners worldwide.
          </p>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 bg-[#0B5E75]/30 rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-[#0B5E75]" />
                </div>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-[#111827]/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            ))}
          </div>
          <p className="text-slate-300 mb-3 italic">
            "We closed 3 containers worth $85,000 in our first month on Brands Bridge"
          </p>
          <p className="text-sm text-slate-500">
            — Ahmed Al Rashid, Al Othaim Markets 🇸🇦
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-[#0A0F1E]" />
            </div>
            <span className="text-xl font-bold text-white">Brands Bridge <span className="text-[#D4AF37]">AI</span></span>
          </div>

          <div className="bg-[#111827] rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#0B5E75] to-[#0B5E75]/80 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0B5E75]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-8 border-t border-slate-700/50">
              <p className="text-sm text-slate-500 text-center mb-4">— Quick Demo Access —</p>
              <div className="grid gap-2">
                {demoAccounts.map((demo) => (
                  <button
                    key={demo.email}
                    onClick={() => handleDemoLogin(demo.email)}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl text-white hover:border-slate-600 transition-all flex items-center justify-between group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{demo.icon}</span>
                      <span className="font-medium">{demo.role} Demo</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37] transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                New here?{' '}
                <Link to="/register" className="text-[#D4AF37] hover:text-amber-300 font-medium transition-colors">
                  Create free account →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
