import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Package, ChevronRight, ArrowLeft, Search, Filter,
  Truck, Clock, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const BuyerRFQsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  const rfqs = [
    { id: 'rfq-001', product: 'UHT Milk', quantity: '500 MT', status: 'quotes_received', quotes: 3, created: 'Jan 20' },
    { id: 'rfq-002', product: 'Chocolate Wafers', quantity: '1,000 cases', status: 'ready_to_accept', quotes: 5, created: 'Jan 18' },
    { id: 'rfq-003', product: 'Basmati Rice', quantity: '200 MT', status: 'in_negotiation', quotes: 4, created: 'Jan 15' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'quotes_received': return 'bg-blue-500/20 text-blue-400';
      case 'ready_to_accept': return 'bg-emerald-500/20 text-emerald-400';
      case 'in_negotiation': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'quotes_received': return 'Quotes Received';
      case 'ready_to_accept': return 'Ready to Accept';
      case 'in_negotiation': return 'In Negotiation';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Header */}
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">My RFQs</h1>
              <p className="text-slate-400 text-sm">Track and manage your quote requests</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            {['all', 'pending', 'accepted', 'declined'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RFQ List */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {rfqs.map((rfq) => (
            <div
              key={rfq.id}
              onClick={() => navigate(`/buyer/rfqs/${rfq.id}`)}
              className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{rfq.product}</h3>
                    <p className="text-slate-400 text-sm">{rfq.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(rfq.status)}`}>
                      {getStatusLabel(rfq.status)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{rfq.quotes} quotes</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerRFQsPage;