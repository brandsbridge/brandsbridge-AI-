import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import VRWaitlistModal from '../components/VRWaitlistModal';
import toast from 'react-hot-toast';

const VRExperiencePage = () => {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Brands Bridge VR — Experience the Future of Trade';
    window.scrollTo(0, 0);
  }, []);

  const handleJoinWaitlist = () => {
    setShowWaitlistModal(true);
  };

  const faqs = [
    {
      question: 'When will Brands Bridge VR launch?',
      answer: 'We are targeting a phased rollout: WebVR browser experience in 2026, and full VR headset support (Meta Quest, Apple Vision Pro) in 2027.'
    },
    {
      question: 'Do I need a VR headset to use Brands Bridge VR?',
      answer: 'No! We are building a WebVR version that works directly in your browser. No headset required for the initial launch. Full headset support comes in 2027.'
    },
    {
      question: 'How much will Brands Bridge VR cost?',
      answer: 'The WebVR experience will be included in your existing subscription. Premium VR headset experiences will have optional premium tiers at competitive pricing.'
    },
    {
      question: 'Can I try a preview of the VR experience?',
      answer: 'Yes! Join our waitlist to get early access to our WebVR preview in 2026, and be among the first to test our virtual booth technology.'
    },
    {
      question: 'What types of companies can I meet in VR?',
      answer: 'Our VR expo will feature FMCG manufacturers, exporters, distributors, and logistics providers from 85+ countries, all with verified profiles and trade credentials.'
    },
    {
      question: 'How is this different from a regular video call?',
      answer: 'Unlike video calls, VR lets you walk through a 3D exhibition hall, visit individual virtual booths, and experience products in an immersive environment — all from your office.'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: '#050B18' }}>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-24 lg:py-32"
        style={{
          background: '#050B18',
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      >
        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              borderColor: 'rgba(124, 58, 237, 0.3)'
            }}
          >
            <span className="text-2xl">🥽</span>
            <span className="text-violet-300 text-sm font-medium">BRANDS BRIDGE VR · OUR 2027 VISION</span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{ fontFamily: 'Syne, sans-serif', lineHeight: 1.1 }}
          >
            <span style={{ color: '#F8FAFC' }}>The Future of Trade</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              is Immersive
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-xl md:text-2xl font-medium mb-8 max-w-3xl mx-auto"
            style={{ color: '#D4AF37' }}
          >
            Walk virtual booths. Meet exporters face-to-face. Close deals in VR.
          </p>

          {/* Description */}
          <p
            className="text-lg mb-12 max-w-2xl mx-auto"
            style={{ color: '#94A3B8', lineHeight: 1.7 }}
          >
            We are building the world's first fully immersive VR trade exhibition platform for FMCG companies.
            Experience what it's like to walk through a global trade show without leaving your office.
          </p>

          {/* VR Headset Illustration */}
          <div className="relative max-w-md mx-auto mb-12">
            <svg
              viewBox="0 0 300 180"
              className="w-full animate-float"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            >
              <defs>
                <radialGradient id="heroGlow">
                  <stop offset="0%" stopColor="#0EA5C9" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#0EA5C9" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="heroLensGlow">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
                </radialGradient>
              </defs>

              <ellipse cx="150" cy="95" rx="120" ry="70" fill="url(#heroGlow)"/>
              <rect x="40" y="50" width="220" height="95" rx="30" fill="#071120" stroke="#0EA5C9" strokeWidth="2.5"/>

              <ellipse cx="105" cy="97" rx="45" ry="35" fill="#050D1A" stroke="#D4AF37" strokeWidth="2.5"/>
              <ellipse cx="105" cy="97" rx="30" ry="24" fill="url(#heroLensGlow)"/>

              <ellipse cx="195" cy="97" rx="45" ry="35" fill="#050D1A" stroke="#D4AF37" strokeWidth="2.5"/>
              <ellipse cx="195" cy="97" rx="30" ry="24" fill="url(#heroLensGlow)"/>

              <rect x="140" y="88" width="20" height="18" rx="5" fill="#071120" stroke="#0EA5C9" strokeWidth="1.5"/>

              <text x="150" y="35" textAnchor="middle" fill="#D4AF37" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="bold">Brands Bridge AI</text>
            </svg>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleJoinWaitlist}
              className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
                color: '#0F172A',
                boxShadow: '0 4px 30px rgba(212, 175, 55, 0.4)'
              }}
            >
              <span>🎮</span>
              Join VR Waitlist
              <span>→</span>
            </button>
            <Link
              to="/companies"
              className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 bg-transparent transition-all hover:bg-cyan-500/10"
              style={{
                border: '1px solid #22D3EE',
                color: '#22D3EE'
              }}
            >
              Explore Platform Today
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
        `}</style>
      </section>

      {/* Roadmap Section */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #050B18 0%, #0A1628 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Our 3-Phase Roadmap
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Building the future of trade, one phase at a time
          </p>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1">
              <div className="absolute left-[16.67%] w-[16.67%] bg-gradient-to-r from-emerald-500 to-emerald-500 h-full" />
              <div className="absolute left-[33.33%] w-[16.67%] bg-gradient-to-r from-blue-500 to-blue-500 h-full" />
              <div className="absolute left-[50%] w-[16.67%] bg-gradient-to-r from-violet-500 to-violet-500 h-full" />
              <div className="absolute left-[66.67%] w-[16.67%] bg-slate-700 h-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Phase 1 */}
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 border-2"
                  style={{ background: '#050B18', borderColor: '#10B981' }}
                >
                  ✅
                </div>
                <div className="text-emerald-400 text-sm font-semibold mb-1">2025</div>
                <h3 className="text-xl font-bold text-white mb-2">Digital Platform</h3>
                <p className="text-slate-400 text-sm">
                  AI matching, Live Deal Rooms, Virtual Booths — fully operational
                </p>
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full mt-3 text-xs font-medium"
                  style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}
                >
                  <CheckCircle className="w-3 h-3" />
                  Live Now
                </div>
              </div>

              {/* Phase 2 */}
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 border-2"
                  style={{ background: '#050B18', borderColor: '#3B82F6' }}
                >
                  🔄
                </div>
                <div className="text-blue-400 text-sm font-semibold mb-1">2026</div>
                <h3 className="text-xl font-bold text-white mb-2">WebVR Experience</h3>
                <p className="text-slate-400 text-sm">
                  Browser-based 3D expo. No headset needed. First virtual trade events.
                </p>
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full mt-3 text-xs font-medium"
                  style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}
                >
                  Coming Soon
                </div>
              </div>

              {/* Phase 3 */}
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 border-2"
                  style={{ background: '#050B18', borderColor: '#8B5CF6' }}
                >
                  🥽
                </div>
                <div className="text-violet-400 text-sm font-semibold mb-1">2026-2027</div>
                <h3 className="text-xl font-bold text-white mb-2">VR Headset Support</h3>
                <p className="text-slate-400 text-sm">
                  Meta Quest & Apple Vision Pro integration. Full immersive experience.
                </p>
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full mt-3 text-xs font-medium"
                  style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}
                >
                  In Development
                </div>
              </div>

              {/* Phase 4 */}
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 border-2"
                  style={{ background: '#050B18', borderColor: '#64748B' }}
                >
                  🚀
                </div>
                <div className="text-amber-400 text-sm font-semibold mb-1">2027</div>
                <h3 className="text-xl font-bold text-white mb-2">Full VR World</h3>
                <p className="text-slate-400 text-sm">
                  World's first VR FMCG trade platform. 500+ virtual booths, global reach.
                </p>
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full mt-3 text-xs font-medium"
                  style={{ background: 'rgba(100, 116, 139, 0.2)', color: '#64748B' }}
                >
                  Vision
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Experience Section */}
      <section className="py-20" style={{ background: '#071120' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            What You'll Experience
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Six ways VR will transform your trade experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🏛️',
                title: 'Walk Through Virtual Booths',
                description: 'Explore 500+ virtual company booths in an immersive 3D environment. Browse products, watch demos, and interact with company displays.',
                color: '#7C3AED'
              },
              {
                icon: '🤝',
                title: 'Meet Exporters Face-to-Face',
                description: 'Have real-time video meetings with exporters as if you\'re in the same room. Full body tracking and spatial audio for authentic interactions.',
                color: '#0EA5C9'
              },
              {
                icon: '💰',
                title: 'Negotiate in Real-Time',
                description: 'Use our built-in negotiation tools to discuss pricing, quantities, and terms with multiple suppliers simultaneously in private VR rooms.',
                color: '#10B981'
              },
              {
                icon: '📝',
                title: 'Sign Contracts in VR',
                description: 'Review and sign contracts using digital signatures with full legal compliance. Escrow payment integration for secure transactions.',
                color: '#F59E0B'
              },
              {
                icon: '🎪',
                title: 'Attend Live Trade Events',
                description: 'Join live product launches, industry keynotes, and networking sessions with thousands of attendees from around the world.',
                color: '#EC4899'
              },
              {
                icon: '🌐',
                title: 'Access Global Markets 24/7',
                description: 'Your virtual trade show is always open. Browse booths, schedule meetings, and close deals any time, from anywhere in the world.',
                color: '#06B6D4'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderColor: `${feature.color}30`
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
                  style={{ background: `${feature.color}20` }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners Section */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #071120 0%, #050B18 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Powered by Industry Leaders
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Built on the most advanced VR and web technologies
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Meta Quest', icon: '🥽', desc: 'Primary VR headset' },
              { name: 'Apple Vision Pro', icon: '👁️', desc: 'Spatial computing' },
              { name: 'WebVR / WebXR', icon: '🌐', desc: 'Browser-based 3D' },
              { name: 'Unity Engine', icon: '🎮', desc: '3D development' }
            ].map((partner, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl"
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(100, 116, 139, 0.2)'
                }}
              >
                <div className="text-5xl mb-4">{partner.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{partner.name}</h3>
                <p className="text-slate-500 text-sm">{partner.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sneak Peek Virtual Booths */}
      <section className="py-20" style={{ background: '#050B18' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Sneak Peek: Virtual Booths
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            A preview of what to expect in our 2027 VR vision
          </p>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            style={{ perspective: '1000px' }}
          >
            {[
              { name: 'Almarai', country: 'Saudi Arabia', flag: '🇸🇦' },
              { name: 'OZMO', country: 'Turkey', flag: '🇹🇷' },
              { name: 'Golden Dates', country: 'UAE', flag: '🇦🇪' },
              { name: 'Baladna', country: 'Qatar', flag: '🇶🇦' }
            ].map((company, idx) => (
              <div
                key={idx}
                className="p-6 text-center transform hover:scale-105 transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.3), rgba(8, 47, 73, 0.8))',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: '1rem',
                  transform: `rotateX(${5 + idx * 2}deg)`,
                  boxShadow: '0 20px 40px rgba(13, 148, 136, 0.15)'
                }}
              >
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1E293B, #334155)' }}
                >
                  <Building2 className="w-10 h-10 text-slate-500" />
                </div>
                <div className="text-3xl mb-2">{company.flag}</div>
                <h3 className="text-white font-bold mb-1">{company.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{company.country}</p>
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3"
                  style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#2DD4BF' }}
                >
                  Virtual Booth
                </div>
                <button
                  onClick={() => toast.success('🥽 Full VR experience coming 2027. Today, explore our platform for live trade opportunities!')}
                  className="w-full py-2 rounded-lg font-semibold text-sm transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
                    color: '#F8FAFC'
                  }}
                >
                  Explore Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20" style={{ background: '#071120' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Everything you need to know about Brands Bridge VR
          </p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(100, 116, 139, 0.2)'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-semibold pr-4">{faq.question}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #050B18 0%, #1E1B4B 50%, #050B18 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(123, 97, 255, 0.15)',
              border: '1px solid rgba(123, 97, 255, 0.3)'
            }}
          >
            <span className="text-2xl">🔮</span>
            <span className="text-violet-300 text-sm font-medium">Limited Early Access</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Be Part of the Trade Revolution
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join 500+ forward-thinking companies shaping the future of FMCG trade.
            Your spot on the waitlist is free and comes with no obligation.
          </p>

          <button
            onClick={handleJoinWaitlist}
            className="px-10 py-5 rounded-xl font-bold text-xl flex items-center gap-3 mx-auto transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
              color: '#0F172A',
              boxShadow: '0 4px 40px rgba(212, 175, 55, 0.5)'
            }}
          >
            <span>🥽</span>
            Join VR Waitlist
            <span>→</span>
          </button>

          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Free to join
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ borderColor: 'rgba(100, 116, 139, 0.2)', background: '#050B18' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #B8962E)', color: '#0A0F1E' }}
              >
                BB
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#F8FAFC' }}>
                Brands <span style={{ color: '#D4AF37' }}>Bridge</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link to="/companies" className="hover:text-white transition-colors">Expo Hall</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="text-sm text-slate-500">
              © 2025 Brands Bridge AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      <VRWaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
};

export default VRExperiencePage;
