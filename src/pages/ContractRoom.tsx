import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useContract } from '../contexts/ContractContext';
import { useAuth } from '../context/AuthContext';
import { ContractRoomHeader } from '../components/contract/ContractRoomHeader';
import { DigitalContract } from '../components/contract/DigitalContract';
import { ThreeSignaturePads } from '../components/contract/ThreeSignaturePads';
import { ActivityLog } from '../components/contract/ActivityLog';
import { ActionSidebar } from '../components/contract/ActionSidebar';

export const ContractRoom: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const { getContractById, signContract, addContractEvent, currentContract, setCurrentContract } = useContract();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileSignature, setShowMobileSignature] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  // Simulated party ID based on user role (in real app, this would come from auth context)
  // Note: Contract roles use 'logistics' but auth uses 'shipping' for logistics parties
  const currentPartyId = user?.role === 'buyer'
    ? 'buyer-001'
    : user?.role === 'supplier'
    ? 'supplier-001'
    : user?.role === 'shipping'
    ? 'logistics-001'
    : 'buyer-001';

  // Determine live status based on contract state
  const getLiveStatus = () => {
    if (!currentContract) return 'awaiting';
    if (currentContract.status === 'active') return 'executing';
    if (currentContract.status === 'completed') return 'finalized';
    return 'awaiting';
  };

  useEffect(() => {
    if (contractId) {
      const contract = getContractById(contractId);
      if (contract) {
        setCurrentContract(contract);
        // Log that user viewed the contract
        addContractEvent(contractId, {
          type: 'viewed',
          party: currentPartyId,
          message: 'Contract viewed'
        });
      }
      setIsLoading(false);
    }
  }, [contractId, getContractById, setCurrentContract, addContractEvent, currentPartyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentContract) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Contract Not Found</h2>
          <p className="text-gray-400 mb-4">The contract you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#D4AF37] text-[#050B18] rounded-lg font-medium hover:bg-[#B8860B] transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const currentParty = currentContract.parties.find(p => p.id === currentPartyId);

  if (!currentParty) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">You are not a party to this contract.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#D4AF37] text-[#050B18] rounded-lg font-medium hover:bg-[#B8860B] transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleSign = (partyId: string, signatureName: string) => {
    signContract(currentContract.id, partyId, signatureName);
    setShowMobileSignature(false);
    toast.success(`${signatureName} - Contract signed successfully!`, {
      style: {
        background: '#0C1628',
        color: '#D4AF37',
        border: '1px solid #D4AF37',
      },
    });
  };

  const handleFieldChange = (field: string, oldValue: string, newValue: string) => {
    // Log the field change to activity
    addContractEvent(currentContract.id, {
      type: 'edited',
      party: currentPartyId,
      message: `${currentParty.name} modified ${field} from "${oldValue}" to "${newValue}"`
    });

    toast.success(`${field} updated`, {
      style: {
        background: '#0C1628',
        color: '#fff',
        border: '1px solid #1E293B',
      },
    });
  };

  const handleSignatureReset = () => {
    // If contract was fully signed and modified, reset signatures
    const allWereSigned = currentContract.parties.every(p => p.signed);
    if (allWereSigned) {
      addContractEvent(currentContract.id, {
        type: 'status_change',
        party: 'System',
        message: 'Contract modified - all signatures have been reset'
      });

      toast.error('Contract modified - all parties must re-sign', {
        style: {
          background: '#0C1628',
          color: '#EF4444',
          border: '1px solid #EF4444',
        },
      });
    }
  };

  const handleRequestAmendment = (reason: string) => {
    addContractEvent(currentContract.id, {
      type: 'message',
      party: currentPartyId,
      message: `Amendment requested: ${reason}`
    });
    toast.success('Amendment request submitted', {
      style: {
        background: '#0C1628',
        color: '#fff',
        border: '1px solid #1E293B',
      },
    });
  };

  const handleDownload = () => {
    toast.success('Contract PDF downloaded', {
      style: {
        background: '#0C1628',
        color: '#D4AF37',
        border: '1px solid #D4AF37',
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#050B18] contract-room-container">
      {/* Header */}
      <ContractRoomHeader
        contract={currentContract}
        currentPartyId={currentPartyId}
        liveStatus={getLiveStatus()}
      />

      {/* Main Content - Desktop */}
      <div className="p-4 md:p-6 hidden md:block">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-180px)]">
          {/* Left Column - Contract Content */}
          <div className="flex-1 flex flex-col gap-4 lg:gap-6 min-h-0">
            {/* Digital Contract */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <DigitalContract
                contract={currentContract}
                currentPartyId={currentPartyId}
                onFieldChange={handleFieldChange}
                onSignatureReset={handleSignatureReset}
              />
            </div>

            {/* Three Signature Pads */}
            <ThreeSignaturePads
              contract={currentContract}
              currentPartyId={currentPartyId}
              onSign={handleSign}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-80 space-y-4 overflow-y-auto">
            {/* Action Sidebar */}
            <ActionSidebar
              contract={currentContract}
              currentParty={currentParty}
              onSign={() => setShowMobileSignature(true)}
              onRequestAmendment={handleRequestAmendment}
              onDownload={handleDownload}
            />

            {/* Activity Log */}
            <ActivityLog
              events={currentContract.events}
              currentPartyId={currentPartyId}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-[calc(100vh-120px)]">
        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E293B] bg-[#0C1628]">
          <button
            onClick={() => { setShowMobileActions(false); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              !showMobileActions ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'
            }`}
          >
            Contract
          </button>
          <button
            onClick={() => { setShowMobileActions(true); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              showMobileActions ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'
            }`}
          >
            Actions & Log
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {!showMobileActions ? (
            // Contract View
            <div className="space-y-4">
              <DigitalContract
                contract={currentContract}
                currentPartyId={currentPartyId}
                onFieldChange={handleFieldChange}
                onSignatureReset={handleSignatureReset}
              />

              {/* Signature Section */}
              <ThreeSignaturePads
                contract={currentContract}
                currentPartyId={currentPartyId}
                onSign={handleSign}
              />
            </div>
          ) : (
            // Actions & Activity Log
            <div className="space-y-4">
              <ActionSidebar
                contract={currentContract}
                currentParty={currentParty}
                onSign={() => setShowMobileSignature(true)}
                onRequestAmendment={handleRequestAmendment}
                onDownload={handleDownload}
              />

              {/* Collapsible Activity Log */}
              <ActivityLog
                events={currentContract.events}
                currentPartyId={currentPartyId}
              />
            </div>
          )}
        </div>

        {/* Sticky Action Buttons */}
        <div className="sticky bottom-0 bg-[#050B18] border-t border-[#1E293B] p-4">
          <div className="flex gap-2">
            {!currentParty.signed && (
              <button
                onClick={() => setShowMobileSignature(true)}
                className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all"
              >
                Sign Contract
              </button>
            )}
            <button
              onClick={handleDownload}
              className="py-3 px-4 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        /* Slide in animation for toasts */
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .contract-room-container {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
};
