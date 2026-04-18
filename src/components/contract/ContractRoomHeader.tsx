import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contract } from '../../contexts/ContractContext';

interface ContractRoomHeaderProps {
  contract: Contract;
  currentPartyId: string;
  liveStatus?: 'awaiting' | 'finalized' | 'executing';
}

export const ContractRoomHeader: React.FC<ContractRoomHeaderProps> = ({
  contract,
  currentPartyId,
  liveStatus = 'awaiting'
}) => {
  const navigate = useNavigate();
  const currentParty = contract.parties.find(p => p.id === currentPartyId);

  // Get supplier and buyer from parties
  const supplier = contract.parties.find(p => p.role === 'supplier');
  const buyer = contract.parties.find(p => p.role === 'buyer');

  const statusConfig = {
    awaiting: {
      color: 'bg-amber-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/20',
      label: 'Awaiting Signatures',
      pulse: true
    },
    finalized: {
      color: 'bg-emerald-500',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      label: 'Contract Finalized',
      pulse: false
    },
    executing: {
      color: 'bg-blue-500',
      text: 'text-blue-400',
      bg: 'bg-blue-500/20',
      label: 'In Execution',
      pulse: true
    }
  };

  const status = statusConfig[liveStatus];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-[#0C1628] border-b border-[#1E293B]">
      {/* Top Bar */}
      <div className="px-6 py-3 border-b border-[#1E293B]/50">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#1E293B] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#050B18]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-[#D4AF37]">Smart Contract Room</span>
                <span className="mx-2 text-gray-600">|</span>
                <span className="text-sm text-gray-400 font-mono">{contract.id.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Center: Live Status Indicator */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${status.bg}`}>
            <div className={`w-2 h-2 rounded-full ${status.color} ${status.pulse ? 'animate-pulse' : ''}`} />
            <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Other Parties Avatars */}
            <div className="flex items-center -space-x-2">
              {contract.parties.filter(p => p.id !== currentPartyId).map(party => (
                <div
                  key={party.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-[#0C1628] ${
                    party.signed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  title={`${party.company}: ${party.signed ? 'Signed' : 'Pending'}`}
                >
                  {party.name.split(' ').map(n => n[0]).join('')}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#2D3748] text-gray-300 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Exit Room
            </button>
          </div>
        </div>
      </div>

      {/* Deal Summary Bar */}
      <div className="px-6 py-3 bg-[#050B18]/50">
        <div className="flex items-center justify-between">
          {/* Trade Flow */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Supplier</p>
              <p className="text-sm font-semibold text-white">{supplier?.company || 'N/A'}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Buyer</p>
              <p className="text-sm font-semibold text-white">{buyer?.company || 'N/A'}</p>
            </div>
          </div>

          {/* Deal Details */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Value</p>
              <p className="text-lg font-bold text-[#D4AF37]">
                {formatCurrency(contract.totalValue, contract.currency)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">Product</p>
              <p className="text-sm font-medium text-white">{contract.product}</p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="text-sm font-medium text-white">{contract.quantity}</p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm font-medium text-white">
                {new Date(contract.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="text-sm font-medium text-amber-400">
                {new Date(contract.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
