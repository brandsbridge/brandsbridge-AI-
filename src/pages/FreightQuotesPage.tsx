import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ship, ArrowLeft, MapPin, Clock, DollarSign, Package, FileText,
  Check, X, Eye, Edit, Send, Calendar, AlertCircle, Loader2,
  ArrowRight, MessageSquare, Upload, CheckCircle, Truck
} from 'lucide-react';
import toast from 'react-hot-toast';

// Sample submitted quotes data
const submittedQuotes = [
  {
    id: 'Q-001',
    route: 'Istanbul → Dubai',
    container: '40ft HC',
    fobPrice: 1600,
    cifPrice: 1800,
    status: 'pending',
    submittedAt: '2 hours ago',
    expiryDate: '2025-02-20',
    cargo: 'FMCG Products',
    weight: 18,
    buyerName: 'Gulf Trading Co.'
  },
  {
    id: 'Q-002',
    route: 'Mersin → Jeddah',
    container: '40ft',
    fobPrice: 2000,
    cifPrice: 2200,
    status: 'accepted',
    submittedAt: '1 day ago',
    expiryDate: '2025-02-15',
    cargo: 'Confectionery',
    weight: 22,
    buyerName: 'OZMO Confectionery'
  },
  {
    id: 'Q-003',
    route: 'Hamburg → Doha',
    container: '40ft HC',
    fobPrice: 2600,
    cifPrice: 2800,
    status: 'rejected',
    submittedAt: '2 days ago',
    expiryDate: '2025-02-10',
    cargo: 'Consumer Goods',
    weight: 25,
    buyerName: 'Spinneys Dubai'
  },
  {
    id: 'Q-004',
    route: 'Shanghai → Jebel Ali',
    container: '40ft',
    fobPrice: 2700,
    cifPrice: 2900,
    status: 'pending',
    submittedAt: '3 days ago',
    expiryDate: '2025-02-25',
    cargo: 'Electronics',
    weight: 20,
    buyerName: 'Al Meera Consumer Goods'
  },
  {
    id: 'Q-005',
    route: 'Istanbul → Abu Dhabi',
    container: '20ft',
    fobPrice: 1200,
    cifPrice: 1400,
    status: 'expired',
    submittedAt: '5 days ago',
    expiryDate: '2025-02-05',
    cargo: 'Textiles',
    weight: 15,
    buyerName: 'Lulu Group'
  }
];

const FreightQuotesPage = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState(submittedQuotes);
  const [selectedQuote, setSelectedQuote] = useState<typeof submittedQuotes[0] | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ fobPrice: '', cifPrice: '', transitDays: '' });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'expired'>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: '⏳ Pending', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'accepted':
        return { label: '✅ Accepted', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'rejected':
        return { label: '❌ Rejected', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
      case 'expired':
        return { label: '⏰ Expired', bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };
      default:
        return { label: status, bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };
    }
  };

  const filteredQuotes = quotes.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const handleUpdate = (quote: typeof submittedQuotes[0]) => {
    setSelectedQuote(quote);
    setEditForm({
      fobPrice: quote.fobPrice.toString(),
      cifPrice: quote.cifPrice.toString(),
      transitDays: ''
    });
    setShowEditModal(true);
  };

  const handleConfirmUpdate = () => {
    if (!editForm.cifPrice) {
      toast.error('Please enter CIF price');
      return;
    }
    setQuotes(quotes.map(q =>
      q.id === selectedQuote?.id
        ? { ...q, fobPrice: parseInt(editForm.fobPrice) || q.fobPrice, cifPrice: parseInt(editForm.cifPrice) || q.cifPrice }
        : q
    ));
    toast.success('Quote updated successfully!');
    setShowEditModal(false);
  };

  const handleWithdraw = (quote: typeof submittedQuotes[0]) => {
    setSelectedQuote(quote);
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setQuotes(quotes.filter(q => q.id !== selectedQuote?.id));
      toast.success('Quote withdrawn successfully');
      setIsWithdrawing(false);
      setShowWithdrawModal(false);
      setSelectedQuote(null);
    }, 1000);
  };

  const handleViewDeal = (quote: typeof submittedQuotes[0]) => {
    navigate(`/freight/shipments/${quote.id}`);
  };

  // Calculate stats
  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
    totalValue: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.cifPrice, 0)
  };

  return (
    <div className="min-h-screen bg-[#050B18]">
      {/* Header */}
      <div className="bg-[#070E1F] border-b border-[#1E3A5F] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/freight/dashboard')}
              className="p-2 hover:bg-[#1E3A5F] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Submitted Quotes</h1>
              <p className="text-sm text-slate-400">Track and manage your freight quotes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-4">
            <div className="text-slate-400 text-sm mb-1">Total Quotes</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-4">
            <div className="text-slate-400 text-sm mb-1">Pending</div>
            <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
          </div>
          <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-4">
            <div className="text-slate-400 text-sm mb-1">Accepted</div>
            <div className="text-2xl font-bold text-emerald-400">{stats.accepted}</div>
          </div>
          <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl p-4">
            <div className="text-slate-400 text-sm mb-1">Won Value</div>
            <div className="text-2xl font-bold text-[#D4AF37]">${stats.totalValue.toLocaleString()}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: `All (${quotes.length})` },
            { id: 'pending', label: `Pending (${stats.pending})` },
            { id: 'accepted', label: `Accepted (${stats.accepted})` },
            { id: 'rejected', label: `Rejected (${stats.rejected})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.id
                  ? 'bg-[#1E40AF] text-white'
                  : 'bg-[#0C1628] text-slate-400 hover:text-white border border-[#1E3A5F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quotes Table */}
        <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#070E1F] border-b border-[#1E3A5F]">
                <tr>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-3">Quote ID</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-3">Route</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-3">Container</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-3">Your Rate</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-3">Status</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-3">Submitted</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]/50">
                {filteredQuotes.map(quote => {
                  const statusBadge = getStatusBadge(quote.status);
                  return (
                    <tr key={quote.id} className="hover:bg-[#070E1F]/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{quote.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span className="text-white">{quote.route}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{quote.container}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-emerald-400 font-semibold">${quote.cifPrice.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">CIF</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 text-sm">{quote.submittedAt}</div>
                        <div className="text-xs text-slate-500">Expires: {quote.expiryDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {quote.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdate(quote)}
                                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                title="Update Quote"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleWithdraw(quote)}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                title="Withdraw Quote"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {quote.status === 'accepted' && (
                            <button
                              onClick={() => handleViewDeal(quote)}
                              className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              View Deal
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {quote.status === 'rejected' && (
                            <button
                              onClick={() => setQuotes(quotes.filter(q => q.id !== quote.id))}
                              className="p-2 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 transition-colors"
                              title="Archive"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              toast.success('Quote details expanded');
                            }}
                            className="p-2 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredQuotes.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No quotes found with the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Quote Modal */}
      {showEditModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Update Quote {selectedQuote.id}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#070E1F] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">{selectedQuote.route}</span>
                </div>
                <div className="text-sm text-slate-400">{selectedQuote.container} • {selectedQuote.cargo}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">FOB Price (USD)</label>
                  <input
                    type="number"
                    value={editForm.fobPrice}
                    onChange={(e) => setEditForm({...editForm, fobPrice: e.target.value})}
                    className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">CIF Price (USD)</label>
                  <input
                    type="number"
                    value={editForm.cifPrice}
                    onChange={(e) => setEditForm({...editForm, cifPrice: e.target.value})}
                    className="w-full px-4 py-3 bg-[#070E1F] border border-[#1E3A5F] rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpdate}
                  className="flex-1 py-3 bg-gradient-to-r from-[#1E40AF] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Update Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1628] border border-[#1E3A5F] rounded-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Withdraw Quote?</h3>
              <p className="text-slate-400">
                Are you sure you want to withdraw quote {selectedQuote.id} for {selectedQuote.route}?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                disabled={isWithdrawing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Withdrawing...
                  </>
                ) : (
                  'Withdraw Quote'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreightQuotesPage;
