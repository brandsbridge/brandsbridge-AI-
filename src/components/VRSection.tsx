import { useState } from 'react';
import VRWaitlistModal from './VRWaitlistModal';

interface VRSectionProps {
  onLearnMore?: () => void;
}

const VRSection = ({ onLearnMore }: VRSectionProps) => {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const handleJoinWaitlist = () => {
    setShowWaitlistModal(true);
  };

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      window.location.href = '/vr-experience';
    }
  };

  return (
    <>
      <section
        className="relative overflow-hidden py-20 lg:py-24"
        style={{
          background: '#050B18',
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* LEFT: VR Goggles Illustration */}
            <div className="lg:w-2/5 flex justify-center lg:justify-start">
              <div className="relative">
                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-40"
                  style={{
                    background: 'radial-gradient(circle, #0EA5C9 0%, transparent 70%)',
                    transform: 'scale(1.5)'
                  }}
                />

                {/* VR Headset SVG */}
                <svg
                  viewBox="0 0 240 150"
                  className="w-56 md:w-72 relative z-10 animate-float"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    animation: 'float 4s ease-in-out infinite'
                  }}
                >
                  {/* Glow effect */}
                  <defs>
                    <radialGradient id="vrGlow">
                      <stop offset="0%" stopColor="#0EA5C9" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#0EA5C9" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id="lensGlowVR">
                      <stop offset="0%" stopColor="#0EA5C9" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#0EA5C9" stopOpacity="0"/>
                    </radialGradient>
                  </defs>

                  {/* Ambient glow */}
                  <ellipse cx="120" cy="80" rx="100" ry="60" fill="url(#vrGlow)"/>

                  {/* Headset body */}
                  <rect x="30" y="40" width="180" height="80" rx="25" fill="#071120" stroke="#0EA5C9" strokeWidth="2"/>

                  {/* Left lens */}
                  <ellipse cx="85" cy="80" rx="38" ry="30" fill="#050D1A" stroke="#D4AF37" strokeWidth="2"/>
                  <ellipse cx="85" cy="80" rx="25" ry="20" fill="url(#lensGlowVR)"/>

                  {/* Right lens */}
                  <ellipse cx="155" cy="80" rx="38" ry="30" fill="#050D1A" stroke="#D4AF37" strokeWidth="2"/>
                  <ellipse cx="155" cy="80" rx="25" ry="20" fill="url(#lensGlowVR)"/>

                  {/* Bridge between lenses */}
                  <rect x="113" y="72" width="14" height="16" rx="4" fill="#071120" stroke="#0EA5C9" strokeWidth="1"/>

                  {/* Left strap */}
                  <path d="M30 75 Q15 75 12 80 Q15 85 30 85" fill="#071120" stroke="#0EA5C9" strokeWidth="1.5"/>

                  {/* Right strap */}
                  <path d="M210 75 Q225 75 228 80 Q225 85 210 85" fill="#071120" stroke="#0EA5C9" strokeWidth="1.5"/>

                  {/* BB Logo on headset */}
                  <text x="120" y="25" textAnchor="middle" fill="#D4AF37" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="bold">Brands Bridge AI</text>

                  {/* Sparkle dots */}
                  <circle cx="45" cy="45" r="2" fill="#D4AF37" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.5s' }}/>
                  <circle cx="195" cy="45" r="2" fill="#D4AF37" opacity="0.8" className="animate-pulse" style={{ animationDelay: '1s' }}/>
                  <circle cx="25" cy="100" r="1.5" fill="#0EA5C9" opacity="0.9" className="animate-pulse" style={{ animationDelay: '1.5s' }}/>
                  <circle cx="215" cy="110" r="1.5" fill="#0EA5C9" opacity="0.9" className="animate-pulse" style={{ animationDelay: '2s' }}/>
                  <circle cx="120" cy="140" r="2" fill="#0EA5C9" opacity="0.7" className="animate-pulse" style={{ animationDelay: '2.5s' }}/>
                </svg>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full animate-float"
                      style={{
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        background: i % 2 === 0 ? '#0EA5C9' : '#D4AF37',
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + i * 0.5}s`,
                        opacity: 0.6
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="lg:w-3/5 text-center lg:text-left">
              {/* Pill Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
                style={{
                  background: 'rgba(123, 97, 255, 0.12)',
                  borderColor: 'rgba(123, 97, 255, 0.3)',
                }}
              >
                <span className="text-lg">🔮</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: '#A78BFA' }}
                >
                  FUTURE FEATURE · Our 2027 Vision
                </span>
              </div>

              {/* Main Headline */}
              <h2
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.1 }}
              >
                <span style={{ color: '#F8FAFC' }}>Experience the Expo in</span>
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Virtual Reality
                </span>
              </h2>

              {/* Subheadline */}
              <p
                className="text-xl font-medium mb-4"
                style={{ color: '#D4AF37' }}
              >
                Walk virtual booths. Meet exporters face-to-face.
              </p>

              {/* Description */}
              <p
                className="text-base mb-8 max-w-xl"
                style={{ color: '#94A3B8', lineHeight: 1.6 }}
              >
                We are building the world's first immersive VR trade exhibition for
                FMCG companies. Browse 500+ virtual booths, attend live sessions, and
                close deals — all in VR.
              </p>

              {/* 4 Feature Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg">
                {[
                  { icon: '🏛️', text: 'Virtual Booths' },
                  { icon: '🤝', text: 'Face-to-Face Meetings' },
                  { icon: '💰', text: 'Real-Time Deals' },
                  { icon: '🌍', text: '85+ Countries' }
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(100, 116, 139, 0.2)'
                    }}
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm font-medium" style={{ color: '#F8FAFC' }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Compatible Devices */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                <span className="text-sm" style={{ color: '#64748B' }}>Compatible with:</span>
                {['Meta Quest', 'Apple Vision', 'WebVR'].map((device, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{
                      background: '#0C1829',
                      border: '1px solid #162438',
                      color: '#94A3B8'
                    }}
                  >
                    {device}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Primary: Join Waitlist */}
                <button
                  onClick={handleJoinWaitlist}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
                    color: '#0F172A',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  <span>🎮</span>
                  Join VR Waitlist
                  <span>→</span>
                </button>

                {/* Secondary: Learn More */}
                <button
                  onClick={handleLearnMore}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 bg-transparent transition-all hover:bg-cyan-500/10"
                  style={{
                    border: '1px solid #22D3EE',
                    color: '#22D3EE'
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CSS for float animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </section>

      {/* Waitlist Modal */}
      <VRWaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </>
  );
};

export default VRSection;
