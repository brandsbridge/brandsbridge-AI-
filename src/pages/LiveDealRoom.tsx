import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  Send,
  Clock,
  Users,
  DollarSign,
  X,
  Check,
  ChevronRight,
  Signal,
  Volume2,
  Maximize2,
  FileText,
  Percent,
  Zap,
  Crown,
  Globe,
  Star,
  Timer,
  AlertCircle,
  TrendingUp,
  Building2,
  Flag,
  Loader2
} from 'lucide-react';
import SupplierSidebar from '../components/SupplierSidebar';
import toast from 'react-hot-toast';

// ============================================
// DATA TYPES
// ============================================

interface Buyer {
  id: string;
  companyName: string;
  country: string;
  flag: string;
  matchScore: number;
  matchLabel: string;
  waitingTime: number;
  interest: string;
  previousDeals: number;
  avgOrderValue: number;
  status: 'waiting' | 'connecting' | 'in_call';
}

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  message: string;
  timestamp: Date;
  type?: 'text' | 'quote' | 'offer';
  quoteData?: {
    product: string;
    quantity: string;
    price: string;
    validUntil: string;
  };
}

interface QuoteTemplate {
  id: string;
  name: string;
  type: 'proforma' | 'special_offer' | 'bulk_discount';
}

// ============================================
// SAMPLE DATA
// ============================================

const waitingBuyers: Buyer[] = [
  {
    id: '1',
    companyName: 'Al Meera Consumer Goods',
    country: 'Qatar',
    flag: '🇶🇦',
    matchScore: 95,
    matchLabel: 'VIP Premium Buyer',
    waitingTime: 4,
    interest: 'Premium Dates, Dairy Products',
    previousDeals: 12,
    avgOrderValue: 65000,
    status: 'waiting'
  },
  {
    id: '2',
    companyName: 'Baladna Food Industries',
    country: 'Qatar',
    flag: '🇶🇦',
    matchScore: 88,
    matchLabel: 'Dairy & Beverages',
    waitingTime: 7,
    interest: 'Dairy Products, Juices',
    previousDeals: 28,
    avgOrderValue: 186000,
    status: 'waiting'
  },
  {
    id: '3',
    companyName: 'Gulf Food Industries',
    country: 'Kuwait',
    flag: '🇰🇼',
    matchScore: 82,
    matchLabel: 'Confectionery Buyer',
    waitingTime: 12,
    interest: 'Chocolate, Snacks',
    previousDeals: 15,
    avgOrderValue: 38000,
    status: 'waiting'
  }
];

const quoteTemplates: QuoteTemplate[] = [
  { id: '1', name: 'Proforma Invoice', type: 'proforma' },
  { id: '2', name: 'Special Price Offer', type: 'special_offer' },
  { id: '3', name: 'Bulk Discount Quote', type: 'bulk_discount' }
];

// ============================================
// HELPER COMPONENTS
// ============================================

const PulsingDot = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
  </span>
);

const MatchScoreBadge = ({ score }: { score: number }) => {
  const color = score >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                score >= 80 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold border ${color}`}>
      {score}% Match
    </span>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function LiveDealRoom() {
  const navigate = useNavigate();

  // Live Session State
  const [isLive, setIsLive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [endSessionResult, setEndSessionResult] = useState<'deal_closed' | 'follow_up' | 'not_interested' | null>(null);
  const [dealValue, setDealValue] = useState('');
  const [isProcessingEnd, setIsProcessingEnd] = useState(false);

  // Session State
  const [sessionTime, setSessionTime] = useState(75 * 60 + 30); // 01:15:30 in seconds
  const [buyersClosedToday, setBuyersClosedToday] = useState(3);
  const [buyersWaiting, setBuyersWaiting] = useState(5);

  // Video State
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'buyer',
      message: "Hello! We are Al Meera, Qatar's leading retailer. We are interested in your dairy products for our 500+ stores across Qatar.",
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    },
    {
      id: '2',
      sender: 'seller',
      message: "Welcome Al Meera! Thank you for joining. We can offer premium dairy products with full Halal certification and CIF Doha pricing.",
      timestamp: new Date(Date.now() - 90000),
      type: 'text'
    },
    {
      id: '3',
      sender: 'buyer',
      message: "Perfect. We are looking for 40FT container monthly. What is your best pricing for CIF Hamad Port?",
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quote Widget State
  const [showQuoteWidget, setShowQuoteWidget] = useState(false);
  const [selectedQuoteType, setSelectedQuoteType] = useState<string>('');
  const [quoteForm, setQuoteForm] = useState({
    product: '',
    quantity: '',
    unit: 'MT',
    price: '',
    currency: 'USD',
    validity: '7 days'
  });

  // 3PL Invite State
  const [show3PLInviteModal, setShow3PLInviteModal] = useState(false);

  // 3PL Companies Data
  const threePLProviders = [
    { id: '3pl-001', name: 'Gulf Cold Chain Co.', flag: '🇦🇪', city: 'Dubai', services: ['Frozen', 'Chilled', 'Ambient'], available: 760, reliability: 96 },
    { id: '3pl-002', name: 'Qatar Cool Logistics', flag: '🇶🇦', city: 'Doha', services: ['Frozen', 'Chilled', 'Controlled'], available: 420, reliability: 94 },
    { id: '3pl-003', name: 'KSA Cold Storage', flag: '🇸🇦', city: 'Riyadh', services: ['Frozen', 'Ambient', 'CrossDock'], available: 1100, reliability: 93 },
  ];

  // Queue State
  const [queue, setQueue] = useState<Buyer[]>(waitingBuyers);
  const [currentBuyer, setCurrentBuyer] = useState<Buyer>({
    id: 'current',
    companyName: 'Qatar National Import & Export',
    country: 'Qatar',
    flag: '🇶🇦',
    matchScore: 92,
    matchLabel: 'Premium Buyer',
    waitingTime: 0,
    interest: 'FMCG Products, Confectionery',
    previousDeals: 18,
    avgOrderValue: 125000,
    status: 'in_call'
  });

  // Quote Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [sentQuotes, setSentQuotes] = useState<ChatMessage[]>([]);

  // Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Go Live countdown
  const handleGoLive = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLive(true);
          toast.success(`You are live! ${buyersWaiting + 3} buyers are waiting`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End Session
  const handleEndSession = () => {
    setShowEndSessionModal(true);
  };

  const confirmEndSession = () => {
    setIsProcessingEnd(true);

    setTimeout(() => {
      setIsLive(false);
      setShowEndSessionModal(false);
      setCurrentBuyer(waitingBuyers[0]);
      setQueue(waitingBuyers.slice(1));

      if (endSessionResult === 'deal_closed') {
        const value = parseInt(dealValue) || 0;
        setBuyersClosedToday(prev => prev + 1);
        toast.success(`Deal recorded! $${value.toLocaleString()} added to pipeline`);
        navigate('/crm');
      } else if (endSessionResult === 'follow_up') {
        toast.success('Follow-up scheduled in CRM');
        navigate('/crm');
      } else {
        toast.success('Session ended');
      }

      setEndSessionResult(null);
      setDealValue('');
      setIsProcessingEnd(false);
    }, 1500);
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'seller',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  // Send quote
  const handleSendQuote = () => {
    if (!quoteForm.product || !quoteForm.quantity || !quoteForm.price) return;

    const quoteMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'seller',
      message: `Sent ${selectedQuoteType === 'proforma' ? 'Proforma Invoice' : selectedQuoteType === 'special_offer' ? 'Special Price Offer' : 'Bulk Discount Quote'}`,
      timestamp: new Date(),
      type: 'quote',
      quoteData: {
        product: quoteForm.product,
        quantity: `${quoteForm.quantity} ${quoteForm.unit}`,
        price: `${quoteForm.currency} ${quoteForm.price}`,
        validUntil: quoteForm.validity
      }
    };
    setSentQuotes(prev => [...prev, quoteMsg]);
    setChatMessages(prev => [...prev, quoteMsg]);
    setShowQuoteWidget(false);
    setQuoteForm({ product: '', quantity: '', unit: 'MT', price: '', currency: 'USD', validity: '7 days' });
  };

  // Admit buyer
  const handleAdmitBuyer = (buyer: Buyer) => {
    setCurrentBuyer(buyer);
    setQueue(prev => prev.filter(b => b.id !== buyer.id));
    setBuyersWaiting(prev => prev - 1);

    // Add system message
    const sysMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'system',
      message: `Meeting started with ${buyer.companyName}`,
      timestamp: new Date(),
      type: 'text'
    };
    setChatMessages(prev => [...prev, sysMsg]);
  };

  // Decline buyer
  const handleDeclineBuyer = (buyer: Buyer) => {
    setQueue(prev => prev.filter(b => b.id !== buyer.id));
    setBuyersWaiting(prev => prev - 1);

    const sysMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'system',
      message: `${buyer.companyName} was declined and removed from queue`,
      timestamp: new Date(),
      type: 'text'
    };
    setChatMessages(prev => [...prev, sysMsg]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Unified Supplier Sidebar */}
      <SupplierSidebar activePage="live-deal-room" />

      {/* Main Content */}
      <div className="flex-1">
        {/* ============================================ */}
        {/* TOP ACTION BAR */}
        {/* ============================================ */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Live Status */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {isLive ? (
                  <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/30">
                    <PulsingDot />
                    <span className="text-red-400 font-bold text-lg tracking-wider">LIVE NOW</span>
                  </div>
                ) : (
                  <button
                    onClick={handleGoLive}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-500/30 transition-all font-bold"
                  >
                    <Video className="w-4 h-4" />
                    GO LIVE
                  </button>
                )}
                {isLive && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Timer className="w-4 h-4" />
                    <span className="font-mono text-lg text-white">{formatTime(sessionTime)}</span>
                  </div>
                )}
              </div>

              {/* Connection Quality */}
              <div className="flex items-center gap-2 text-emerald-400">
                <Signal className="w-4 h-4" />
                <span className="text-xs font-medium">EXCELLENT</span>
              </div>
            </div>

            {/* Center: Stats */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                <Users className="w-5 h-5 text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">{buyersWaiting}</span>
                  <span className="text-xs text-slate-400">Buyers Waiting</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-emerald-400">{buyersClosedToday}</span>
                  <span className="text-xs text-emerald-400/70">Deals Closed Today</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-amber-400">$47,500</span>
                  <span className="text-xs text-amber-400/70">Session Value</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Invite 3PL Button */}
              <button
                onClick={() => setShow3PLInviteModal(true)}
                className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-4 py-2.5 rounded-lg border border-cyan-500/30 transition-all font-semibold"
              >
                <Building2 className="w-4 h-4" />
                + Invite Storage Partner
              </button>
              {isLive && (
                <button
                  onClick={handleEndSession}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-5 py-2.5 rounded-lg border border-red-500/30 transition-all font-semibold"
                >
                  <Phone className="w-4 h-4 rotate-[135deg]" />
                  End Live Session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* ============================================ */}
        {/* LEFT: DEAL ROOM */}
        {/* ============================================ */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Video Section */}
          <div className="flex-1 bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Video Header */}
              <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <span className="text-lg">{currentBuyer.flag}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      {currentBuyer.companyName}
                      <MatchScoreBadge score={currentBuyer.matchScore} />
                    </h3>
                    <p className="text-slate-400 text-sm">{currentBuyer.interest}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">Video Call Active</span>
                </div>
              </div>

              {/* Video Area */}
              <div className="flex-1 relative bg-gradient-to-br from-slate-800 to-slate-900">
                {/* Main Video (Buyer - Simulated) */}
                <div className="absolute inset-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-1">{currentBuyer.companyName}</h3>
                    <p className="text-slate-400">{currentBuyer.flag} {currentBuyer.country}</p>
                    <div className="mt-4 flex items-center gap-4 justify-center text-sm">
                      <span className="text-slate-500">Prev. Deals: <span className="text-white">{currentBuyer.previousDeals}</span></span>
                      <span className="text-slate-500">Avg Order: <span className="text-amber-400">${currentBuyer.avgOrderValue.toLocaleString()}</span></span>
                    </div>
                  </div>
                </div>

                {/* Self View (Small) */}
                <div className="absolute bottom-4 right-4 w-48 h-32 bg-gradient-to-br from-amber-900/50 to-amber-800/50 rounded-lg border-2 border-amber-500/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">Y</span>
                    </div>
                    <span className="text-amber-300 text-xs font-medium">You (Seller)</span>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-full border border-slate-700/50">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-3 rounded-full transition-all ${isMicOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-3 rounded-full transition-all ${isVideoOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`p-3 rounded-full transition-all ${isSpeakerOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-500/20 text-red-400'}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div className="w-px h-8 bg-slate-600 mx-2"></div>
                  <button className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat + Quote Section */}
          <div className="h-80 flex gap-4">
            {/* Chat */}
            <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-semibold">Live Negotiation Chat</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'seller' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                    {msg.sender === 'system' ? (
                      <div className="bg-slate-700/30 text-slate-400 text-xs px-4 py-2 rounded-full">
                        {msg.message}
                      </div>
                    ) : (
                      <div className={`max-w-[75%] ${msg.sender === 'seller' ? 'order-2' : ''}`}>
                        <div className={`rounded-2xl px-4 py-3 ${msg.sender === 'seller' ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' : 'bg-slate-700/80 text-white'}`}>
                          {msg.type === 'quote' && msg.quoteData ? (
                            <div>
                              <p className="text-sm mb-2 opacity-90">{msg.message}</p>
                              <div className="bg-black/20 rounded-lg p-3 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Product:</span>
                                  <span className="font-semibold">{msg.quoteData.product}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span>Quantity:</span>
                                  <span className="font-semibold">{msg.quoteData.quantity}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span>Price:</span>
                                  <span className="font-semibold text-emerald-300">{msg.quoteData.price}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span>Valid:</span>
                                  <span className="font-semibold">{msg.quoteData.validUntil}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{msg.message}</p>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 px-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-700/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <button
                    onClick={() => setShowQuoteWidget(!showQuoteWidget)}
                    className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg border border-amber-500/30 transition-all"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-semibold transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quote Widget */}
            {showQuoteWidget && (
              <div className="w-80 bg-slate-800/50 rounded-xl border border-amber-500/30 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-b border-amber-500/30 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-white font-semibold">Instant Quote</h3>
                </div>

                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {quoteTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedQuoteType(template.type)}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          selectedQuoteType === template.type
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {template.type === 'proforma' && <FileText className="w-4 h-4" />}
                          {template.type === 'special_offer' && <Percent className="w-4 h-4" />}
                          {template.type === 'bulk_discount' && <TrendingUp className="w-4 h-4" />}
                          <span className="text-xs font-medium">{template.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedQuoteType && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Product</label>
                        <input
                          type="text"
                          value={quoteForm.product}
                          onChange={(e) => setQuoteForm({ ...quoteForm, product: e.target.value })}
                          placeholder="e.g., Premium Medjool Dates"
                          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Quantity</label>
                          <input
                            type="text"
                            value={quoteForm.quantity}
                            onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                            placeholder="20"
                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Unit</label>
                          <select
                            value={quoteForm.unit}
                            onChange={(e) => setQuoteForm({ ...quoteForm, unit: e.target.value })}
                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
                          >
                            <option value="MT">MT</option>
                            <option value="KG">KG</option>
                            <option value="PCS">PCS</option>
                            <option value="CTN">CTN</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Price</label>
                          <input
                            type="text"
                            value={quoteForm.price}
                            onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                            placeholder="2,450"
                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Currency</label>
                          <select
                            value={quoteForm.currency}
                            onChange={(e) => setQuoteForm({ ...quoteForm, currency: e.target.value })}
                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="AED">AED</option>
                            <option value="SAR">SAR</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleSendQuote}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Quote
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* RIGHT: SMART QUEUE */}
        {/* ============================================ */}
        <div className="w-96 bg-slate-900/50 border-l border-slate-800/50 flex flex-col">
          {/* Queue Header */}
          <div className="px-4 py-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="text-white font-bold text-lg">Buyer Queue</h2>
              </div>
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
                {queue.length} Waiting
              </span>
            </div>
            <p className="text-slate-400 text-sm">Requests to Join Your Live Session</p>
          </div>

          {/* Queue List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {queue.map((buyer, index) => (
              <div
                key={buyer.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-amber-500/30 transition-all"
              >
                {/* Buyer Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-2xl">
                        {buyer.flag}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        {buyer.companyName}
                        <Flag className="w-3 h-3 text-slate-400" />
                      </h4>
                      <p className="text-slate-400 text-sm">{buyer.country}</p>
                    </div>
                  </div>
                  <MatchScoreBadge score={buyer.matchScore} />
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span className="text-slate-400">Interest:</span>
                    <span className="text-white">{buyer.interest}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span className="text-slate-400">Avg Order:</span>
                    <span className="text-emerald-400 font-medium">${buyer.avgOrderValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-3 h-3 text-blue-400" />
                    <span className="text-slate-400">Prev Deals:</span>
                    <span className="text-white">{buyer.previousDeals}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span className="text-slate-400">Waiting:</span>
                    <span className="text-amber-400 font-medium">{buyer.waitingTime} mins</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAdmitBuyer(buyer)}
                    className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border border-emerald-500/30"
                  >
                    <Check className="w-4 h-4" />
                    Admit
                  </button>
                  <button
                    onClick={() => handleDeclineBuyer(buyer)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border border-red-500/30"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))}

            {queue.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No buyers waiting</p>
                <p className="text-slate-500 text-sm">New requests will appear here</p>
              </div>
            )}
          </div>

          {/* Queue Footer */}
          <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-lg p-3 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-semibold text-sm">AI Queue Tip</span>
              </div>
              <p className="text-slate-300 text-sm">
                Al Othaim Group (95% match) has been waiting 4+ mins. Consider prioritizing high-value buyers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 3PL INVITE MODAL */}
      {/* ============================================ */}
      {show3PLInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Invite Storage Partner</h3>
                    <p className="text-sm text-slate-400">Add a 3PL company to finalize storage terms</p>
                  </div>
                </div>
                <button
                  onClick={() => setShow3PLInviteModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Current Deal Info */}
            <div className="p-4 mx-4 mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-sm text-slate-300">
                You're negotiating with <span className="text-amber-400 font-semibold">{currentBuyer.companyName}</span> for dairy products. Add a storage partner to discuss warehousing and fulfillment.
              </p>
            </div>

            {/* 3PL Providers List */}
            <div className="p-4 space-y-3">
              <h4 className="text-sm font-semibold text-slate-300">Available 3PL Providers</h4>
              {threePLProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-xl">
                        {provider.flag}
                      </div>
                      <div>
                        <h5 className="text-white font-semibold">{provider.name}</h5>
                        <p className="text-sm text-slate-400">{provider.city} • {provider.reliability}% AI Reliability</p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {provider.services.map((service) => (
                      <span key={service} className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-400">Available Space:</span>
                    <span className="text-cyan-400 font-semibold">{provider.available} pallets</span>
                  </div>

                  {/* Invite Button */}
                  <button
                    onClick={() => {
                      setShow3PLInviteModal(false);
                      alert(`${provider.name} has been invited to the deal room! They will receive a notification to join.`);
                    }}
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Invite to Deal Room
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50">
              <button
                onClick={() => setShow3PLInviteModal(false)}
                className="w-full py-2.5 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* QUOTE SENT TOAST */}
      {/* ============================================ */}
      {sentQuotes.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-emerald-500/30 p-4 shadow-2xl shadow-emerald-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-emerald-400 font-semibold">Quote Sent Successfully</span>
          </div>
          <p className="text-slate-400 text-sm">{currentBuyer.companyName} received your quote via chat</p>
        </div>
      )}

      {/* ============================================ */}
      {/* GO LIVE COUNTDOWN OVERLAY */}
      {/* ============================================ */}
      {countdown > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-6xl font-bold text-white">{countdown}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Going Live...</h2>
            <p className="text-slate-400">Buyers are joining your session</p>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* LIVE INDICATOR */}
      {/* ============================================ */}
      {isLive && countdown === 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-red-500/50">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* END SESSION MODAL */}
      {/* ============================================ */}
      {showEndSessionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">End Session with {currentBuyer.companyName}?</h3>
              <button onClick={() => setShowEndSessionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {isProcessingEnd ? (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Recording session results...</p>
              </div>
            ) : (
              <>
                <p className="text-slate-400 mb-4">Did you close a deal?</p>
                <div className="space-y-3 mb-6">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    endSessionResult === 'deal_closed' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="result"
                      checked={endSessionResult === 'deal_closed'}
                      onChange={() => setEndSessionResult('deal_closed')}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <div className="flex-1">
                      <span className="text-white font-medium">Yes, deal closed</span>
                      {endSessionResult === 'deal_closed' && (
                        <div className="mt-2">
                          <input
                            type="number"
                            placeholder="Enter deal value ($)"
                            value={dealValue}
                            onChange={(e) => setDealValue(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    endSessionResult === 'follow_up' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="result"
                      checked={endSessionResult === 'follow_up'}
                      onChange={() => setEndSessionResult('follow_up')}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-white font-medium">No deal yet — schedule follow-up</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    endSessionResult === 'not_interested' ? 'bg-slate-500/10 border-slate-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="result"
                      checked={endSessionResult === 'not_interested'}
                      onChange={() => setEndSessionResult('not_interested')}
                      className="w-4 h-4 accent-slate-500"
                    />
                    <span className="text-white font-medium">Not interested</span>
                  </label>
                </div>
                <button
                  onClick={confirmEndSession}
                  disabled={!endSessionResult}
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm & End Session
                </button>
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
