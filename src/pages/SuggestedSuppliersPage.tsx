import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Lightbulb, ArrowLeft, Send, X, Star, MapPin, Calendar, Package,
  Snowflake, Droplets, Sun, ArrowRight, CheckCircle, Clock, Archive,
  MessageSquare, TrendingUp, Info
} from 'lucide-react';
import { suggestedSuppliers3PL } from '../data/mockData';
import { SuggestedSupplier3PL } from '../data/mockData';

// Color Theme - Ice Blue / Slate
const colors = {
  bg: '#050B18',
  sidebar: '#070E1F',
  card: '#0C1628',
  primary: '#0369A1',
  accent: '#38BDF8',
  silver: '#94A3B8',
  border: '#1E3A5F',
  success: '#10B981',
  gold: '#D4AF37',
  warning: '#F59E0B',
  danger: '#EF4444'
};

const SuggestedSuppliersPage = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<SuggestedSupplier3PL[]>(suggestedSuppliers3PL);
  const [activeTab, setActiveTab] = useState<'new' | 'contacted' | 'converted' | 'archived'>('new');
  const [showOfferModal, setShowOfferModal] = useState<SuggestedSupplier3PL | null>(null);
  const [offerMessage, setOfferMessage] = useState('');

  const tabs = [
    { key: 'new' as const, label: 'New', count: suggestions.filter(s => s.status === 'new').length },
    { key: 'contacted' as const, label: 'Contacted', count: suggestions.filter(s => s.status === 'contacted').length },
    { key: 'converted' as const, label: 'Converted', count: suggestions.filter(s => s.status === 'converted').length },
    { key: 'archived' as const, label: 'Archived', count: suggestions.filter(s => s.status === 'archived').length }
  ];

  const filteredSuggestions = suggestions.filter(s => s.status === activeTab);

  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'Frozen': return <Snowflake className="w-4 h-4" />;
      case 'Chilled': return <Droplets className="w-4 h-4" />;
      case 'Ambient': return <Sun className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'Frozen': return { bg: 'rgba(56,189,248,0.15)', color: '#38BDF8' };
      case 'Chilled': return { bg: 'rgba(6,182,212,0.15)', color: '#06B6D4' };
      case 'Ambient': return { bg: 'rgba(251,191,36,0.15)', color: '#FBBF24' };
      default: return { bg: 'rgba(148,163,184,0.15)', color: '#94A3B8' };
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return colors.success;
    if (confidence >= 70) return colors.warning;
    return colors.silver;
  };

  const openOfferModal = (supplier: SuggestedSupplier3PL) => {
    const defaultMessage = `Hi ${supplier.supplierName} team,

We noticed you have a shipment arriving in ${supplier.shipmentRoute.split('→')[1].trim()} on ${new Date(supplier.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.

We have ${supplier.estimatedPallets} pallets available in our ${supplier.suggestedZone} zone at competitive rates.

Would you be interested in a storage quote?

Best regards,
Gulf Cold Chain Co.`;

    setOfferMessage(defaultMessage);
    setShowOfferModal(supplier);
  };

  const sendOffer = () => {
    if (!showOfferModal) return;

    setSuggestions(prev => prev.map(s =>
      s.id === showOfferModal.id
        ? { ...s, status: 'contacted' as const }
        : s
    ));

    toast.success(`Storage offer sent to ${showOfferModal.supplierName}!`);
    setShowOfferModal(null);
  };

  const archiveSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === id
        ? { ...s, status: 'archived' as const }
        : s
    ));
    toast.success('Suggestion archived');
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      {/* Header */}
      <div className="border-b" style={{ background: colors.sidebar, borderColor: colors.border }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/3pl/dashboard')}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5" style={{ color: colors.gold }} />
                Suggested Suppliers
              </h1>
              <p className="text-sm text-gray-400">Suppliers shipping to your area who may need your storage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* How Badge */}
        <div
          className="rounded-xl border p-5 mb-8"
          style={{ background: 'rgba(251,191,36,0.05)', borderColor: 'rgba(251,191,36,0.2)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(251,191,36,0.15)' }}
            >
              <Info className="w-5 h-5" style={{ color: colors.gold }} />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">How does this work?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our AI monitors active shipments on the platform. When a supplier ships to your city or region,
                we notify you — so you can reach out first before they find another warehouse.
                This gives you a competitive edge in landing new storage clients.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border p-4 text-center" style={{ background: colors.card, borderColor: colors.border }}>
            <div className="text-2xl font-bold text-white">{suggestions.filter(s => s.status === 'new').length}</div>
            <div className="text-sm text-gray-400">New Leads</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ background: colors.card, borderColor: colors.border }}>
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>{suggestions.filter(s => s.status === 'contacted').length}</div>
            <div className="text-sm text-gray-400">Contacted</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ background: colors.card, borderColor: colors.border }}>
            <div className="text-2xl font-bold" style={{ color: colors.success }}>{suggestions.filter(s => s.status === 'converted').length}</div>
            <div className="text-sm text-gray-400">Converted</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ background: colors.card, borderColor: colors.border }}>
            <div className="text-2xl font-bold" style={{ color: colors.gold }}>
              {Math.round((suggestions.filter(s => s.status === 'converted').length / Math.max(suggestions.length, 1)) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Conversion Rate</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key ? colors.accent : 'transparent',
                color: activeTab === tab.key ? colors.bg : colors.silver,
                border: `1px solid ${activeTab === tab.key ? colors.accent : colors.border}`
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <div className="rounded-xl border p-12 text-center" style={{ background: colors.card, borderColor: colors.border }}>
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No suggestions in this category</p>
            </div>
          ) : (
            filteredSuggestions.map(suggestion => {
              const zoneStyle = getZoneColor(suggestion.suggestedZone);
              return (
                <div
                  key={suggestion.id}
                  className="rounded-xl border p-6"
                  style={{ background: colors.card, borderColor: colors.border }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'rgba(251,191,36,0.15)', color: colors.gold }}>
                        <Lightbulb className="w-3 h-3 inline mr-1" />
                        SHIPPING INTELLIGENCE
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ background: zoneStyle.bg, color: zoneStyle.color }}
                      >
                        {getZoneIcon(suggestion.suggestedZone)}
                        {suggestion.suggestedZone}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-400">Confidence:</span>
                      <span
                        className="font-bold"
                        style={{ color: getConfidenceColor(suggestion.confidence) }}
                      >
                        {suggestion.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Supplier Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                      style={{ background: colors.accent }}
                    >
                      {suggestion.supplierName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {suggestion.supplierName}
                        <span>{suggestion.supplierFlag}</span>
                      </h3>
                      <p className="text-sm text-gray-400">{suggestion.product}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 rounded-lg" style={{ background: colors.bg }}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Route</div>
                        <div className="text-sm text-white flex items-center gap-1">
                          {suggestion.shipmentRoute}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">ETA</div>
                        <div className="text-sm text-white">
                          {new Date(suggestion.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Est. Pallets</div>
                        <div className="text-sm text-white">~{suggestion.estimatedPallets}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Source</div>
                        <div className="text-sm text-white capitalize">{suggestion.source.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4">
                    <p className="text-sm" style={{ color: colors.silver }}>
                      "{suggestion.reason}"
                    </p>
                  </div>

                  {/* Actions */}
                  {suggestion.status === 'new' && (
                    <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                      <button
                        onClick={() => openOfferModal(suggestion)}
                        className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ background: colors.accent, color: colors.bg }}
                      >
                        <Send className="w-4 h-4" />
                        Send Storage Offer
                      </button>
                      <button
                        onClick={() => archiveSuggestion(suggestion.id)}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-white/5"
                        style={{ borderColor: colors.border, color: colors.silver }}
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {suggestion.status === 'contacted' && (
                    <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: colors.border }}>
                      <MessageSquare className="w-4 h-4" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.accent }}>Offer sent - awaiting response</span>
                    </div>
                  )}

                  {suggestion.status === 'converted' && (
                    <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: colors.border }}>
                      <CheckCircle className="w-4 h-4" style={{ color: colors.success }} />
                      <span className="text-sm" style={{ color: colors.success }}>Client converted - storage contract signed!</span>
                    </div>
                  )}

                  {suggestion.status === 'archived' && (
                    <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: colors.border }}>
                      <Archive className="w-4 h-4" style={{ color: colors.silver }} />
                      <span className="text-sm text-gray-400">Archived</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Send Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-xl border" style={{ background: colors.card, borderColor: colors.border }}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
              <h3 className="text-lg font-bold text-white">Send Storage Offer to {showOfferModal.supplierName}</h3>
              <button
                onClick={() => setShowOfferModal(null)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Supplier Summary */}
            <div className="p-4 mx-5 mt-4 rounded-lg" style={{ background: colors.bg }}>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Route</span>
                  <div className="text-white font-medium">{showOfferModal.shipmentRoute}</div>
                </div>
                <div>
                  <span className="text-gray-400">ETA</span>
                  <div className="text-white font-medium">
                    {new Date(showOfferModal.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Zone</span>
                  <div className="font-medium" style={{ color: getZoneColor(showOfferModal.suggestedZone).color }}>
                    {showOfferModal.suggestedZone}
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="p-5">
              <label className="text-sm text-gray-400 mb-2 block">Your Message</label>
              <textarea
                value={offerMessage}
                onChange={e => setOfferMessage(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border outline-none resize-none"
                style={{ background: colors.bg, borderColor: colors.border, color: 'white' }}
              />
            </div>

            <div className="p-5 border-t flex gap-3" style={{ borderColor: colors.border }}>
              <button
                onClick={() => setShowOfferModal(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-white/5"
                style={{ borderColor: colors.border, color: colors.silver }}
              >
                Cancel
              </button>
              <button
                onClick={sendOffer}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: colors.accent, color: colors.bg }}
              >
                <Send className="w-4 h-4" />
                Send via Platform Inbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedSuppliersPage;