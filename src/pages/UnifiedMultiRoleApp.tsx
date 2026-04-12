import { useState } from 'react';
import {
  Globe,
  Shield,
  Building2,
  User,
  LogOut,
  DollarSign,
  Users,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Phone,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  MessageSquare,
  Send,
  Zap,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Check,
  Star,
  Crown,
  Radio,
  BarChart3,
  Activity,
  LayoutDashboard,
  Package,
  ShoppingCart,
  MapPin,
  FileText,
  CheckSquare,
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type Role = 'none' | 'superadmin' | 'seller' | 'buyer';
type SellerPage = 'dashboard' | 'inventory' | 'live-room';
type BuyerPage = 'expo-hall' | 'live-radar' | 'orders';
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

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  unit: string;
  warehouse: string;
}

interface Order {
  id: string;
  seller: string;
  product: string;
  quantity: string;
  value: number;
  status: 'pending' | 'confirmed' | 'shipped';
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

const buyerQueue: BuyerQueueItem[] = [
  { id: '1', name: 'Ahmed Al Rashid', company: 'Al Othaim Markets', country: 'Saudi Arabia', flag: '🇸🇦', matchScore: 95, matchLabel: 'High Volume Buyer', waitingTime: 5, isVIP: true },
  { id: '2', name: 'Sarah Chen', company: 'Carrefour UAE', country: 'UAE', flag: '🇦🇪', matchScore: 88, matchLabel: 'Retail Chain', waitingTime: 8 },
];

const inventoryData: InventoryItem[] = [
  { id: '1', name: 'Chocolate Wafers Premium', sku: 'OZ-CHOC-001', stock: 250, unit: 'MT', warehouse: 'Istanbul, Turkey' },
  { id: '2', name: 'Hazelnut Wafer Rolls', sku: 'OZ-HAZ-002', stock: 180, unit: 'MT', warehouse: 'Istanbul, Turkey' },
  { id: '3', name: 'Vanilla Cream Biscuits', sku: 'OZ-VAN-003', stock: 95, unit: 'MT', warehouse: 'Istanbul, Turkey' },
];

const ordersData: Order[] = [
  { id: '1', seller: 'OZMO Confectionery', product: 'Chocolate Wafers Premium', quantity: '50 MT', value: 55000, status: 'shipped' },
  { id: '2', seller: 'Almarai', product: 'Fresh Milk', quantity: '100 MT', value: 85000, status: 'confirmed' },
];

// ============================================
// HELPER COMPONENTS
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

// ============================================
// LOGIN GATEWAY
// ============================================

const LoginGateway = ({ onLogin }: { onLogin: (role: Role) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
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
    </div>
  </div>
);

// ============================================
// UNIFIED SELLER PORTAL
// ============================================

const SellerPortal = ({ onLogout }: { onLogout: () => void }) => {
  const [activePage, setActivePage] = useState<SellerPage>('dashboard');
  const [queue, setQueue] = useState(buyerQueue);
  const [currentBuyer, setCurrentBuyer] = useState<BuyerQueueItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'buyer', message: 'Hello! Interested in your chocolate wafers.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const menuItems = [
    { id: 'dashboard' as SellerPage, label: 'CRB Dashboard', icon: LayoutDashboard },
    { id: 'inventory' as SellerPage, label: 'Inventory', icon: Package },
    { id: 'live-room' as SellerPage, label: '🔴 Host Live Room', icon: Video, live: true },
  ];

  const handleAdmit = (buyer: BuyerQueueItem) => {
    setCurrentBuyer(buyer);
    setQueue(prev => prev.filter(b => b.id !== buyer.id));
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', message: `Meeting started with ${buyer.name}` }]);
  };

  const handleDecline = (buyerId: string) => {
    setQueue(prev => prev.filter(b => b.id !== buyerId));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'seller', message: newMessage }]);
    setNewMessage('');
  };

  const handleSendQuote = () => {
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'seller', message: 'QUOTE', quote: 'Chocolate Wafers | 5 Containers | $22,000 CIF' }]);
    setShowQuote(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">OZMO Confectionery</h3>
              <p className="text-slate-400 text-xs">Export Team</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.live && (
                <span className="ml-auto flex items-center gap-1">
                  <PulsingDot color="red" />
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between px-6">
          <h2 className="text-white font-bold text-lg">
            {activePage === 'dashboard' && 'CRB Dashboard'}
            {activePage === 'inventory' && 'Inventory Management'}
            {activePage === 'live-room' && '🔴 Live Deal Room'}
          </h2>
          {activePage === 'live-room' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full">
                <PulsingDot color="red" />
                <span className="text-red-400 text-sm font-semibold">LIVE</span>
              </div>
              <span className="text-slate-400 text-sm">Queue: {queue.length} waiting</span>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activePage === 'dashboard' && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-400" /></div>
                  <span className="text-slate-400 text-sm">Total Revenue</span>
                </div>
                <div className="text-2xl font-bold text-white">$124,500</div>
                <div className="text-emerald-400 text-xs mt-1">+12% this month</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg"><Users className="w-5 h-5 text-amber-400" /></div>
                  <span className="text-slate-400 text-sm">Active Leads</span>
                </div>
                <div className="text-2xl font-bold text-white">42</div>
                <div className="text-amber-400 text-xs mt-1">8 hot prospects</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg"><CheckCircle2 className="w-5 h-5 text-blue-400" /></div>
                  <span className="text-slate-400 text-sm">Deals Closed</span>
                </div>
                <div className="text-2xl font-bold text-white">18</div>
                <div className="text-blue-400 text-xs mt-1">$385K total value</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg"><Activity className="w-5 h-5 text-purple-400" /></div>
                  <span className="text-slate-400 text-sm">Avg Deal Time</span>
                </div>
                <div className="text-2xl font-bold text-white">4.2 days</div>
                <div className="text-purple-400 text-xs mt-1">Industry: 8.5 days</div>
              </div>
            </div>
          )}

          {activePage === 'inventory' && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-white font-bold">Product Inventory</h3>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-medium">
                  + Add Product
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Product</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">SKU</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Stock</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Warehouse</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item) => (
                    <tr key={item.id} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-sm">{item.sku}</td>
                      <td className="px-4 py-3 text-white">{item.stock} {item.unit}</td>
                      <td className="px-4 py-3 text-slate-400">{item.warehouse}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.stock > 150 ? 'bg-emerald-500/20 text-emerald-400' :
                          item.stock > 50 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {item.stock > 150 ? 'In Stock' : item.stock > 50 ? 'Low Stock' : 'Critical'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activePage === 'live-room' && (
            <div className="flex gap-6 h-[calc(100vh-200px)]">
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
                          {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
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
                            {'quote' in msg ? (
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
                  <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs font-semibold">{queue.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {queue.map((buyer) => (
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
                  {queue.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No buyers waiting</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// UNIFIED BUYER PORTAL
// ============================================

const BuyerPortal = ({ onLogout }: { onLogout: () => void }) => {
  const [activePage, setActivePage] = useState<BuyerPage>('expo-hall');
  const [livePhase, setLivePhase] = useState<LivePhase>('discovery');
  const [queuePosition, setQueuePosition] = useState(2);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'seller', message: 'Welcome! Thank you for joining our live session.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [chatInput, setChatInput] = useState({ port: '', volume: '', product: '' });
  const [dealAccepted, setDealAccepted] = useState(false);

  const menuItems = [
    { id: 'expo-hall' as BuyerPage, label: 'Digital Expo Hall', icon: LayoutDashboard },
    { id: 'live-radar' as BuyerPage, label: '🔴 Live Radar', icon: Radio, live: true },
    { id: 'orders' as BuyerPage, label: 'My Orders', icon: ShoppingCart },
  ];

  const handleJoinQueue = (exhibitor: LiveExhibitor) => {
    setLivePhase('waiting');
    setQueuePosition(2);
  };

  const handleSimulateAdmit = () => {
    setLivePhase('active-deal');
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', message: 'You have been admitted to the meeting!' }]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'buyer', message: newMessage }]);
    setNewMessage('');
  };

  const handleAcceptDeal = () => {
    setDealAccepted(true);
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', message: 'Deal accepted! Proforma invoice has been sent to your email.' }]);
  };

  const products = [
    { name: 'Premium Dates', emoji: '🌴', sellers: 12 },
    { name: 'Organic Honey', emoji: '🍯', sellers: 8 },
    { name: 'Arabic Coffee', emoji: '☕', sellers: 15 },
    { name: 'Dried Fruits', emoji: '🍇', sellers: 6 },
    { name: 'Dairy Products', emoji: '🥛', sellers: 18 },
    { name: 'Confectionery', emoji: '🍫', sellers: 22 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Ahmed Al Rashid</h3>
              <p className="text-slate-400 text-xs">Al Othaim Markets</p>
            </div>
          </div>
          <div className="mt-2 px-2 py-1 bg-blue-500/20 rounded text-blue-400 text-xs font-medium inline-block">Saudi Arabia</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                if (item.id === 'live-radar') setLivePhase('discovery');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.id
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.live && (
                <span className="ml-auto flex items-center gap-1">
                  <PulsingDot color="red" />
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between px-6">
          <h2 className="text-white font-bold text-lg">
            {activePage === 'expo-hall' && 'Digital Expo Hall'}
            {activePage === 'live-radar' && '🔴 Live Radar'}
            {activePage === 'orders' && 'My Orders'}
          </h2>
          {activePage === 'live-radar' && livePhase !== 'discovery' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
              <PulsingDot color="emerald" />
              <span className="text-emerald-400 text-sm font-semibold">
                {livePhase === 'waiting' ? 'IN QUEUE' : 'IN MEETING'}
              </span>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activePage === 'expo-hall' && (
            <div>
              <h3 className="text-white font-bold mb-4">Browse Categories</h3>
              <div className="grid grid-cols-3 gap-4">
                {products.map((product, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 text-center hover:border-blue-500/30 transition-all cursor-pointer">
                    <div className="text-4xl mb-3">{product.emoji}</div>
                    <h4 className="text-white font-semibold">{product.name}</h4>
                    <p className="text-slate-400 text-sm mt-1">{product.sellers} sellers</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActivePage('live-radar')}
                className="mt-6 w-full py-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl text-red-400 font-semibold hover:from-red-500/30 hover:to-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Radio className="w-5 h-5" />
                Go to Live Radar - See Who's Broadcasting NOW
              </button>
            </div>
          )}

          {activePage === 'live-radar' && (
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
                      <Clock className="w-10 h-10 text-white" />
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
                        <div>
                          <label className="text-slate-400 text-sm mb-1 block">Products of Interest</label>
                          <input
                            type="text"
                            value={chatInput.product}
                            onChange={(e) => setChatInput({ ...chatInput, product: e.target.value })}
                            placeholder="e.g., Chocolate Wafers, Biscuits"
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
                      onClick={() => setLivePhase('active-deal')}
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
                <div className="flex gap-6 h-[calc(100vh-200px)]">
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
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
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
          )}

          {activePage === 'orders' && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-white font-bold">My Orders</h3>
              </div>
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Order ID</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Seller</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Product</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Value</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData.map((order) => (
                    <tr key={order.id} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-white font-mono text-sm">{order.id}</td>
                      <td className="px-4 py-3 text-white">{order.seller}</td>
                      <td className="px-4 py-3 text-slate-400">{order.product}</td>
                      <td className="px-4 py-3 text-amber-400 font-medium">${order.value.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'shipped' ? 'bg-emerald-500/20 text-emerald-400' :
                          order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function UnifiedMultiRoleApp() {
  const [activeRole, setActiveRole] = useState<Role>('none');

  const handleLogin = (role: Role) => {
    setActiveRole(role);
  };

  const handleLogout = () => {
    setActiveRole('none');
  };

  if (activeRole === 'none') {
    return <LoginGateway onLogin={handleLogin} />;
  }

  if (activeRole === 'seller') {
    return <SellerPortal onLogout={handleLogout} />;
  }

  if (activeRole === 'buyer') {
    return <BuyerPortal onLogout={handleLogout} />;
  }

  // Super Admin - redirect to the full admin page
  if (activeRole === 'superadmin') {
    window.location.href = '/super-admin';
    return null;
  }

  return null;
}
