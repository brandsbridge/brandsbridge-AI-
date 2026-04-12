import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  User,
  Mail,
  CreditCard,
  Settings,
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
  Image,
  Upload,
  Save,
  Plus,
  Pause,
  Play,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  X,
  Check,
  Shield,
  BarChart3,
  Target,
  Globe,
  DollarSign,
  Clock,
  Send,
  Lock,
  EyeOff,
  Star,
  Zap,
  FileText,
  ArrowUpRight,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  ShoppingBag,
  File,
  Download,
  RefreshCw,
  TrendingDown,
  PieChart,
  Activity,
  FolderOpen,
  ExternalLink,
  LogOut,
  Video,
  Radio,
  Crown,
  Mic,
  MicOff,
  ShoppingCart,
  Clock as ClockIcon,
  CheckSquare,
  Sparkles,
  Package,
  LayoutDashboard as DashboardIcon,
  FileCheck
} from 'lucide-react';
import {
  sampleDashboardData,
  sampleCampaigns,
  samplePayments,
  campaignPricing,
  categories,
  countries,
  type Campaign,
  type CampaignType,
  type CampaignStatus,
  type PaymentRecord
} from '../data/mockData';

// ============================================
// TYPES
// ============================================

type Role = 'none' | 'superadmin' | 'seller' | 'buyer';
type TabType = 'overview' | 'profile' | 'campaigns' | 'email-campaigns' | 'payments' | 'settings' | 'live-deal';
type LivePhase = 'discovery' | 'waiting' | 'active-deal';

interface BuyerQueueItem {
  id: string;
  name: string;
  company: string;
  country: string;
  flag: string;
  matchScore: number;
  matchLabel: string;
  waitingTime: number;
  isVIP?: boolean;
}

interface LiveExhibitor {
  id: string;
  name: string;
  flag: string;
  category: string;
  match: number;
  deals: number;
  isLive: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  message: string;
  quote?: string;
}

// ============================================
// MOCK DATA
// ============================================

const liveExhibitors: LiveExhibitor[] = [
  { id: '1', name: 'OZMO Confectionery', flag: '🇹🇷', category: 'Confectionery', match: 95, deals: 5, isLive: true },
  { id: '2', name: 'Almarai', flag: '🇸🇦', category: 'Dairy & Poultry', match: 88, deals: 12, isLive: true },
  { id: '3', name: 'BPI Dairy', flag: '🇵🇭', category: 'Dairy Products', match: 72, deals: 3, isLive: true },
];

const initialBuyerQueue: BuyerQueueItem[] = [
  { id: '1', name: 'Ahmed Al Rashid', company: 'Al Othaim Markets', country: 'Saudi Arabia', flag: '🇸🇦', matchScore: 95, matchLabel: 'High Volume Buyer', waitingTime: 5, isVIP: true },
  { id: '2', name: 'Sarah Chen', company: 'Carrefour UAE', country: 'UAE', flag: '🇦🇪', matchScore: 88, matchLabel: 'Retail Chain', waitingTime: 8 },
];

// ============================================
// LOGIN GATEWAY COMPONENT
// ============================================

const LoginGateway = ({ onLogin }: { onLogin: (role: Role) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
    <div className="w-full max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/30 mb-6">
          <Globe className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Brands Bridge <span className="text-amber-400">AI</span>
        </h1>
        <p className="text-slate-400 text-lg">Global B2B Food & FMCG Trade Platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Super Admin */}
        <button
          onClick={() => onLogin('superadmin')}
          className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Super Admin</h3>
          <p className="text-slate-400 text-sm mb-4">Khaled (Platform Owner)</p>
          <div className="space-y-2 text-left bg-slate-900/50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Revenue:</span>
              <span className="text-amber-400 font-semibold">$1.2M MRR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Exhibitors:</span>
              <span className="text-white font-semibold">2,450</span>
            </div>
          </div>
          <div className="mt-4 text-amber-400 text-sm font-medium group-hover:underline">
            Access Command Center →
          </div>
        </button>

        {/* Seller */}
        <button
          onClick={() => onLogin('seller')}
          className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Seller Portal</h3>
          <p className="text-slate-400 text-sm mb-4">OZMO Confectionery</p>
          <div className="space-y-2 text-left bg-slate-900/50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Active Queue:</span>
              <span className="text-emerald-400 font-semibold">2 Buyers</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Top Match:</span>
              <span className="text-white font-semibold">95%</span>
            </div>
          </div>
          <div className="mt-4 text-emerald-400 text-sm font-medium group-hover:underline">
            Enter Deal Room →
          </div>
        </button>

        {/* Buyer */}
        <button
          onClick={() => onLogin('buyer')}
          className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Buyer Portal</h3>
          <p className="text-slate-400 text-sm mb-4">Ahmed (Al Othaim)</p>
          <div className="space-y-2 text-left bg-slate-900/50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Country:</span>
              <span className="text-white font-semibold">Saudi Arabia</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Role:</span>
              <span className="text-blue-400 font-semibold">Purchasing Mgr</span>
            </div>
          </div>
          <div className="mt-4 text-blue-400 text-sm font-medium group-hover:underline">
            Enter Expo Hall →
          </div>
        </button>
      </div>

      <div className="mt-12 grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-amber-400">2,450+</div>
          <div className="text-slate-400 text-sm">Exhibitors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-400">180+</div>
          <div className="text-slate-400 text-sm">Countries</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">$2.4B</div>
          <div className="text-slate-400 text-sm">Trade Volume</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">24/7</div>
          <div className="text-slate-400 text-sm">AI Support</div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// LIVE DEAL ROOM TAB COMPONENT
// ============================================

const PulsingDot = ({ color = 'emerald' }: { color?: string }) => (
  <span className="relative flex h-2.5 w-2.5">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${color}-500`}></span>
  </span>
);

const MatchBadge = ({ score }: { score: number }) => {
  const color = score >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                score >= 80 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${color}`}>
      {score}%
    </span>
  );
};

const LiveDealTab = ({ role, onLogout }: { role: Role; onLogout: () => void }) => {
  const [livePhase, setLivePhase] = useState<LivePhase>('discovery');
  const [queuePosition, setQueuePosition] = useState(2);
  const [buyerQueue, setBuyerQueue] = useState(initialBuyerQueue);
  const [currentBuyer, setCurrentBuyer] = useState<BuyerQueueItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'buyer', message: 'Hello! Interested in your chocolate wafers.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [dealAccepted, setDealAccepted] = useState(false);
  const [chatInput, setChatInput] = useState({ port: '', volume: '', product: '' });

  const handleJoinQueue = (exhibitor: LiveExhibitor) => {
    setLivePhase('waiting');
    setQueuePosition(2);
  };

  const handleSimulateAdmit = () => {
    setLivePhase('active-deal');
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', message: 'You have been admitted to the meeting!' }]);
  };

  const handleAdmit = (buyer: BuyerQueueItem) => {
    setCurrentBuyer(buyer);
    setBuyerQueue(prev => prev.filter(b => b.id !== buyer.id));
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', message: `Meeting started with ${buyer.name}` }]);
  };

  const handleDecline = (buyerId: string) => {
    setBuyerQueue(prev => prev.filter(b => b.id !== buyerId));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: role === 'buyer' ? 'buyer' : 'seller', message: newMessage }]);
    setNewMessage('');
  };

  const handleSendQuote = () => {
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'seller', message: 'QUOTE', quote: 'Chocolate Wafers | 5 Containers | $22,000 CIF' }]);
    setShowQuote(false);
  };

  const handleAcceptDeal = () => {
    setDealAccepted(true);
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', message: 'Deal accepted! Proforma invoice has been sent.' }]);
  };

  // SELLER VIEW
  if (role === 'seller') {
    return (
      <div className="flex gap-6 h-[calc(100vh-250px)]">
        {/* Video & Chat */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Video */}
          <div className="flex-1 bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden relative">
            {currentBuyer ? (
              <>
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-white text-xl font-semibold">{currentBuyer.name}</h3>
                    <p className="text-slate-400">{currentBuyer.flag} {currentBuyer.country}</p>
                    <div className="mt-4 flex items-center gap-4 justify-center">
                      <MatchBadge score={currentBuyer.matchScore} />
                      <span className="text-emerald-400 text-sm">{currentBuyer.matchLabel}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 w-48 h-32 bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 rounded-lg border-2 border-emerald-500/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">O</span>
                    </div>
                    <span className="text-emerald-300 text-xs">You (Host)</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-full">
                  <button onClick={() => setIsMicOn(!isMicOn)} className={`p-3 rounded-full ${isMicOn ? 'bg-slate-700' : 'bg-red-500/20 text-red-400'}`}>
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setIsVideoOn(!isVideoOn)} className={`p-3 rounded-full ${isVideoOn ? 'bg-slate-700' : 'bg-red-500/20 text-red-400'}`}>
                    {isVideoOn ? <Video className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                  <button className="p-3 rounded-full bg-red-500"><Phone className="w-5 h-5" /></button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select a buyer from the queue to start</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="h-64 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-semibold text-sm">Live Negotiation</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'seller' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                  {msg.sender === 'system' ? (
                    <div className="bg-slate-700/30 text-slate-400 text-xs px-3 py-1.5 rounded-full">{msg.message}</div>
                  ) : (
                    <div className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.sender === 'seller' ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' : 'bg-slate-700/80 text-white'}`}>
                      {'quote' in msg && msg.quote ? (
                        <div>
                          <p className="text-xs opacity-80 mb-1">Quote Sent:</p>
                          <div className="bg-black/20 rounded-lg p-2 text-sm">{msg.quote}</div>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.message}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-700/50 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500/50"
              />
              <button onClick={() => setShowQuote(!showQuote)} className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg"><Zap className="w-5 h-5" /></button>
              <button onClick={handleSendMessage} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-semibold"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {/* Quote Widget */}
        {showQuote && (
          <div className="w-72 bg-slate-800/50 rounded-xl border border-amber-500/30 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Instant Quote</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Product</label>
                <input type="text" defaultValue="Chocolate Wafers" className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Quantity</label>
                  <input type="text" defaultValue="5 Containers" className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Price</label>
                  <input type="text" defaultValue="$22,000 CIF" className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <button onClick={handleSendQuote} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Quote
              </button>
            </div>
          </div>
        )}

        {/* Smart Queue */}
        <div className="w-80 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-semibold text-sm">Buyer Queue</h3>
            </div>
            <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs font-semibold">{buyerQueue.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {buyerQueue.map((buyer) => (
              <div key={buyer.id} className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">{buyer.flag}</div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{buyer.name}</h4>
                    <p className="text-slate-400 text-xs">{buyer.company}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <MatchBadge score={buyer.matchScore} />
                  {buyer.isVIP && <span className="text-amber-400 text-xs font-medium">VIP</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAdmit(buyer)} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Admit</button>
                  <button onClick={() => handleDecline(buyer.id)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"><X className="w-3 h-3" /> Decline</button>
                </div>
              </div>
            ))}
            {buyerQueue.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No buyers waiting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // BUYER VIEW
  return (
    <div>
      {/* Phase 1: Discovery */}
      {livePhase === 'discovery' && (
        <div>
          <div className="bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent border border-red-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Radio className="w-8 h-8 text-red-400" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">Live Exhibitors</h2>
                <p className="text-slate-400">Join live 1-on-1 meetings with exporters</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {liveExhibitors.map((exhibitor) => (
              <div key={exhibitor.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                    {exhibitor.name[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      {exhibitor.name}
                      <span>{exhibitor.flag}</span>
                    </h4>
                    <p className="text-slate-400 text-sm">{exhibitor.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-900/50 rounded p-2 text-center">
                    <div className="text-amber-400 font-semibold">{exhibitor.match}%</div>
                    <div className="text-slate-500 text-xs">Match</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2 text-center">
                    <div className="text-emerald-400 font-semibold">{exhibitor.deals}</div>
                    <div className="text-slate-500 text-xs">Deals</div>
                  </div>
                </div>
                {exhibitor.isLive ? (
                  <button
                    onClick={() => handleJoinQueue(exhibitor)}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4" />
                    Join Queue
                  </button>
                ) : (
                  <div className="w-full py-2 bg-slate-700/50 text-slate-400 rounded-lg text-sm text-center">Offline</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Waiting Room */}
      {livePhase === 'waiting' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800/50 rounded-2xl border border-amber-500/30 p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClockIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white font-bold text-2xl mb-2">You're #{queuePosition} in line</h2>
            <p className="text-slate-400 mb-6">Waiting for OZMO Confectionery to admit you...</p>

            <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left">
              <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Pre-Chat
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Target Import Port</label>
                  <select
                    value={chatInput.port}
                    onChange={(e) => setChatInput({ ...chatInput, port: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select port...</option>
                    <option value="jeddah">Jeddah, Saudi Arabia</option>
                    <option value="dammam">Dammam, Saudi Arabia</option>
                    <option value="dubai">Dubai, UAE</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Monthly Volume Needed</label>
                  <input
                    type="text"
                    value={chatInput.volume}
                    onChange={(e) => setChatInput({ ...chatInput, volume: e.target.value })}
                    placeholder="e.g., 50 MT"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-amber-400 mb-4">
              <PulsingDot color="amber" />
              <span className="font-medium">Estimated wait: ~{queuePosition * 5} minutes</span>
            </div>

            <button
              onClick={handleSimulateAdmit}
              className="px-6 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm border border-amber-500/30"
            >
              🔧 Simulate Admitted (Demo)
            </button>

            <button onClick={() => setLivePhase('discovery')} className="block mx-auto mt-4 text-red-400 hover:text-red-300 text-sm">
              Leave Queue
            </button>
          </div>
        </div>
      )}

      {/* Phase 3: Active Deal Room */}
      {livePhase === 'active-deal' && (
        <div className="flex gap-6 h-[calc(100vh-250px)]">
          {/* Video & Chat */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Video */}
            <div className="flex-1 bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden relative">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-semibold">OZMO Confectionery</h3>
                  <p className="text-slate-400">🇹🇷 Turkey - Live Export Team</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-red-400 text-sm font-medium">LIVE NOW</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 w-48 h-32 bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-lg border-2 border-blue-500/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <span className="text-blue-300 text-xs">You (Buyer)</span>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="h-64 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-semibold text-sm">Live Negotiation</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                    {msg.sender === 'system' ? (
                      <div className="bg-slate-700/30 text-slate-400 text-xs px-3 py-1.5 rounded-full">{msg.message}</div>
                    ) : (
                      <div className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.sender === 'buyer' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-slate-700/80 text-white'}`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-700/50 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50"
                />
                <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          {/* Deal Panel */}
          <div className="w-96 flex flex-col gap-4">
            {/* Proforma Invoice */}
            <div className="bg-slate-800/50 rounded-xl border border-emerald-500/30 p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white font-bold">Proforma Invoice</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <span className="text-white font-medium">Chocolate Wafers Premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity:</span>
                  <span className="text-white font-medium">5 Containers (25 MT)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Incoterm:</span>
                  <span className="text-white font-medium">CIF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="text-white font-medium">Jeddah Port</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between">
                  <span className="text-emerald-400 font-semibold">Total Value:</span>
                  <span className="text-emerald-400 font-bold text-xl">$22,000</span>
                </div>
              </div>
              {dealAccepted ? (
                <div className="mt-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-400 font-semibold">Deal Accepted!</p>
                  <p className="text-slate-400 text-sm mt-1">Invoice sent to your email</p>
                </div>
              ) : (
                <button
                  onClick={handleAcceptDeal}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <CheckSquare className="w-5 h-5" />
                  Accept Deal - $22,000
                </button>
              )}
            </div>

            {/* Meeting Info */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <h4 className="text-white font-semibold mb-3">Meeting Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-400">Match Score:</span>
                  <span className="text-amber-400 font-medium">95%</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400">From:</span>
                  <span className="text-white">Istanbul, Turkey</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">Avg Deal:</span>
                  <span className="text-white">$45,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPANY DASHBOARD
// ============================================

const CompanyDashboard = () => {
  const [activeRole, setActiveRole] = useState<Role>('none');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignType, setCampaignType] = useState<CampaignType>('search_boost');

  const dashboardData = sampleDashboardData;
  const campaigns = sampleCampaigns;
  const payments = samplePayments;

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'campaigns', label: 'Search Campaigns', icon: Target },
    { id: 'email-campaigns', label: 'Email Campaigns', icon: Mail },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'live-deal', label: '🔴 Live Deal Room', icon: Video, live: true },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLogin = (role: Role) => {
    setActiveRole(role);
  };

  const handleLogout = () => {
    setActiveRole('none');
    setActiveTab('overview');
  };

  // Show Login Gateway if no role selected
  if (activeRole === 'none') {
    return <LoginGateway onLogin={handleLogin} />;
  }

  // Show Live Deal Room Tab
  if (activeTab === 'live-deal') {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Top Bar */}
        <div className="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">OZMO Confectionery</h3>
                  <p className="text-slate-400 text-xs">
                    {activeRole === 'seller' ? 'Export Team' : activeRole === 'buyer' ? 'Al Othaim Markets' : 'Platform Owner'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full">
                <PulsingDot color="red" />
                <span className="text-red-400 text-sm font-semibold">LIVE</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800/30 border-b border-slate-700/50">
          <div className="px-6">
            <div className="flex overflow-x-auto -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-400'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.live && <PulsingDot color="red" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <LiveDealTab role={activeRole} onLogout={handleLogout} />
        </div>
      </div>
    );
  }

  // Standard Dashboard View
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand to-luxury-chocolate text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={dashboardData.company.logo}
                alt={dashboardData.company.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold">{dashboardData.company.name}</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <span>{dashboardData.company.countryFlag}</span>
                  <span>{dashboardData.company.city}, {dashboardData.company.country}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/companies/${dashboardData.company.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Public Profile
              </Link>
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-brand font-semibold rounded-xl hover:bg-luxury-cream transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.live && <PulsingDot color="red" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <OverviewTab
            dashboardData={dashboardData}
            campaigns={campaigns}
            payments={payments}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            getStatusColor={getStatusColor}
            setActiveTab={setActiveTab}
            setCampaignType={setCampaignType}
            setShowModal={setShowCampaignModal}
          />
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <ProfileEditor dashboardData={dashboardData} />
        )}

        {/* Search Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <SearchCampaignsTab
            campaigns={campaigns}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            getStatusColor={getStatusColor}
            setShowModal={setShowCampaignModal}
            setCampaignType={setCampaignType}
          />
        )}

        {/* Email Campaigns Tab */}
        {activeTab === 'email-campaigns' && (
          <EmailCampaignsTab
            campaigns={campaigns}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            getStatusColor={getStatusColor}
            setShowModal={setShowCampaignModal}
            setCampaignType={setCampaignType}
          />
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <PaymentsTab
            payments={payments}
            formatCurrency={formatCurrency}
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsTab dashboardData={dashboardData} />
        )}
      </div>

      {/* Campaign Creation Modal */}
      {showCampaignModal && (
        <CampaignModal
          type={campaignType}
          onClose={() => setShowCampaignModal(false)}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />
      )}
    </div>
  );
};

// ============================================
// SUB-COMPONENTS (Kept from original)
// ============================================

// BadgeCheck Component
const BadgeCheck = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// Overview Tab Component
const OverviewTab = ({ dashboardData, campaigns, formatCurrency, formatNumber, getStatusColor, setActiveTab, setCampaignType, setShowModal }: any) => {
  return (
    <div className="space-y-8">
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +12%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatNumber(dashboardData.totalImpressions)}</div>
          <div className="text-sm text-slate-500">Total Impressions</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +8%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatNumber(dashboardData.totalClicks)}</div>
          <div className="text-sm text-slate-500">Profile Clicks</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +15%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{dashboardData.totalInquiries}</div>
          <div className="text-sm text-slate-500">Inquiries Received</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(dashboardData.totalValue)}</div>
          <div className="text-sm text-slate-500">Pipeline Value</div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Active Campaigns</h2>
          <button onClick={() => { setCampaignType('search_boost'); setShowModal(true); }} className="text-sm text-brand font-medium hover:underline">
            + New Campaign
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {campaigns.filter((c: any) => c.status === 'active').slice(0, 3).map((campaign: any) => (
            <div key={campaign.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{campaign.name}</div>
                    <div className="text-sm text-slate-500">{formatCurrency(campaign.weeklyBudget)}/week • {campaign.isTopTenBoost ? 'Top 10 Boost' : 'Standard'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">{formatNumber(campaign.impressions)}</div>
                    <div className="text-xs text-slate-500">Impressions</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Profile Editor Tab
const ProfileEditor = ({ dashboardData }: any) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Edit Company Profile</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
            <input type="text" defaultValue={dashboardData.company.name} className="w-full px-4 py-3 border border-slate-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
            <input type="text" defaultValue={dashboardData.company.city} className="w-full px-4 py-3 border border-slate-300 rounded-xl" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea rows={4} defaultValue="Premium chocolate and confectionery manufacturer exporting to global markets..." className="w-full px-4 py-3 border border-slate-300 rounded-xl" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 bg-brand text-white font-semibold rounded-xl">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// Search Campaigns Tab
const SearchCampaignsTab = ({ campaigns, formatCurrency, formatNumber, getStatusColor, setShowModal, setCampaignType }: any) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Search Visibility Campaigns</h1>
          <p className="text-slate-500 mt-1">Boost your company ranking in search results</p>
        </div>
        <button onClick={() => { setCampaignType('search_boost'); setShowModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-xl">
          <Plus className="w-5 h-5" />
          New Search Campaign
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Target className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Standard Boost</h3>
              <p className="text-sm text-slate-500">Improve your search ranking</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(campaignPricing.searchBoostPerWeek)}</div>
            <div className="text-slate-500">/week</div>
          </div>
          <button onClick={() => { setCampaignType('search_boost'); setShowModal(true); }} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl">Create Campaign</button>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-amber-200">
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">POPULAR</div>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Star className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Top 10 Boost</h3>
              <p className="text-sm text-slate-500">Guaranteed top 10 position</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(campaignPricing.searchBoostPerWeek * campaignPricing.top10PremiumMultiplier)}</div>
            <div className="text-slate-500">/week</div>
          </div>
          <button onClick={() => { setCampaignType('search_boost'); setShowModal(true); }} className="w-full py-3 bg-amber-600 text-white font-semibold rounded-xl">Create Campaign</button>
        </div>
      </div>
    </div>
  );
};

// Email Campaigns Tab
const EmailCampaignsTab = ({ campaigns, formatCurrency, formatNumber, getStatusColor, setShowModal, setCampaignType }: any) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email Catalog Campaigns</h1>
          <p className="text-slate-500 mt-1">Send catalogs while keeping your email private</p>
        </div>
        <button onClick={() => { setCampaignType('email_catalog'); setShowModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl">
          <Plus className="w-5 h-5" />
          New Email Campaign
        </button>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Complete Privacy Protection</h3>
            <p className="text-sm text-slate-600">Your company email is never revealed to recipients.</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Email Campaign Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(campaignPricing.emailPerThousand)}</div>
            <div className="text-sm text-slate-500">per 1,000 emails</div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl text-center border-2 border-emerald-200">
            <div className="text-3xl font-bold text-emerald-600 mb-1">1,000</div>
            <div className="text-sm text-emerald-700">minimum recipients</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(campaignPricing.emailPerThousand * 10)}</div>
            <div className="text-sm text-slate-500">for 10,000 emails</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payments Tab
const PaymentsTab = ({ payments, formatCurrency }: any) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Management</h1>
        <p className="text-slate-500 mt-1">View your payment history and manage billing</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.map((payment: any) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{payment.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{payment.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">{formatCurrency(payment.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Settings Tab
const SettingsTab = ({ dashboardData }: any) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and billing</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Subscription Plan</h2>
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900">{dashboardData.company.subscriptionPlan} Plan</div>
                  <div className="text-sm text-slate-600">Full access to all features</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">$2,400</div>
                  <div className="text-sm text-slate-500">/year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Security</h2>
            <div className="space-y-3">
              <button className="w-full py-3 text-left px-4 bg-slate-50 rounded-lg hover:bg-slate-100">
                <div className="font-medium text-slate-900">Change Password</div>
              </button>
              <button className="w-full py-3 text-left px-4 bg-slate-50 rounded-lg hover:bg-slate-100">
                <div className="font-medium text-slate-900">Two-Factor Auth</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Campaign Modal
const CampaignModal = ({ type, onClose, formatCurrency, formatNumber }: any) => {
  const [step, setStep] = useState(1);
  const isEmailCampaign = type === 'email_catalog';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEmailCampaign ? 'Create Email Campaign' : 'Create Search Campaign'}
            </h2>
            <p className="text-sm text-slate-500">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="px-6 py-3 bg-slate-50">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-colors ${s <= step ? 'bg-brand' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Name</label>
              <input type="text" placeholder="e.g., Premium Chocolate - GCC" className="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {['FMCG', 'Confectionery', 'Dairy', 'Beverages'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-brand">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-slate-600 font-medium">Back</button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="px-6 py-3 bg-brand text-white font-semibold rounded-xl">Next</button>
            ) : (
              <button onClick={onClose} className="px-6 py-3 bg-brand text-white font-semibold rounded-xl">Create Campaign</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
