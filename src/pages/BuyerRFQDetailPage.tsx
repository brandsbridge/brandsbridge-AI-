import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Check, MessageSquare, X, Send, Clock,
  Package, MapPin, Calendar, FileText, Shield, TrendingUp,
  AlertCircle, CheckCircle2, Loader2, ChevronRight, FileDown
} from 'lucide-react';
import { useBuyer, Quote } from '../context/BuyerContext';
import toast from 'react-hot-toast';

const BuyerRFQDetailPage = () => {
  const { rfqId } = useParams<{ rfqId: string }>();
  const navigate = useNavigate();
  const { getRfqById, acceptQuote, declineQuote, startNegotiation } = useBuyer();

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showNegotiationPanel, setShowNegotiationPanel] = useState(false);
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState<number | null>(null);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [negotiationMessages, setNegotiationMessages] = useState<{ from: 'buyer' | 'supplier'; text: string; time: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const rfq = getRfqById(rfqId || '');

  useEffect(() => {
    if (!rfq) {
      toast.error('RFQ not found');
      navigate('/buyer/rfqs');
    }
  }, [rfq, navigate]);

  if (!rfq) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quotes_received': return 'bg-blue-500/20 text-blue-400';
      case 'ready_to_accept': return 'bg-emerald-500/20 text-emerald-400';
      case 'in_negotiation': return 'bg-amber-500/20 text-amber-400';
      case 'accepted': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'quotes_received': return 'Quotes Received';
      case 'ready_to_accept': return 'Ready to Accept';
      case 'in_negotiation': return 'In Negotiation';
      case 'accepted': return 'Accepted';
      default: return status;
    }
  };

  const handleAccept = (quoteIndex: number) => {
    setSelectedQuoteIndex(quoteIndex);
    setShowAcceptModal(true);
  };

  const confirmAccept = () => {
    if (selectedQuoteIndex === null) return;

    const newOrderId = acceptQuote(rfq.id, selectedQuoteIndex);
    setShowAcceptModal(false);
    toast.success('Deal created! Supplier notified. Contract will be sent shortly.');

    setTimeout(() => {
      navigate(`/buyer/orders/${newOrderId}`);
    }, 1500);
  };

  const handleDecline = (quoteIndex: number) => {
    setSelectedQuoteIndex(quoteIndex);
    setDeclineReason('');
    setShowDeclineModal(true);
  };

  const confirmDecline = () => {
    if (selectedQuoteIndex === null) return;

    declineQuote(rfq.id, selectedQuoteIndex);
    setShowDeclineModal(false);
    toast.success('Supplier notified of your decision');
  };

  const handleNegotiate = (quoteIndex: number) => {
    setSelectedQuoteIndex(quoteIndex);
    startNegotiation(rfq.id, quoteIndex);
    setNegotiationMessages([
      { from: 'supplier', text: 'Hello! Thank you for your interest. How can I help you with this quote?', time: 'Just now' }
    ]);
    setShowNegotiationPanel(true);
  };

  const sendNegotiation = () => {
    if (!negotiationMessage.trim()) return;

    setNegotiationMessages(prev => [...prev, {
      from: 'buyer',
      text: negotiationMessage,
      time: 'Just now'
    }]);

    const sentMessage = negotiationMessage;
    setNegotiationMessage('');

    // Simulate supplier typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setNegotiationMessages(prev => [...prev, {
        from: 'supplier',
        text: 'Thank you for your message. Let me review and get back to you shortly.',
        time: 'Just now'
      }]);
    }, 3000);
  };

  const getMatchColor = (match: number) => {
    if (match >= 95) return 'text-emerald-400';
    if (match >= 85) return 'text-blue-400';
    return 'text-slate-400';
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Header */}
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/buyer/rfqs')}
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-white">{rfq.product}</h1>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(rfq.status)}`}>
                    {getStatusLabel(rfq.status)}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">{rfq.quantity} • {rfq.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm">
                <FileText className="w-4 h-4 inline mr-2" />
                Duplicate
              </button>
              <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm">
                Cancel RFQ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* RFQ Details Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            Original RFQ Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-500 uppercase mb-1">Product</div>
              <div className="text-white font-medium">{rfq.product}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-500 uppercase mb-1">Quantity</div>
              <div className="text-white font-medium">{rfq.quantity}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-500 uppercase mb-1">Destination</div>
              <div className="text-white font-medium">{rfq.destination}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-500 uppercase mb-1">Certifications</div>
              <div className="text-white font-medium">{rfq.certifications || 'None specified'}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <span>Created: {rfq.createdAt}</span>
            <span>•</span>
            <span>{rfq.quotes.length} quotes received</span>
          </div>
        </div>

        {/* Quotes Comparison Table */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent px-6 py-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Quotes Received ({rfq.quotes.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr className="text-left text-xs text-slate-500 uppercase">
                  <th className="px-6 py-3 font-medium">Supplier</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Lead Time</th>
                  <th className="px-4 py-3 font-medium">Certifications</th>
                  <th className="px-4 py-3 font-medium">Match</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rfq.quotes.map((quote, index) => (
                  <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{quote.supplierFlag}</span>
                        <div>
                          <div className="text-white font-medium">{quote.supplierName}</div>
                          <div className="text-xs text-slate-500">
                            {quote.status === 'negotiating' && (
                              <span className="text-amber-400">● In negotiation</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xl font-bold text-emerald-400">${quote.price.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">per unit</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-4 h-4" />
                        {quote.leadTime} days
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {quote.certifications.map((cert, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`text-xl font-bold ${getMatchColor(quote.match)}`}>
                        {quote.match}%
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(index)}
                          className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 text-sm flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleNegotiate(index)}
                          className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Negotiate
                        </button>
                        <button
                          onClick={() => handleDecline(index)}
                          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && selectedQuoteIndex !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Accept Quote</h3>
              <button onClick={() => setShowAcceptModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{rfq.quotes[selectedQuoteIndex].supplierFlag}</span>
                <div>
                  <div className="text-white font-semibold">{rfq.quotes[selectedQuoteIndex].supplierName}</div>
                  <div className="text-sm text-slate-400">{rfq.product}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-xs text-slate-500">Total Value</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ${(rfq.quotes[selectedQuoteIndex].price * parseInt(rfq.quantity) * 1000).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Lead Time</div>
                  <div className="text-lg font-semibold text-white">
                    {rfq.quotes[selectedQuoteIndex].leadTime} days
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  By confirming, a purchase order will be created and the supplier will be notified immediately.
                </p>
              </div>
            </div>

            <button
              onClick={confirmAccept}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Confirm & Create Deal
            </button>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && selectedQuoteIndex !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Decline Quote</h3>
              <button onClick={() => setShowDeclineModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-slate-400 mb-4">
              Optionally, let the supplier know why you're declining:
            </p>

            <select
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white mb-4"
            >
              <option value="">Select a reason (optional)</option>
              <option value="price">Price too high</option>
              <option value="lead_time">Lead time too long</option>
              <option value="better_offer">Found better offer</option>
              <option value="other">Other</option>
            </select>

            <button
              onClick={confirmDecline}
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all"
            >
              Decline Quote
            </button>
          </div>
        </div>
      )}

      {/* Negotiation Panel */}
      {showNegotiationPanel && selectedQuoteIndex !== null && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowNegotiationPanel(false)} />
      )}
      {showNegotiationPanel && selectedQuoteIndex !== null && (
        <div className="fixed right-0 top-0 h-full w-96 bg-[#111827] border-l border-slate-800 z-50 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{rfq.quotes[selectedQuoteIndex].supplierFlag}</span>
              <div>
                <div className="text-white font-semibold">{rfq.quotes[selectedQuoteIndex].supplierName}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setShowNegotiationPanel(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {negotiationMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-3 ${
                  msg.from === 'buyer'
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-slate-800 text-white'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === 'buyer' ? 'text-amber-800' : 'text-slate-500'}`}>{msg.time}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Supplier is typing...
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={negotiationMessage}
                onChange={(e) => setNegotiationMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendNegotiation()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={sendNegotiation}
                disabled={!negotiationMessage.trim()}
                className="px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-amber-500 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerRFQDetailPage;