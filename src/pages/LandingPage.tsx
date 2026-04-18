import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Search, Globe, Building2, Users, TrendingUp, Shield, MessageCircle,
  ArrowRight, CheckCircle, MapPin, Factory, BadgeCheck, Plane,
  DollarSign, Clock, Zap, BarChart3, Ship, Play, Package,
  ShoppingCart, Truck, Bot, LineChart, Mail, ChevronRight, Star,
  Sparkles, Video, FileText, Timer, Lock, Anchor,
  Coins, TrendingDown, ChevronDown, Radio, Zap as Lightning, Calendar
} from 'lucide-react';
import ExpoCountdown from '../components/ExpoCountdown';
import AnnouncementBar from '../components/AnnouncementBar';
import VRSection from '../components/VRSection';
import { upcomingExpo, expoPackages, expoTestimonials, formatExpoDate } from '../data/expoData';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Market prices state
  const [prices, setPrices] = useState([
    { name: 'Wheat', price: 265, change: 1.21, unit: 'MT', trend: 'up' },
    { name: 'Sugar', price: 632, change: 2.88, unit: 'MT', trend: 'up' },
    { name: 'Palm Oil', price: 985, change: -0.45, unit: 'MT', trend: 'down' },
    { name: 'Cocoa', price: 5840, change: 6.18, unit: 'MT', trend: 'up' },
    { name: 'Coffee', price: 185, change: 1.90, unit: 'MT', trend: 'up' },
    { name: 'Milk Powder', price: 3200, change: -0.8, unit: 'MT', trend: 'down' },
  ]);

  // Live session timer
  const [sessionTime, setSessionTime] = useState(75 * 60 + 30);

  useEffect(() => {
    document.title = 'Brands Bridge AI | Global FMCG Trade Platform';
  }, []);

  // Animate market prices
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const fluctuation = (Math.random() - 0.5) * 0.5;
        const newChange = parseFloat((p.change + fluctuation).toFixed(2));
        const newPrice = parseFloat((p.price * (1 + fluctuation / 100)).toFixed(2));
        return { ...p, price: newPrice, change: newChange, trend: newChange >= 0 ? 'up' : 'down' };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExporting = () => user ? navigate('/supplier/dashboard') : navigate('/register');
  const handleWatchDemo = () => toast.success('Demo video coming soon!');

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #020817 0%, #0A0F1E 40%, #0D1A2D 70%, #020817 100%)' }}>

      {/* ========== ANNOUNCEMENT BAR ========== */}
      <AnnouncementBar />

      {/* ========== NAVBAR ========== */}
      <nav style={{
        background: 'rgba(2,8,23,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1E2D45',
        padding: '0 24px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        {/* Gold line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }} />

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0F1E', fontWeight: 'bold', fontSize: '16px', fontFamily: 'Syne, sans-serif' }}>BB</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: '#F8FAFC' }}>
            Brands <span style={{ color: '#D4AF37' }}>Bridge</span>
            <span style={{ background: 'linear-gradient(135deg, #0B6E8C, #0EA5C9)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: 600 }}>AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/companies" className="px-4 py-2 text-[#94A3B8] hover:text-white transition-all rounded-lg text-sm font-medium">Expo Hall</Link>
          <Link to="/how-it-works" className="px-4 py-2 text-[#94A3B8] hover:text-white transition-all rounded-lg text-sm font-medium">How It Works</Link>
          <Link to="/pricing" className="px-4 py-2 text-[#94A3B8] hover:text-white transition-all rounded-lg text-sm font-medium">Pricing</Link>
          <Link to="/market" className="px-4 py-2 text-[#94A3B8] hover:text-white transition-all rounded-lg text-sm font-medium">Market Prices</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={() => navigate(user.role === 'supplier' ? '/supplier/dashboard' : '/buyer/dashboard')} className="btn-primary text-white text-sm">Go to Dashboard</button>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-[#94A3B8] hover:text-white transition-all text-sm font-medium">Login</Link>
              <Link to="/register" className="btn-gold text-sm flex items-center gap-1">
                Join Free <span>→</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* Grid Pattern */}
        <div className="hero-grid" />

        {/* Floating Orbs */}
        <div className="hero-orb hero-orb-teal" style={{ width: '500px', height: '500px', top: '10%', left: '10%' }} />
        <div className="hero-orb hero-orb-gold" style={{ width: '400px', height: '400px', top: '50%', right: '10%' }} />
        <div className="hero-orb hero-orb-purple" style={{ width: '450px', height: '450px', bottom: '20%', left: '30%' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center w-full">
          {/* Hero Badge */}
          <div className="hero-badge inline-flex items-center gap-2 mb-8">
            <Globe className="w-4 h-4" />
            The Digital Alternative to Trade Shows
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(48px, 8vw, 72px)', letterSpacing: '-2px', color: '#F8FAFC', marginBottom: '16px' }}>
            Connect. Trade. <span className="text-hero-gradient">Grow.</span>
          </h1>

          <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 48px)', color: '#94A3B8', marginBottom: '24px' }}>
            Without Leaving Your Office.
          </p>

          <p style={{ color: '#94A3B8', fontSize: '18px', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Brands Bridge AI connects FMCG manufacturers with global buyers through AI-powered matching, live deal rooms, and smart logistics — 365 days a year.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button onClick={handleStartExporting} className="btn-primary text-white text-lg flex items-center gap-2">
              Start Exporting Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={handleWatchDemo} className="btn-secondary text-lg flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch How It Works
            </button>
          </div>

          {/* Trust Line */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#475569]">
            <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#10B981]" /> Free for Buyers</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#10B981]" /> No setup fees</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#10B981]" /> KYB Verified Network</span>
          </div>
        </div>
      </section>

      {/* ========== VR SECTION ========== */}
      <div id="vr-section">
        <VRSection />
      </div>

      {/* ========== STATS BAR ========== */}
      <section className="stats-bar py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '2,450+', label: 'Companies', icon: Building2 },
              { value: '85+', label: 'Countries', icon: Globe },
              { value: '$124M+', label: 'Trade Volume', icon: DollarSign },
              { value: '15,000+', label: 'Deals Closed', icon: TrendingUp },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: '#D4AF37' }} />
                <div className="text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#D4AF37' }}>{stat.value}</div>
                <div className="text-[#94A3B8]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MONTHLY LIVE EXPO SECTION ========== */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #071120 0%, #0C1829 50%, #071120 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Countdown Banner */}
          <div className="rounded-2xl p-6 md:p-8 mb-10" style={{ background: 'linear-gradient(135deg, #0B6E8C, #050D1A, #D4AF37)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-400 text-sm font-semibold">NEXT LIVE EXPO DAY</span>
              </div>

              {/* Countdown Timer */}
              <div className="mb-4">
                <ExpoCountdown targetDate={`${upcomingExpo.date}T${upcomingExpo.startTime}:00`} />
              </div>

              <p className="text-white/80 text-lg">
                {formatExpoDate(upcomingExpo.date)} • {upcomingExpo.startTime}:00 — {upcomingExpo.endTime}:00 ({upcomingExpo.timezone})
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button
                onClick={() => navigate('/register?role=supplier&expo=true')}
                className="px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #B8962E)', color: '#050D1A' }}
              >
                Register as Exhibitor →
              </button>
              <button
                onClick={() => navigate('/register?role=buyer')}
                className="px-8 py-3 rounded-xl font-semibold text-lg flex items-center gap-2"
                style={{ background: 'rgba(14,165,201,0.2)', border: '1px solid #0EA5C9', color: '#0EA5C9' }}
              >
                Browse as Buyer (Free) →
              </button>
            </div>

            {/* Live Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-white/80">
                <Building2 className="w-4 h-4" style={{ color: '#D4AF37' }} />
                {upcomingExpo.registeredCompanies} companies registered
              </span>
              <span className="flex items-center gap-2 text-white/80">
                <Users className="w-4 h-4" style={{ color: '#0EA5C9' }} />
                {upcomingExpo.confirmedBuyers} buyers confirmed
              </span>
              <span className="flex items-center gap-2 text-white/80">
                <Radio className="w-4 h-4" style={{ color: '#EF4444' }} />
                {upcomingExpo.totalRoomsBooked} live rooms ready
              </span>
            </div>
          </div>

          {/* Main Expo Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
              <Calendar className="w-4 h-4" />
              MONTHLY EVENT
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
              Brands Bridge Live Expo
            </h2>
            <p className="text-2xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
              The Monthly Global FMCG Trade Day
            </p>
            <p className="text-[#94A3B8] max-w-3xl mx-auto text-lg">
              Every month, hundreds of verified FMCG suppliers, manufacturers, and freight providers go LIVE simultaneously. Buyers browse and negotiate 1-on-1 across dozens of live deal rooms — all in one day, all in one place.
            </p>
          </div>

          {/* How It Works - 3 Columns */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* For Suppliers */}
            <div className="text-center p-8 rounded-2xl" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8962E)' }}>
                <Factory className="w-8 h-8 text-[#050D1A]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">For Suppliers</h3>
              <p className="text-[#94A3B8] mb-4">Register your team. Choose how many export sellers will join. Each seller gets their own live deal room.</p>
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                From $149/slot
              </div>
            </div>

            {/* For Buyers */}
            <div className="text-center p-8 rounded-2xl" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5C9, #0B6E8C)' }}>
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">For Buyers</h3>
              <p className="text-[#94A3B8] mb-4">Join any live room. Meet export teams face-to-face. Get quotes and close deals in one session.</p>
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                Always FREE
              </div>
            </div>

            {/* For Freight */}
            <div className="text-center p-8 rounded-2xl" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}>
                <Ship className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">For Freight</h3>
              <p className="text-[#94A3B8] mb-4">Connect with exporters during the expo. Offer freight quotes in real time. Get cargo requests from all exhibitors.</p>
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                From $99
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {[
              { value: '47', label: 'Companies Registered', icon: Building2, color: '#D4AF37' },
              { value: '312', label: 'Buyers Confirmed', icon: Users, color: '#0EA5C9' },
              { value: '124', label: 'Live Rooms Ready', icon: Radio, color: '#EF4444' },
              { value: '28', label: 'Countries', icon: Globe, color: '#8B5CF6' },
              { value: '$2.4M', label: 'Last Expo Deals', icon: DollarSign, color: '#10B981' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
                <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-[#94A3B8]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Past Expo Highlights */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white text-center mb-8">What happened at our last expo</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {expoTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-6 rounded-2xl" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" style={{ color: '#D4AF37', fill: '#D4AF37' }} />)}
                  </div>
                  <p className="text-[#94A3B8] mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{testimonial.author}</div>
                      <div className="text-[#475569] text-xs">{testimonial.company} {testimonial.flag}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white text-center mb-2">Exhibitor Packages</h3>
            <p className="text-[#94A3B8] text-center mb-8">How many sellers are joining your team?</p>

            <div className="grid md:grid-cols-4 gap-6">
              {expoPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-6 rounded-2xl relative ${pkg.popular ? 'ring-2 ring-[#D4AF37]' : ''}`}
                  style={{
                    background: '#0A0F1E',
                    border: `1px solid ${pkg.popular ? '#D4AF37' : '#1E2D45'}`
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: '#D4AF37', color: '#050D1A' }}>
                      ⭐ Most Popular
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-white mb-1">{pkg.name}</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-bold" style={{ color: '#D4AF37' }}>${pkg.price}</span>
                    <span className="text-[#475569] text-sm">/expo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/register?role=supplier&expo=true&package=' + pkg.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#050D1A] hover:from-amber-300 hover:to-amber-500'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    Register {pkg.name} →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Annual Discount Banner */}
          <div className="text-center p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.3)' }}>
            <p className="text-white text-lg">
              Subscribe to all 12 monthly expos and <span className="font-bold" style={{ color: '#D4AF37' }}>save 30%</span> — from <span className="font-bold" style={{ color: '#D4AF37' }}>$1,250/year</span>
            </p>
          </div>
        </div>
      </section>

      {/* ========== LIVE DEAL ROOM SHOWCASE ========== */}
      <section className="py-20" style={{ background: '#0A0F1E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EF4444]"></span>
                </span>
                LIVE NOW • 4 sessions active
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
                Meet Buyers <span style={{ color: '#F8FAFC' }}>Face-to-Face</span>
              </h2>
              <p className="text-2xl font-semibold mb-6" style={{ color: '#D4AF37' }}>
                Without the Travel
              </p>

              <p className="text-[#94A3B8] text-lg mb-8">
                Our Live Deal Rooms replace expensive trade show booths. Go live anytime, admit verified buyers, negotiate in real-time, and close deals instantly.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Bot, text: 'Smart buyer queue with AI matching' },
                  { icon: MessageCircle, text: 'Real-time price negotiation chat' },
                  { icon: FileText, text: 'Instant proforma invoice generation' },
                  { icon: Video, text: 'Record sessions for compliance' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[#94A3B8]">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#10B981' }} />
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" style={{ color: '#0EA5C9' }} />
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-8 mb-8">
                <div>
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#D4AF37' }}>$47,500</div>
                  <div className="text-sm text-[#94A3B8]">avg session revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#D4AF37' }}>92%</div>
                  <div className="text-sm text-[#94A3B8]">buyer match accuracy</div>
                </div>
              </div>

              <button onClick={() => navigate('/register?role=supplier')} className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', color: 'white', boxShadow: '0 4px 16px rgba(239,68,68,0.3)' }}>
                <Radio className="w-5 h-5" />
                Start Your Live Room →
              </button>
              <p className="text-sm text-[#475569] mt-3">Free during beta • No setup needed</p>
            </div>

            {/* RIGHT SIDE - Live Deal Room Mockup */}
            <div className="relative">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(239,68,68,0.2), transparent)', borderRadius: '16px', filter: 'blur(40px)' }} />
              <div className="relative rounded-2xl overflow-hidden" style={{ background: '#0D1526', border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ background: 'linear-gradient(to right, rgba(239,68,68,0.2), transparent)', borderBottom: '1px solid #1E2D45' }}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EF4444]"></span>
                    </span>
                    <span className="font-semibold text-sm" style={{ color: '#EF4444' }}>LIVE NOW</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#94A3B8] text-sm font-mono">{formatTime(sessionTime)}</span>
                    <span className="text-[#94A3B8] text-sm">5 Buyers Waiting</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="rounded-xl aspect-video flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E2D45, #0D1526)' }}>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,110,140,0.3), rgba(212,175,55,0.1))' }} />
                    <div className="relative text-center">
                      <Video className="w-16 h-16 mx-auto mb-2" style={{ color: '#475569' }} />
                      <span className="text-sm" style={{ color: '#475569' }}>Video Session Active</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#0B6E8C' }}>
                            <span className="text-white font-bold">AM</span>
                          </div>
                          <div>
                            <div className="text-white font-semibold text-sm">Al Meera Consumer Goods</div>
                            <div className="text-sm" style={{ color: '#10B981' }}>95% Match</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#10B981', color: 'white' }}>Match</button>
                          <button className="px-3 py-1 rounded-full text-xs" style={{ background: '#374151', color: 'white' }}>End</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <div className="text-[#94A3B8] text-sm font-medium mb-3">Buyer Queue:</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Al Othaim Group', match: 95, color: '#10B981' },
                      { name: 'Carrefour UAE', match: 88, color: '#F59E0B' },
                      { name: 'Lulu Hypermarket', match: 82, color: '#F59E0B' },
                    ].map((buyer, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(30,45,69,0.5)' }}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: buyer.color }} />
                          <span className="text-[#94A3B8] text-sm">{buyer.name}</span>
                        </div>
                        <span className="text-sm font-medium" style={{ color: buyer.color }}>{buyer.match}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CARGO AUCTION SHOWCASE ========== */}
      <section className="py-20" style={{ background: '#0D1526' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE - Auction Card Mockup */}
            <div className="order-2 lg:order-1 relative">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(212,175,55,0.2), transparent)', borderRadius: '16px', filter: 'blur(40px)' }} />
              <div className="relative rounded-2xl overflow-hidden" style={{ background: '#0A0F1E', border: '1px solid #1E2D45', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: '#10B981', color: 'white' }}>
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    Available
                  </span>
                </div>

                <div className="aspect-video flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E2D45, #0D1526)' }}>
                  <div className="text-center">
                    <Package className="w-20 h-20 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                    <span className="text-sm" style={{ color: '#D4AF37' }}>Product Image</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1">Chocolate Wafers 750g</h3>
                  <p className="text-[#94A3B8] text-sm mb-4">OZMO Confectionery</p>

                  <div className="flex gap-4 text-sm text-[#94A3B8] mb-4">
                    <span>1 × 40ft Container</span>
                    <span>•</span>
                    <span>1,200 cases</span>
                    <span>•</span>
                    <span className="font-medium" style={{ color: '#10B981' }}>Halal</span>
                  </div>

                  <div className="rounded-xl p-4 mb-4" style={{ background: '#0D1526' }}>
                    <div className="text-xs text-[#475569] mb-2">Select Destination:</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Anchor className="w-4 h-4" style={{ color: '#475569' }} />
                        <select className="rounded-lg px-3 py-2 text-sm" style={{ background: '#0A0F1E', border: '1px solid #1E2D45', color: '#F8FAFC' }}>
                          <option>Jeddah, Saudi Arabia</option>
                          <option>Dubai, UAE</option>
                          <option>Singapore</option>
                        </select>
                      </div>
                      <div className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#D4AF37' }}>$28,500</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#94A3B8]">Deposit: <span className="font-semibold text-white">$5,700 (20%)</span></span>
                    <div className="flex items-center gap-1 text-sm" style={{ color: '#10B981' }}>
                      <Lock className="w-4 h-4" />
                      Escrow protected
                    </div>
                  </div>

                  <button className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8962E)', color: '#0A0F1E', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' }}>
                    <Coins className="w-5 h-5" />
                    Reserve Now →
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
                <Lightning className="w-4 h-4" />
                EXCLUSIVE FEATURE
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
                Ready-to-Ship Cargo
              </h2>
              <p className="text-2xl font-semibold mb-6" style={{ color: '#D4AF37' }}>
                At Fixed Landed Prices
              </p>

              <p className="text-[#94A3B8] text-lg mb-8">
                Our Cargo Auction lets buyers reserve full containers at transparent delivered prices. No hidden fees, no surprises. Pay 20% deposit to secure your cargo.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { step: '1', title: 'Browse Cargo' },
                  { step: '2', title: 'Select Port' },
                  { step: '3', title: 'Pay Deposit' },
                  { step: '4', title: 'Receive' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ background: 'rgba(11,110,140,0.2)', border: '1px solid #0B6E8C' }}>
                      <span className="font-bold text-sm" style={{ color: '#0EA5C9' }}>{item.step}</span>
                    </div>
                    <span className="text-xs text-[#94A3B8]">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#10B981' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
                  <span>3 containers available now</span>
                </div>
                <div className="text-[#94A3B8] text-sm">
                  Destinations: Dubai, Jeddah, Singapore
                </div>
              </div>

              <button onClick={() => navigate('/auction')} className="btn-action-gold px-8 py-4 text-lg rounded-xl font-semibold flex items-center gap-2">
                <Ship className="w-5 h-5" />
                Browse Active Cargo →
              </button>
              <p className="text-sm text-[#475569] mt-3">Premium members only</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LOGISTICS HUB ========== */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#0A0F1E' }}>
        <div className="hero-grid" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
              Global Logistics, Simplified
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-3xl mx-auto">
              Connect with 200+ verified freight forwarders. Get instant quotes. Book containers with escrow protection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Ship, title: 'Get Freight Quotes', desc: 'Compare rates from verified forwarders across all major trade routes', color: '#0B6E8C', btnBg: '#0B6E8C' },
              { icon: Sparkles, title: 'AI Cargo Optimizer', desc: 'Fill your containers smarter with AI recommendations', color: '#D4AF37', btnBg: '#D4AF37' },
              { icon: Shield, title: 'Escrow Protection', desc: 'All payments protected. Funds released only after verified delivery.', color: '#10B981', btnBg: '#10B981' },
            ].map((item, i) => (
              <div key={i} className="card-premium p-8 group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}80)` }}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>{item.title}</h3>
                <p className="text-[#94A3B8] mb-6">{item.desc}</p>
                <button className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2" style={{ background: '#1E2D45', color: 'white' }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = item.btnBg} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = '#1E2D45'}>
                  Learn More →
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8" style={{ background: '#0D1526', border: '1px solid #1E2D45' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '500+', label: 'GCC Companies', icon: Building2 },
                { value: '6', label: 'GCC Countries', icon: Globe },
                { value: '$45M+', label: 'Trade Facilitated', icon: DollarSign },
                { value: '2,500+', label: 'Deals Closed', icon: CheckCircle },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                  <div className="text-2xl lg:text-3xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#D4AF37' }}>{stat.value}</div>
                  <div className="text-sm text-[#94A3B8]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== MARKET PRICES ========== */}
      <section className="py-20" style={{ background: '#0D1526' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(11,110,140,0.2)', border: '1px solid rgba(11,110,140,0.3)', color: '#0EA5C9' }}>
              <BarChart3 className="w-4 h-4" />
              Live Market Data
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
              Brands Bridge Market Index
            </h2>
            <p className="text-[#94A3B8]">Live FMCG commodity prices — updated every 30 seconds</p>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
            <div className="px-6 py-4" style={{ background: 'linear-gradient(135deg, #0B6E8C, #0EA5C9)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                  <span className="text-white font-semibold">Commodity Price Tracker</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Live
                </div>
              </div>
            </div>

            <div>
              {prices.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid #1E2D45' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.trend === 'up' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)' }}>
                      {item.trend === 'up' ? <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} /> : <TrendingDown className="w-5 h-5" style={{ color: '#EF4444' }} />}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{item.name}</div>
                      <div className="text-[#475569] text-sm">per {item.unit}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">${item.price.toLocaleString()}</div>
                    <div className="text-sm font-medium flex items-center justify-end gap-1" style={{ color: item.trend === 'up' ? '#10B981' : '#EF4444' }}>
                      {item.trend === 'up' ? '↑' : '↓'}{Math.abs(item.change)}%
                      <span className="w-2 h-2 rounded-full" style={{ background: item.trend === 'up' ? '#10B981' : '#EF4444' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(30,45,69,0.3)', borderTop: '1px solid #1E2D45' }}>
              <span className="text-[#475569] text-sm">Prices update automatically</span>
              <button onClick={() => navigate('/market')} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: '#0B6E8C', color: 'white' }}>
                View Full Market Index →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROBLEM/SOLUTION ========== */}
      <section className="py-20" style={{ background: '#0A0F1E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
            Stop Wasting Money on Trade Shows
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#EF4444' }}>Traditional Trade Shows</h3>
              <div className="space-y-4">
                {['$15,000+ per exhibition booth', 'Travel & hotel costs', 'Only 3-5 days of exposure', 'Limited geographic reach', 'No data or analytics'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[#94A3B8]">
                    <span style={{ color: '#EF4444' }}>✕</span> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.2)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#10B981' }}>Brands Bridge AI</h3>
              <div className="space-y-4">
                {['Starting from $199/month', 'Work from your office', '365 days of visibility', '85+ countries instantly', 'Full analytics dashboard'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[#94A3B8]">
                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-20" style={{ background: '#111827' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
            From Connection to Deal in 3 Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: Package, title: 'List Your Products', desc: 'Create your digital booth in minutes' },
              { step: '2', icon: Bot, title: 'Get Matched by AI', desc: 'Our AI connects you with the right buyers' },
              { step: '3', icon: MessageCircle, title: 'Close Deals Live', desc: 'Negotiate in real-time via Live Deal Room' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(212,175,55,0.2)' }}>
                  <item.icon className="w-8 h-8" style={{ color: '#D4AF37' }} />
                </div>
                <div className="text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>Step {item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{item.title}</h3>
                <p className="text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20" style={{ background: '#0A0F1E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
            Everything You Need to Trade Globally
          </h2>
          <p className="text-[#94A3B8] text-center mb-12 max-w-2xl mx-auto">A complete suite of tools designed for modern FMCG trade</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: 'AI Sales CRM', desc: 'Intelligent lead scoring and follow-ups' },
              { icon: Package, title: 'ERP & Inventory', desc: 'Manage products and stock levels' },
              { icon: MessageCircle, title: 'Live Deal Rooms', desc: 'Real-time video negotiations' },
              { icon: Ship, title: 'Logistics Integration', desc: 'Shipping and freight management' },
              { icon: LineChart, title: 'Market Intelligence', desc: 'Real-time commodity prices' },
              { icon: Mail, title: 'Email Campaigns', desc: 'Reach buyers with targeted emails' },
              { icon: Video, title: '🥽 Virtual Booths', desc: 'Visit supplier factories virtually in 360°' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl transition-colors" style={{ background: '#111827', border: '1px solid #1E2D45' }}>
                <feature.icon className="w-10 h-10 mb-4" style={{ color: '#D4AF37' }} />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[#94A3B8] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHO IS IT FOR ========== */}
      <section className="py-20" style={{ background: '#111827' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Syne, sans-serif', color: '#F8FAFC' }}>
            Who Is Brands Bridge AI For?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Factory, title: 'Manufacturers & Exporters', desc: 'List products, manage leads, close international deals', cta: 'Start Exporting →', color: 'from-amber-500 to-orange-600' },
              { icon: ShoppingCart, title: 'Importers & Buyers', desc: 'Find verified suppliers, compare quotes, track shipments', cta: 'Start Sourcing Free →', color: 'from-blue-500 to-cyan-600' },
              { icon: Truck, title: 'Freight Providers', desc: 'Get freight requests, submit bids, grow your logistics business', cta: 'Join as Carrier →', color: 'from-emerald-500 to-teal-600' },
            ].map((card, i) => (
              <div key={i} className="text-center p-8 rounded-2xl" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`} style={{ background: `linear-gradient(135deg, ${card.color.includes('amber') ? '#F59E0B' : card.color.includes('blue') ? '#3B82F6' : '#10B981'}, ${card.color.includes('amber') ? '#D97706' : card.color.includes('blue') ? '#06B6D4' : '#14B8A6'})` }}>
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>{card.title}</h3>
                <p className="text-[#94A3B8] mb-6">{card.desc}</p>
                <button onClick={() => navigate('/register')} className="btn-primary w-full text-white rounded-xl font-medium">
                  {card.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0B6E8C, #0A0F1E, #D4AF37)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Everything You Need to Trade Globally
          </h2>
          <p className="text-xl text-white/80 mb-8">One platform. Four powerful tools.</p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            {[
              { icon: Radio, label: 'Live Deal Rooms', color: '#EF4444' },
              { icon: Coins, label: 'Cargo Auction', color: '#D4AF37' },
              { icon: Ship, label: 'Logistics Hub', color: '#3B82F6' },
              { icon: BarChart3, label: 'Market Intelligence', color: '#8B5CF6' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-full px-5 py-3" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.color }}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-2xl text-white/90 mb-8">Join 2,450+ companies already trading smarter</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/register')} className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2" style={{ background: 'white', color: '#0B6E8C', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => toast.success('Demo booking feature coming soon!')} className="px-8 py-4 rounded-xl font-semibold text-lg" style={{ background: 'transparent', border: '2px solid white', color: 'white' }}>
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIAL ========== */}
      <section className="py-20" style={{ background: '#111827' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-2xl" style={{ background: '#0A0F1E', border: '1px solid #1E2D45' }}>
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6" style={{ color: '#D4AF37', fill: '#D4AF37' }} />)}
            </div>
            <blockquote className="text-xl lg:text-2xl text-white font-medium mb-8 leading-relaxed">
              "We connected with 3 verified GCC suppliers in our first week and closed a $186,000 dairy deal without leaving Doha."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                <span className="font-bold text-lg" style={{ color: '#D4AF37' }}>MA</span>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">Mohammed Al Kuwari</div>
                <div className="text-[#94A3B8] text-sm">Procurement Manager</div>
                <div className="text-sm" style={{ color: '#D4AF37' }}>Al Meera Consumer Goods</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ background: '#020817', borderTop: '1px solid #1E2D45' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe className="w-6 h-6" style={{ color: '#0A0F1E' }} />
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                Brands <span style={{ color: '#D4AF37' }}>Bridge</span>
                <span className="text-sm ml-1" style={{ color: '#0EA5C9' }}>AI</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/pricing" className="footer-link">Pricing</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/how-it-works" className="footer-link">How It Works</Link>
            </div>
            <div className="text-sm" style={{ color: '#475569' }}>© 2025 Brands Bridge AI. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
