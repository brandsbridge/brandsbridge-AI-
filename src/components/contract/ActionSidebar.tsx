import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Contract, ContractParty } from '../../contexts/ContractContext';

interface ActionSidebarProps {
  contract: Contract;
  currentParty: ContractParty;
  onSign: () => void;
  onRequestAmendment: (reason: string) => void;
  onDownload: () => void;
}

// Contract workflow steps
interface WorkflowStep {
  id: number;
  title: string;
  status: 'pending' | 'current' | 'completed';
}

export const ActionSidebar: React.FC<ActionSidebarProps> = ({
  contract,
  currentParty,
  onSign,
  onRequestAmendment,
  onDownload
}) => {
  // Modal states
  const [showAmendmentModal, setShowAmendmentModal] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [showContainerModal, setShowContainerModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);

  // Form states
  const [amendmentReason, setAmendmentReason] = useState('');
  const [isProcessingEscrow, setIsProcessingEscrow] = useState(false);
  const [isReservingContainer, setIsReservingContainer] = useState(false);
  const [isConfirmingDispatch, setIsConfirmingDispatch] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState('40ft-hc');
  const [dispatchChecklist, setDispatchChecklist] = useState({
    goodsPacked: false,
    qualityInspected: false,
    certificatesAttached: false,
    photosUploaded: false
  });

  // Contract execution state (would come from backend in real app)
  const [escrowLocked] = useState(false);
  const [containerReserved] = useState(false);
  const [dispatchConfirmed] = useState(false);

  const allSigned = contract.parties.every(p => p.signed);
  const signedCount = contract.parties.filter(p => p.signed).length;

  // Generate workflow steps
  const getWorkflowSteps = (): WorkflowStep[] => {
    const steps: WorkflowStep[] = [
      { id: 1, title: 'Contract Drafted', status: 'completed' },
      { id: 2, title: 'Awaiting Signatures', status: allSigned ? 'completed' : 'current' },
      { id: 3, title: 'Contract Finalized', status: allSigned ? 'current' : 'pending' },
      { id: 4, title: 'Payment Locked', status: escrowLocked ? 'completed' : allSigned ? 'current' : 'pending' },
      { id: 5, title: 'Container Reserved', status: containerReserved ? 'completed' : escrowLocked ? 'current' : 'pending' },
      { id: 6, title: 'Dispatch Confirmed', status: dispatchConfirmed ? 'completed' : containerReserved ? 'current' : 'pending' },
      { id: 7, title: 'In Transit', status: 'pending' },
      { id: 8, title: 'Delivered', status: 'pending' }
    ];
    return steps;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Escrow lock handler
  const handleLockEscrow = async () => {
    setIsProcessingEscrow(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingEscrow(false);
    setShowEscrowModal(false);
    toast.success(`${formatCurrency(contract.totalValue * 1.005, contract.currency)} locked in escrow!`, {
      style: { background: '#0C1628', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  // Container reservation handler
  const handleReserveContainer = async () => {
    setIsReservingContainer(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsReservingContainer(false);
    setShowContainerModal(false);
    toast.success('Container reserved! TCNU-9876543', {
      style: { background: '#0C1628', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  // Dispatch confirmation handler
  const handleConfirmDispatch = async () => {
    if (!Object.values(dispatchChecklist).every(v => v)) {
      toast.error('Please complete all checklist items');
      return;
    }
    setIsConfirmingDispatch(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConfirmingDispatch(false);
    setShowDispatchModal(false);
    toast.success('Dispatch confirmed! Truck on the way to Mersin port', {
      style: { background: '#0C1628', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  // Email contract handler
  const handleEmailContract = () => {
    toast.success('Contract sent to 3 recipients', {
      style: { background: '#0C1628', color: '#10B981', border: '1px solid #10B981' }
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      buyer: 'bg-purple-500/20 text-purple-400',
      supplier: 'bg-emerald-500/20 text-emerald-400',
      logistics: 'bg-orange-500/20 text-orange-400'
    };
    return colors[role] || 'bg-gray-500/20 text-gray-400';
  };

  // Get circular progress data
  const getProgressPercentage = () => Math.round((signedCount / 3) * 100);
  const progressPercentage = getProgressPercentage();

  return (
    <div className="space-y-4">
      {/* SECTION 1: CONTRACT PROGRESS TRACKER */}
      <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Contract Progress
        </h3>

        {/* Circular Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#1E293B"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={progressPercentage === 100 ? '#10B981' : progressPercentage > 0 ? '#F59E0B' : '#EF4444'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(progressPercentage / 100) * 251.2} 251.2`}
                className={progressPercentage === 100 ? 'animate-pulse' : ''}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{signedCount}/3</span>
              <span className="text-xs text-gray-400">signed</span>
            </div>
          </div>
        </div>

        {/* Signature Dots */}
        <div className="flex justify-center gap-2 mb-4">
          {contract.parties.map((party, idx) => (
            <div
              key={party.id}
              className={`w-3 h-3 rounded-full ${
                party.signed
                  ? idx === 0 ? 'bg-purple-500' : idx === 1 ? 'bg-emerald-500' : 'bg-orange-500'
                  : 'bg-gray-600'
              } ${party.signed ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>

        {/* Workflow Steps */}
        <div className="space-y-2">
          {getWorkflowSteps().map((step, idx) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                step.status === 'completed'
                  ? 'bg-emerald-500'
                  : step.status === 'current'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-gray-700'
              }`}>
                {step.status === 'completed' ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.status === 'current' ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : (
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                )}
              </div>
              <span className={`text-sm ${
                step.status === 'completed'
                  ? 'text-emerald-400'
                  : step.status === 'current'
                  ? 'text-amber-400'
                  : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {idx < getWorkflowSteps().length - 1 && (
                <div className={`absolute left-[22px] w-0.5 h-4 mt-6 ${
                  step.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-700'
                }`} style={{ marginTop: '8px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: CONDITIONAL ACTIONS */}
      <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Actions
        </h3>

        {/* BUYER ACTIONS */}
        {currentParty.role === 'buyer' && (
          <div className="space-y-3">
            <button
              onClick={() => setShowEscrowModal(true)}
              disabled={!allSigned || escrowLocked}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                allSigned && !escrowLocked
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] hover:shadow-lg hover:shadow-[#D4AF37]/30'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {escrowLocked ? 'Funds Locked in Escrow' : 'Lock Funds in Escrow'}
            </button>

            {!currentParty.signed && (
              <button
                onClick={onSign}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Sign Contract Now
              </button>
            )}

            <button
              onClick={() => setShowAmendmentModal(true)}
              className="w-full py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] transition-colors"
            >
              Request Amendment
            </button>
          </div>
        )}

        {/* LOGISTICS ACTIONS */}
        {currentParty.role === 'logistics' && (
          <div className="space-y-3">
            <button
              onClick={() => setShowContainerModal(true)}
              disabled={!allSigned || containerReserved}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                allSigned && !containerReserved
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] hover:shadow-lg hover:shadow-[#D4AF37]/30'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {containerReserved ? 'Container Reserved' : 'Reserve Container'}
            </button>

            {!currentParty.signed && (
              <button
                onClick={onSign}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Sign Contract Now
              </button>
            )}

            <button
              onClick={() => setShowAmendmentModal(true)}
              className="w-full py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] transition-colors"
            >
              Request Amendment
            </button>
          </div>
        )}

        {/* SUPPLIER ACTIONS */}
        {currentParty.role === 'supplier' && (
          <div className="space-y-3">
            <button
              onClick={() => setShowDispatchModal(true)}
              disabled={!containerReserved || dispatchConfirmed}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                containerReserved && !dispatchConfirmed
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] hover:shadow-lg hover:shadow-[#D4AF37]/30'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {dispatchConfirmed ? 'Dispatch Confirmed' : 'Confirm Dispatch'}
            </button>

            {!currentParty.signed && (
              <button
                onClick={onSign}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Sign Contract Now
              </button>
            )}

            <button
              onClick={() => setShowAmendmentModal(true)}
              className="w-full py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] transition-colors"
            >
              Request Amendment
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: QUICK INFO */}
      <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Quick Info
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Contract value</span>
            <span className="text-white font-semibold">{formatCurrency(contract.totalValue, contract.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Escrow locked</span>
            <span className={escrowLocked ? 'text-emerald-400 font-semibold' : 'text-gray-500'}>
              {escrowLocked ? formatCurrency(contract.totalValue * 1.005, contract.currency) : '$0'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Time to deadline</span>
            <span className="text-amber-400 font-semibold">4 days left</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Last activity</span>
            <span className="text-gray-300">2 minutes ago</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: POST-FINALIZATION ACTIONS */}
      {allSigned && (
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[#D4AF37] mb-3">Contract Finalized</h3>

          <button
            onClick={onDownload}
            className="w-full py-2.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/30 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Download Contract PDF
          </button>

          <button
            onClick={handleEmailContract}
            className="w-full py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Contract to All Parties
          </button>

          <button
            onClick={() => setShowChatPanel(true)}
            className="w-full py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Open 3-Party Chat
          </button>
        </div>
      )}

      {/* PARTIES LIST */}
      <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Parties</h3>
        <div className="space-y-2">
          {contract.parties.map(party => (
            <div key={party.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                party.signed ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}>
                {party.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">{party.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getRoleBadgeColor(party.role)}`}>
                    {party.role}
                  </span>
                </div>
              </div>
              {party.signed ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}

      {/* Amendment Modal */}
      {showAmendmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Request Amendment</h3>
            <textarea
              value={amendmentReason}
              onChange={(e) => setAmendmentReason(e.target.value)}
              placeholder="Describe the changes you need..."
              className="w-full h-32 bg-[#050B18] border border-[#1E293B] rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#D4AF37]"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowAmendmentModal(false); setAmendmentReason(''); }}
                className="flex-1 py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRequestAmendment(amendmentReason);
                  setShowAmendmentModal(false);
                  setAmendmentReason('');
                }}
                disabled={!amendmentReason.trim()}
                className="flex-1 py-2.5 bg-[#D4AF37] text-[#050B18] rounded-lg font-medium hover:bg-[#B8860B] disabled:opacity-50"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escrow Modal */}
      {showEscrowModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Lock Funds in Escrow</h3>
                <p className="text-sm text-gray-400">Secure payment protection</p>
              </div>
            </div>

            <div className="bg-[#050B18] rounded-lg p-4 mb-4">
              <p className="text-sm text-white mb-2">Lock {formatCurrency(contract.totalValue, contract.currency)} in Brands Bridge Escrow?</p>
              <p className="text-xs text-gray-400 mb-3">Funds will be held securely until:</p>
              <ul className="text-xs text-gray-300 space-y-1 mb-4">
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Goods dispatched
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  BL uploaded
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Goods received by you
                </li>
              </ul>
              <div className="border-t border-[#1E293B] pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Release schedule:</span>
                  <span className="text-white">30% BL / 70% Delivery</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Escrow fee (0.5%)</span>
                  <span className="text-white">{formatCurrency(contract.totalValue * 0.005, contract.currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-white">Total lockup</span>
                  <span className="text-[#D4AF37]">{formatCurrency(contract.totalValue * 1.005, contract.currency)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEscrowModal(false)}
                disabled={isProcessingEscrow}
                className="flex-1 py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLockEscrow}
                disabled={isProcessingEscrow}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] rounded-lg font-semibold hover:bg-[#B8860B] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessingEscrow ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#050B18] border-t-transparent rounded-full animate-spin" />
                    Locking...
                  </>
                ) : (
                  <>Confirm & Lock Funds →</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Container Reservation Modal */}
      {showContainerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reserve Container</h3>
                <p className="text-sm text-gray-400">For shipment</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {[
                { id: '20ft', label: '20ft Standard', price: '$1,200' },
                { id: '40ft-hc', label: '40ft HC (recommended)', price: '$1,800', recommended: true },
                { id: '40ft-reefer', label: '40ft Reefer', price: '$2,400' },
                { id: '20ft-reefer', label: '20ft Reefer', price: '$1,800' }
              ].map(option => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedContainer === option.id
                      ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50'
                      : 'bg-[#050B18] border border-[#1E293B] hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="container"
                    value={option.id}
                    checked={selectedContainer === option.id}
                    onChange={() => setSelectedContainer(option.id)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedContainer === option.id ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-gray-500'
                  }`}>
                    {selectedContainer === option.id && (
                      <div className="w-2 h-2 bg-[#050B18] rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-white">{option.label}</span>
                    {option.recommended && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">Best value</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{option.price}</span>
                </label>
              ))}
            </div>

            <div className="bg-[#050B18] rounded-lg p-4 mb-4 text-sm">
              <div className="grid grid-cols-2 gap-2 text-gray-300">
                <span>Port:</span><span className="text-white">Mersin, Turkey</span>
                <span>Vessel:</span><span className="text-white">Maersk Edinburgh</span>
                <span>Loading:</span><span className="text-white">Feb 8, 2025</span>
                <span>ETA Hamad:</span><span className="text-white">Feb 22, 2025</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowContainerModal(false)}
                disabled={isReservingContainer}
                className="flex-1 py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReserveContainer}
                disabled={isReservingContainer}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] rounded-lg font-semibold hover:bg-[#B8860B] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isReservingContainer ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#050B18] border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>Confirm Reservation →</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Confirmation Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Confirm Dispatch</h3>
                <p className="text-sm text-gray-400">Goods ready for shipment</p>
              </div>
            </div>

            <p className="text-sm text-white mb-4">Pre-dispatch checklist:</p>

            <div className="space-y-3 mb-4">
              {[
                { key: 'goodsPacked', label: 'Goods packed & sealed' },
                { key: 'qualityInspected', label: 'Quality inspection passed (SGS)' },
                { key: 'certificatesAttached', label: 'Certificates attached' },
                { key: 'photosUploaded', label: 'Photos of loaded container' }
              ].map(item => (
                <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dispatchChecklist[item.key as keyof typeof dispatchChecklist]}
                    onChange={(e) => setDispatchChecklist(prev => ({
                      ...prev,
                      [item.key]: e.target.checked
                    }))}
                    className="mt-1 w-5 h-5 rounded border-gray-500 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-300">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="bg-[#050B18] rounded-lg p-4 mb-4 text-sm">
              <p className="text-gray-400 mb-2">Required certificates:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Certificate of Origin</li>
                <li>• Halal Certificate</li>
                <li>• Commercial Invoice</li>
                <li>• Packing List</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDispatchModal(false)}
                disabled={isConfirmingDispatch}
                className="flex-1 py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                disabled={isConfirmingDispatch || !Object.values(dispatchChecklist).every(v => v)}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] rounded-lg font-semibold hover:bg-[#B8860B] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConfirmingDispatch ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#050B18] border-t-transparent rounded-full animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>Confirm Dispatch →</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Party Chat Panel */}
      {showChatPanel && (
        <div className="fixed inset-y-0 right-0 w-80 bg-[#0C1628] border-l border-[#1E293B] z-50 flex flex-col">
          <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              3-Party Chat
            </h3>
            <button
              onClick={() => setShowChatPanel(false)}
              className="p-2 hover:bg-[#1E293B] rounded-lg"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="bg-[#050B18] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white">AR</div>
                <span className="text-sm text-white">Ahmed Al Rashid</span>
                <span className="text-xs text-gray-500">10:30 AM</span>
              </div>
              <p className="text-sm text-gray-300">Has the supplier confirmed the shipment date?</p>
            </div>

            <div className="bg-[#050B18] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs text-white">MY</div>
                <span className="text-sm text-white">Mehmet Yilmaz</span>
                <span className="text-xs text-gray-500">10:45 AM</span>
              </div>
              <p className="text-sm text-gray-300">Yes! Goods will be ready by Feb 5th. Container booking is pending.</p>
            </div>

            <div className="bg-[#050B18] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs text-white">LW</div>
                <span className="text-sm text-white">Lin Wei</span>
                <span className="text-xs text-gray-500">11:00 AM</span>
              </div>
              <p className="text-sm text-gray-300">I can arrange the 40ft HC container. ETA to Hamad Port will be Feb 22nd.</p>
            </div>
          </div>

          <div className="p-4 border-t border-[#1E293B]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-[#050B18] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button className="p-2 bg-[#D4AF37] rounded-lg hover:bg-[#B8860B] transition-colors">
                <svg className="w-5 h-5 text-[#050B18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
