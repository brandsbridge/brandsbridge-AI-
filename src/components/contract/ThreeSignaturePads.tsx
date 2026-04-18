import React, { useState, useEffect } from 'react';
import { Contract, ContractParty } from '../../contexts/ContractContext';

interface ThreeSignaturePadsProps {
  contract: Contract;
  currentPartyId: string;
  onSign: (partyId: string, signatureName: string) => void;
}

export const ThreeSignaturePads: React.FC<ThreeSignaturePadsProps> = ({
  contract,
  currentPartyId,
  onSign
}) => {
  const [showModal, setShowModal] = useState(false);
  const [signingPartyId, setSigningPartyId] = useState<string | null>(null);
  const [signatureName, setSignatureName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [animatedName, setAnimatedName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [justSigned, setJustSigned] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check if all parties signed - trigger confetti
  useEffect(() => {
    const allSigned = contract.parties.every(p => p.signed);
    if (allSigned && contract.parties.length === 3) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [contract.parties]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'buyer':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'supplier':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'logistics':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'buyer':
        return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500' };
      case 'supplier':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500' };
      case 'logistics':
        return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500' };
    }
  };

  const canSign = (party: ContractParty) => {
    return party.id === currentPartyId && !party.signed;
  };

  const handleOpenModal = (partyId: string) => {
    const party = contract.parties.find(p => p.id === partyId);
    if (party && canSign(party)) {
      setSigningPartyId(partyId);
      setSignatureName('');
      setAgreedToTerms(false);
      setShowModal(true);
    }
  };

  const handleConfirmSign = () => {
    if (signatureName.trim() && agreedToTerms && signingPartyId) {
      setShowModal(false);
      setShowSuccess(true);

      // Animate name writing with cursive effect
      let index = 0;
      const chars = signatureName.split('');
      const nameInterval = setInterval(() => {
        if (index < chars.length) {
          setAnimatedName(prev => prev + chars[index]);
          index++;
        }
        if (index >= chars.length) {
          clearInterval(nameInterval);
          setTimeout(() => {
            setJustSigned(signingPartyId);
            onSign(signingPartyId, signatureName);
            setTimeout(() => {
              setShowSuccess(false);
              setAnimatedName('');
              setJustSigned(null);
            }, 800);
          }, 600);
        }
      }, 80); // 80ms per character for 0.8s total typing
    }
  };

  const signedCount = contract.parties.filter(p => p.signed).length;
  const totalParties = contract.parties.length;

  return (
    <>
      {/* CSS-based Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#D4AF37', '#B8860B', '#10B981', '#059669', '#F59E0B'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Signature Progress</span>
          <span className="text-sm font-semibold text-[#D4AF37]">{signedCount}/{totalParties} Signed</span>
        </div>
        <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(signedCount / totalParties) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {contract.parties.map((party) => {
          const roleColors = getRoleColor(party.role);
          const isCurrentUser = party.id === currentPartyId;
          const canSignThis = canSign(party);
          const isJustSigned = justSigned === party.id;

          return (
            <div
              key={party.id}
              className={`relative rounded-xl transition-all duration-400 ease-out ${
                party.signed
                  ? 'bg-emerald-500/5 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : canSignThis
                  ? 'bg-[#050B18] border-2 border-dashed border-[#D4AF37] hover:border-[#D4AF37]/80 cursor-pointer hover:shadow-lg hover:shadow-[#D4AF37]/20'
                  : 'bg-[#050B18] border-2 border-[#1E293B] opacity-75'
              } ${isJustSigned ? 'scale-105' : ''}`}
              onClick={() => handleOpenModal(party.id)}
            >
              {/* Party Icon & Status */}
              <div className="p-4 text-center border-b border-[#1E293B]/50">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${roleColors.bg} mb-3 transition-all duration-300 ${party.signed ? 'scale-110' : ''}`}>
                  <div className={roleColors.text}>
                    {party.signed ? (
                      <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center animate-check-pop">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      getRoleIcon(party.role)
                    )}
                  </div>
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${roleColors.bg} ${roleColors.text}`}>
                  {party.role}
                </span>

                {isCurrentUser && !party.signed && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#D4AF37] text-[#050B18] text-xs font-bold rounded-full animate-pulse-glow">
                    YOU
                  </span>
                )}
              </div>

              {/* Party Info */}
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-white mb-1">{party.company}</p>
                <p className="text-xs text-gray-400">{party.name}</p>
              </div>

              {/* Signature Area */}
              <div className="px-4 pb-4">
                <div className={`h-20 rounded-lg flex items-center justify-center border-2 border-dashed transition-all duration-400 ${
                  party.signed
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-[#1E293B] bg-[#0C1628]'
                }`}>
                  {party.signed ? (
                    <div className="text-center">
                      <p className="text-lg font-serif text-[#D4AF37] italic animate-signature-write">
                        {party.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-6 h-6 mx-auto text-gray-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <p className="text-xs text-gray-500">Sign Here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Footer */}
              <div className="px-4 pb-4 text-center">
                {party.signed ? (
                  <div className="bg-emerald-500/10 rounded-lg px-3 py-2 animate-signed-fade">
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Signed
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {party.signedAt && formatDate(party.signedAt)}
                    </p>
                    {party.signedIP && (
                      <p className="text-xs text-gray-600">
                        IP: {party.signedIP}
                      </p>
                    )}
                  </div>
                ) : canSignThis ? (
                  <button
                    className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Sign Contract
                  </button>
                ) : (
                  <div className="bg-amber-500/10 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-center gap-1 text-amber-400 text-sm">
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Awaiting
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0C1628] rounded-2xl p-8 text-center max-w-md mx-4 border border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center animate-success-pop">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-3xl font-serif text-[#D4AF37] italic mb-2 h-10">
              {animatedName}
              <span className="animate-blink">|</span>
            </p>
            <p className="text-gray-400">Signature captured successfully!</p>
            <p className="text-sm text-[#D4AF37] mt-4 animate-fade-in">
              {signedCount + 1}/{totalParties} parties signed
            </p>
          </div>
        </div>
      )}

      {/* Sign Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0C1628] rounded-2xl border border-[#1E293B] w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-slide">
            {/* Header */}
            <div className="p-6 border-b border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#050B18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sign this Contract?</h2>
                  <p className="text-sm text-gray-400">Review and confirm your signature</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contract Summary */}
              <div className="bg-[#050B18] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-[#D4AF37] mb-3">Contract Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Contract ID</p>
                    <p className="text-white font-mono">{contract.id.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Value</p>
                    <p className="text-white font-semibold">${contract.totalValue.toLocaleString()} {contract.currency}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Product</p>
                    <p className="text-white">{contract.product}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Incoterm</p>
                    <p className="text-white">{contract.incoterm}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment</p>
                    <p className="text-white">{contract.paymentTerms}</p>
                  </div>
                </div>
              </div>

              {/* Legal Disclaimer */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-red-400 font-semibold mb-1">Legal Disclaimer</p>
                    <p className="text-sm text-gray-300">
                      By signing, you agree to the terms and conditions outlined in this Smart Contract.
                      This signature is legally binding under UAE Electronic Transactions Law No. 1 of 2006.
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type your full name to sign
                </label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-[#050B18] border border-[#1E293B] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                />
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-[#1E293B] text-[#D4AF37] focus:ring-[#D4AF37] transition-colors"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  I have read and agree to all terms and conditions outlined in this contract.
                  I understand this signature is legally binding.
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#1E293B] flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-[#1E293B] text-gray-300 rounded-lg font-medium hover:bg-[#2D3748] transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSign}
                disabled={!signatureName.trim() || !agreedToTerms}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  signatureName.trim() && agreedToTerms
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Confirm & Sign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Styles */}
      <style>{`
        @keyframes check-pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes signature-write {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes signed-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(212, 175, 55, 0); }
        }

        @keyframes success-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-slide {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-check-pop { animation: check-pop 0.4s ease-out; }
        .animate-signature-write { animation: signature-write 0.5s ease-out; }
        .animate-signed-fade { animation: signed-fade 0.4s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .animate-success-pop { animation: success-pop 0.5s ease-out; }
        .animate-blink { animation: blink 0.8s infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out 0.5s both; }
        .animate-modal-slide { animation: modal-slide 0.3s ease-out; }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .grid.grid-cols-1.md\\:grid-cols-3 {
            grid-template-columns: 1fr;
          }
        }

        /* Confetti Animation */
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -20px;
          opacity: 0;
          animation: confetti-fall 3s ease-out forwards;
        }

        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </>
  );
};
