import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../../contexts/ContractContext';
import { useGlobalTrade } from '../../contexts/GlobalTradeContext';

// This page demonstrates LIVE STATE SYNC across all portals
// When actions happen in Contract Room, they reflect in Buyer Dashboard, Supplier Portal, and CRB Hub

interface LiveEvent {
  id: string;
  source: 'buyer' | 'supplier' | 'logistics' | 'contract' | 'system';
  message: string;
  timestamp: string;
  icon: string;
}

export const LiveStateSync: React.FC = () => {
  const navigate = useNavigate();
  const { contracts, getSignatureStatus } = useContract();
  const { addNotification } = useGlobalTrade();
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [selectedContract, setSelectedContract] = useState(contracts[0]);

  // Simulate signing to see live updates across dashboards
  const simulateSign = (partyRole: 'buyer' | 'supplier' | 'logistics') => {
    const partyId = partyRole === 'buyer' ? 'buyer-001' : partyRole === 'supplier' ? 'supplier-001' : 'logistics-001';
    const party = selectedContract.parties.find(p => p.role === partyRole);
    if (!party || party.signed) return;

    const newEvent: LiveEvent = {
      id: `live-${Date.now()}`,
      source: partyRole,
      message: `${party.name} (${partyRole}) signed the contract`,
      timestamp: new Date().toISOString(),
      icon: partyRole === 'buyer' ? 'shopping-cart' : partyRole === 'supplier' ? 'factory' : 'truck'
    };

    setLiveEvents(prev => [newEvent, ...prev]);

    // Add notification to global trade context
    addNotification({
      type: 'contract_signed',
      title: `${party.name} Signed Contract`,
      message: `${party.company} has signed the ${selectedContract.title} contract`,
      dashboard: partyRole === 'buyer' ? 'buyer' : partyRole === 'supplier' ? 'supplier' : 'freight',
      relatedId: selectedContract.id
    });
  };

  // Simulate finalize to see cross-dashboard notifications
  const simulateFinalize = () => {
    const newEvent: LiveEvent = {
      id: `live-${Date.now()}`,
      source: 'contract',
      message: `Contract FINALIZED - ${selectedContract.title}`,
      timestamp: new Date().toISOString(),
      icon: 'check-circle'
    };

    setLiveEvents(prev => [newEvent, ...prev]);

    addNotification({
      type: 'contract_finalized',
      title: 'Contract Finalized!',
      message: `${selectedContract.title} is now active with all parties signed`,
      dashboard: 'buyer',
      relatedId: selectedContract.id
    });
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'shopping-cart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'factory':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'truck':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'check-circle':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'buyer': return 'bg-purple-500/20 text-purple-400 border-purple-500';
      case 'supplier': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500';
      case 'logistics': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'contract': return 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#050B18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Live State Sync Dashboard</h1>
            <p className="text-sm text-gray-400">Watch how contract actions propagate across all portals in real-time</p>
          </div>
        </div>
      </div>

      {/* Contract Selector */}
      <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-6 mb-6">
        <h3 className="text-sm font-semibold text-[#D4AF37] mb-4">Select Contract to Demo</h3>
        <div className="flex gap-3 flex-wrap">
          {contracts.map(contract => (
            <button
              key={contract.id}
              onClick={() => setSelectedContract(contract)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedContract.id === contract.id
                  ? 'bg-[#D4AF37] text-[#050B18]'
                  : 'bg-[#1E293B] text-gray-300 hover:bg-[#2D3748]'
              }`}
            >
              {contract.id}: {contract.title.slice(0, 30)}...
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Simulator Controls */}
        <div className="space-y-6">
          {/* Contract Status Card */}
          <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Contract Status: {selectedContract.id}
            </h3>

            {/* Signature Status */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {selectedContract.parties.map(party => {
                const signatureStatus = getSignatureStatus(selectedContract);
                const isSigned = party.role === 'buyer' ? signatureStatus.buyer :
                                 party.role === 'supplier' ? signatureStatus.supplier :
                                 signatureStatus.logistics;

                return (
                  <div key={party.id} className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      isSigned ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}>
                      {isSigned ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${
                      party.role === 'buyer' ? 'text-purple-400' :
                      party.role === 'supplier' ? 'text-emerald-400' : 'text-orange-400'
                    }`}>{party.role}</p>
                    <p className="text-xs text-gray-500">{isSigned ? 'Signed' : 'Pending'}</p>
                  </div>
                );
              })}
            </div>

            {/* Simulate Actions */}
            <div className="border-t border-[#1E293B] pt-4">
              <p className="text-xs text-gray-500 mb-3">Click to simulate signing:</p>
              <div className="grid grid-cols-3 gap-3">
                {selectedContract.parties.map(party => (
                  <button
                    key={party.id}
                    onClick={() => simulateSign(party.role)}
                    disabled={party.signed}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      party.signed
                        ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                        : party.role === 'buyer'
                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : party.role === 'supplier'
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {party.signed ? '✓ Signed' : `Sign (${party.role})`}
                  </button>
                ))}
              </div>

              {/* Finalize Button */}
              <button
                onClick={simulateFinalize}
                disabled={!selectedContract.parties.every(p => p.signed)}
                className={`w-full mt-4 py-3 rounded-lg font-semibold transition-all ${
                  selectedContract.parties.every(p => p.signed)
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] hover:shadow-lg hover:shadow-[#D4AF37]/30'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedContract.parties.every(p => p.signed)
                  ? 'Finalize Contract (Trigger All Notifications)'
                  : 'All signatures required to finalize'}
              </button>
            </div>
          </div>

          {/* Dashboard Navigation */}
          <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Navigate to Real Dashboards</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/buyer')}
                className="py-3 px-4 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-medium hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Buyer Dashboard
              </button>
              <button
                onClick={() => navigate('/supplier')}
                className="py-3 px-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
                Supplier Portal
              </button>
              <button
                onClick={() => navigate('/contract-room/contract-001')}
                className="py-3 px-4 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] font-medium hover:bg-[#D4AF37]/30 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Contract Room
              </button>
              <button
                onClick={() => navigate('/freight')}
                className="py-3 px-4 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 font-medium hover:bg-orange-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Freight Hub
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Event Stream */}
        <div className="bg-[#0C1628] rounded-xl border border-[#1E293B] h-[600px] flex flex-col">
          <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
              </div>
              Live Event Stream
            </h3>
            <button
              onClick={() => setLiveEvents([])}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear Events
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {liveEvents.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1E293B]/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No events yet</p>
                  <p className="text-xs text-gray-600">Click "Sign" buttons to trigger live updates</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {liveEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border transition-all animate-pulse ${
                      index === 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#050B18] border-[#1E293B]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getSourceColor(event.source)}`}>
                        {getIcon(event.icon)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{event.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSourceColor(event.source)}`}>
                            {event.source}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#1E293B] bg-[#050B18]/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{liveEvents.length} events captured</span>
              <span>Cross-dashboard sync active</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-6 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">How Live State Sync Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">1</div>
            <div>
              <p className="text-white font-medium">Contract Room</p>
              <p className="text-xs text-gray-400">Action happens (sign, edit, finalize)</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">2</div>
            <div>
              <p className="text-white font-medium">ContractContext</p>
              <p className="text-xs text-gray-400">Updates state, notifies subscribers</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">3</div>
            <div>
              <p className="text-white font-medium">All Dashboards</p>
              <p className="text-xs text-gray-400">Receive live updates via GlobalTradeContext</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStateSync;
