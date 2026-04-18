import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Truck, Clock, Package, Ship, Anchor,
  FileText, Download, MessageSquare, AlertTriangle, CheckCircle2,
  Thermometer, Navigation, Loader2, ChevronRight, X, Send
} from 'lucide-react';
import { useBuyer } from '../context/BuyerContext';
import toast from 'react-hot-toast';

const BuyerShipmentDetailPage = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useBuyer();

  const [activeTimelineStep, setActiveTimelineStep] = useState<number | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  const order = getOrderById(shipmentId || '');

  useEffect(() => {
    if (!order) {
      toast.error('Shipment not found');
      navigate('/buyer/orders');
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'at_sea': return 'bg-cyan-500/20 text-cyan-400';
      case 'customs': return 'bg-purple-500/20 text-purple-400';
      case 'delivered': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle2;
      case 'at_sea': return Ship;
      case 'customs': return FileText;
      case 'delivered': return Package;
      default: return Package;
    }
  };

  const documents = [
    { name: 'Commercial Invoice', file: 'INV-2025-0891.pdf', icon: '📄' },
    { name: 'Packing List', file: 'PL-2025-0891.pdf', icon: '📋' },
    { name: 'Bill of Lading', file: 'BL-2025-0891.pdf', icon: '📜' },
    { name: 'Certificate of Origin', file: 'CO-2025-0891.pdf', icon: '🏛️' },
  ];

  const alerts = [
    { status: 'success', message: 'All temperature logs normal' },
    { status: 'success', message: 'On schedule for delivery' },
  ];

  const handleDownload = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
  };

  const handleMessageSupplier = () => {
    toast.success('Message sent to supplier!');
    setShowMessageModal(false);
    setMessageText('');
  };

  const handleContactFreighter = () => {
    toast.success('Connecting to freight forwarder...');
  };

  const handleMarkReceived = () => {
    toast.success('Order marked as received!');
  };

  // Calculate current progress
  const currentStepIndex = order.timeline.findIndex(step => !step.completed);

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Header */}
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/buyer/orders')}
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-white">{order.product}</h1>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                  <span>{order.supplierFlag} {order.supplier}</span>
                  <span>•</span>
                  <span>ETA: {order.eta}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message Supplier
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Shipment Timeline */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#D4AF37]" />
            Shipment Timeline
          </h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-500 rounded-full transition-all"
                style={{ width: `${(currentStepIndex / (order.timeline.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {order.timeline.map((step, index) => {
                const Icon = getStatusIcon(step.status.toLowerCase().replace(' ', '_'));
                const isCompleted = step.completed;
                const isCurrent = index === currentStepIndex;
                const isClickable = isCompleted || isCurrent;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => setActiveTimelineStep(isClickable ? index : null)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-[#D4AF37] text-black animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center max-w-[80px] ${
                      isCompleted ? 'text-emerald-400' : isCurrent ? 'text-[#D4AF37]' : 'text-slate-500'
                    }`}>
                      {step.status}
                    </div>
                    <div className="text-[10px] text-slate-500">{step.date}</div>

                    {/* Tooltip on hover */}
                    {isClickable && (
                      <div className="absolute top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 whitespace-nowrap z-10">
                        Click for details
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Details */}
          {activeTimelineStep !== null && (
            <div className="mt-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{order.timeline[activeTimelineStep].status}</h3>
                <span className="text-sm text-slate-400">{order.timeline[activeTimelineStep].date}</span>
              </div>
              <p className="text-sm text-slate-400">
                {order.timeline[activeTimelineStep].completed
                  ? 'This step has been completed successfully.'
                  : 'This step is currently in progress.'}
              </p>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Ship className="w-5 h-5 text-cyan-400" />
            Ship Location
          </h2>

          <div className="relative h-48 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#60A5FA" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
              </svg>
            </div>

            {/* Origin Point */}
            <div className="absolute top-8 left-[15%] flex flex-col items-center">
              <MapPin className="w-6 h-6 text-emerald-500" />
              <span className="text-xs text-slate-400 mt-1 bg-slate-800 px-2 py-0.5 rounded">{order.origin}</span>
            </div>

            {/* Destination Point */}
            <div className="absolute top-12 right-[15%] flex flex-col items-center">
              <MapPin className="w-6 h-6 text-blue-500" />
              <span className="text-xs text-slate-400 mt-1 bg-slate-800 px-2 py-0.5 rounded">{order.destination}</span>
            </div>

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 15% 32% Q 50% 20% 85% 48%"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>

            {/* Ship (animated) */}
            <div className="absolute top-[35%] left-[45%] animate-bounce">
              <Ship className="w-8 h-8 text-[#D4AF37]" />
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-3 right-3 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              At Sea
            </div>
          </div>
        </div>

        {/* Shipment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Shipment Details */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Shipment Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Container</span>
                <span className="text-white font-medium">{order.container}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BL Number</span>
                <span className="text-white font-mono text-sm">BL-2025-0891</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity</span>
                <span className="text-white font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Value</span>
                <span className="text-emerald-400 font-bold">${order.value.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Temperature & Conditions */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Conditions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-400">Temperature</span>
                </div>
                <span className="text-white font-medium">4°C maintained ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">Humidity</span>
                </div>
                <span className="text-white font-medium">65% controlled</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-slate-400">ETA</span>
                </div>
                <span className="text-white font-medium">{order.eta}</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Status Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-400 text-sm">{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc, index) => (
              <button
                key={index}
                onClick={() => handleDownload(doc.name)}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition-colors text-left group"
              >
                <div className="text-3xl mb-2">{doc.icon}</div>
                <div className="text-white font-medium text-sm">{doc.name}</div>
                <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-400">{doc.file}</div>
                <div className="flex items-center gap-1 mt-2 text-[#D4AF37] text-xs">
                  <Download className="w-3 h-3" />
                  Download
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowMessageModal(true)}
              className="py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Message Supplier
            </button>
            <button
              onClick={handleContactFreighter}
              className="py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Contact Freighter
            </button>
            <button className="py-3 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Raise Dispute
            </button>
            <button
              onClick={handleMarkReceived}
              className="py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Received
            </button>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Message {order.supplier}</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3 mb-4 flex items-center gap-2">
              <span className="text-2xl">{order.supplierFlag}</span>
              <span className="text-white font-medium">{order.supplier}</span>
            </div>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] resize-none mb-4"
            />

            <button
              onClick={handleMessageSupplier}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerShipmentDetailPage;