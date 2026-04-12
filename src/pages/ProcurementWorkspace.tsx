import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FileText,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Send,
  Eye,
  X,
  MessageSquare,
  Globe,
  MapPin,
  DollarSign,
  ShoppingCart,
  Target,
  BarChart3,
  Sparkles,
  Briefcase,
  FileCheck,
  Ship,
  Shield,
  Zap,
  Clock3,
  Check,
  AlertCircle,
  RefreshCw,
  Building2,
  Star,
  ChevronDown,
  Paperclip,
  Upload,
  Filter,
  MoreHorizontal,
  ArrowRight,
  Cpu,
  Percent,
  PackageCheck,
  FileSpreadsheet,
  Printer,
  Wallet,
  SparklesIcon,
  Bot,
  Users,
  Calendar,
  ClipboardCheck
} from 'lucide-react';

// ============================================
// DATA TYPES
// ============================================

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  supplierCountry: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  totalValue: number;
  currency: string;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  issueDate: string;
  expectedDelivery: string;
  aiReliabilityScore: number;
}

interface Supplier {
  id: string;
  name: string;
  country: string;
  category: string;
  reliabilityScore: number;
  onTimeDelivery: number;
  qualityRating: number;
  communicationRating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'pending';
}

interface RFQItem {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  targetPrice: number;
  destination: string;
}

interface Quote {
  id: string;
  rfqId: string;
  supplierName: string;
  supplierCountry: string;
  price: number;
  currency: string;
  validUntil: string;
  leadTime: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

interface Contract {
  id: string;
  contractNumber: string;
  supplierName: string;
  value: number;
  status: 'draft' | 'pending_signature' | 'active' | 'expired';
  startDate: string;
  endDate: string;
}

interface Shipment {
  id: string;
  poNumber: string;
  supplierName: string;
  destination: string;
  freightType: 'sea' | 'air' | 'land';
  status: 'booking' | 'confirmed' | 'in_transit' | 'customs' | 'delivered';
  departureDate: string;
  eta: string;
  documents: { name: string; type: 'bl' | 'invoice' | 'certificate' | 'packing'; status: 'pending' | 'uploaded' | 'verified'; uploadedDate?: string }[];
}

interface AISuggestedSupplier {
  id: string;
  name: string;
  country: string;
  rating: number;
  reliabilityScore: number;
  minOrder: number;
  leadTime: string;
  certifications: string[];
  matchReason: string;
}

interface DocumentAlert {
  id: string;
  poNumber: string;
  supplierName: string;
  documentType: 'bl' | 'invoice' | 'packing_list' | 'certificate';
  documentName: string;
  uploadedAt: string;
  aiCheckStatus: 'pending' | 'matched' | 'mismatch';
  aiCheckDetails?: string;
}

// ============================================
// SAMPLE DATA
// ============================================

const samplePurchaseOrders: PurchaseOrder[] = [
  { id: '1', poNumber: 'PO-2024-0892', supplierName: 'Almarai Company', supplierCountry: 'Saudi Arabia', items: [{ name: 'UHT Milk 1L', quantity: 50000, unitPrice: 0.85 }], totalValue: 42500, currency: 'USD', status: 'shipped', issueDate: '2024-01-15', expectedDelivery: '2024-02-10', aiReliabilityScore: 98 },
  { id: '2', poNumber: 'PO-2024-0893', supplierName: 'Gulf Trading Co.', supplierCountry: 'UAE', items: [{ name: 'Premium Olive Oil 1L', quantity: 10000, unitPrice: 2.50 }, { name: 'Tahini Paste 1kg', quantity: 5000, unitPrice: 1.80 }], totalValue: 34000, currency: 'USD', status: 'confirmed', issueDate: '2024-01-20', expectedDelivery: '2024-02-25', aiReliabilityScore: 95 },
  { id: '3', poNumber: 'PO-2024-0894', supplierName: 'German Foods GmbH', supplierCountry: 'Germany', items: [{ name: 'Chocolate Wafer Bars 750g', quantity: 15000, unitPrice: 1.20 }], totalValue: 18000, currency: 'EUR', status: 'sent', issueDate: '2024-01-25', expectedDelivery: '2024-03-05', aiReliabilityScore: 97 },
  { id: '4', poNumber: 'PO-2024-0895', supplierName: 'Nile Foods International', supplierCountry: 'Egypt', items: [{ name: 'Tomato Paste 400g', quantity: 25000, unitPrice: 0.45 }], totalValue: 11250, currency: 'USD', status: 'draft', issueDate: '2024-01-28', expectedDelivery: '2024-03-15', aiReliabilityScore: 88 },
  { id: '5', poNumber: 'PO-2024-0889', supplierName: 'Premium Foods UK', supplierCountry: 'United Kingdom', items: [{ name: 'Organic Honey 500g', quantity: 3000, unitPrice: 3.50 }], totalValue: 10500, currency: 'GBP', status: 'delivered', issueDate: '2024-01-05', expectedDelivery: '2024-01-25', aiReliabilityScore: 92 },
];

const sampleSuppliers: Supplier[] = [
  { id: '1', name: 'Almarai Company', country: 'Saudi Arabia', category: 'Dairy & Beverages', reliabilityScore: 98, onTimeDelivery: 98, qualityRating: 4.9, communicationRating: 4.8, totalOrders: 45, totalValue: 1250000, lastOrderDate: '2024-01-15', status: 'active' },
  { id: '2', name: 'Gulf Trading Co.', country: 'UAE', category: 'Oils & Spreads', reliabilityScore: 95, onTimeDelivery: 95, qualityRating: 4.7, communicationRating: 4.6, totalOrders: 32, totalValue: 890000, lastOrderDate: '2024-01-20', status: 'active' },
  { id: '3', name: 'German Foods GmbH', country: 'Germany', category: 'Confectionery', reliabilityScore: 97, onTimeDelivery: 97, qualityRating: 4.9, communicationRating: 4.5, totalOrders: 28, totalValue: 720000, lastOrderDate: '2024-01-25', status: 'active' },
  { id: '4', name: 'Premium Foods UK', country: 'United Kingdom', category: 'Spreads & Honey', reliabilityScore: 92, onTimeDelivery: 92, qualityRating: 4.6, communicationRating: 4.4, totalOrders: 18, totalValue: 450000, lastOrderDate: '2024-01-05', status: 'active' },
  { id: '5', name: 'Nile Foods International', country: 'Egypt', category: 'Canned Foods', reliabilityScore: 88, onTimeDelivery: 85, qualityRating: 4.3, communicationRating: 4.2, totalOrders: 12, totalValue: 280000, lastOrderDate: '2024-01-28', status: 'active' },
  { id: '6', name: 'Mediterranean Foods', country: 'Turkey', category: 'Olive Products', reliabilityScore: 94, onTimeDelivery: 93, qualityRating: 4.5, communicationRating: 4.7, totalOrders: 22, totalValue: 560000, lastOrderDate: '2024-01-18', status: 'active' },
];

const sampleShipments: Shipment[] = [
  { id: '1', poNumber: 'PO-2024-0892', supplierName: 'Almarai Company', destination: 'Dubai, UAE', freightType: 'sea', status: 'in_transit', departureDate: '2024-01-28', eta: '2024-02-10', documents: [{ name: 'Bill of Lading', type: 'bl', status: 'verified', uploadedDate: '2024-01-28' }, { name: 'Commercial Invoice', type: 'invoice', status: 'verified', uploadedDate: '2024-01-28' }, { name: 'Packing List', type: 'packing', status: 'uploaded', uploadedDate: '2024-01-29' }] },
  { id: '2', poNumber: 'PO-2024-0893', supplierName: 'Gulf Trading Co.', destination: 'Riyadh, Saudi Arabia', freightType: 'land', status: 'customs', departureDate: '2024-01-22', eta: '2024-02-05', documents: [{ name: 'Bill of Lading', type: 'bl', status: 'verified', uploadedDate: '2024-01-22' }, { name: 'Certificate of Origin', type: 'certificate', status: 'uploaded', uploadedDate: '2024-01-24' }] },
  { id: '3', poNumber: 'PO-2024-0889', supplierName: 'Premium Foods UK', destination: 'Istanbul, Turkey', freightType: 'air', status: 'delivered', departureDate: '2024-01-20', eta: '2024-01-25', documents: [{ name: 'Air Waybill', type: 'bl', status: 'verified', uploadedDate: '2024-01-20' }, { name: 'Commercial Invoice', type: 'invoice', status: 'verified', uploadedDate: '2024-01-20' }] },
];

const sampleDocumentAlerts: DocumentAlert[] = [
  { id: '1', poNumber: 'PO-2024-0892', supplierName: 'Almarai Company', documentType: 'packing_list', documentName: 'Packing List - Batch BTH-2024-022', uploadedAt: '2024-01-29T14:30:00', aiCheckStatus: 'matched', aiCheckDetails: 'Packing list matches PO quantity: 50,000 units ✓' },
  { id: '2', poNumber: 'PO-2024-0893', supplierName: 'Gulf Trading Co.', documentType: 'certificate', documentName: 'Certificate of Origin - Turkey', uploadedAt: '2024-01-24T09:15:00', aiCheckStatus: 'pending' },
  { id: '3', poNumber: 'PO-2024-0895', supplierName: 'Nile Foods International', documentType: 'invoice', documentName: 'Proforma Invoice - Draft', uploadedAt: '2024-01-28T16:45:00', aiCheckStatus: 'mismatch', aiCheckDetails: 'Warning: Invoice shows $12,500 but PO value is $11,250. Review required.' },
];

const sampleQuotes: Quote[] = [
  { id: 'q1', rfqId: 'rfq1', supplierName: 'Almarai Company', supplierCountry: 'Saudi Arabia', price: 42000, currency: 'USD', validUntil: '2024-02-15', leadTime: '21 days', status: 'pending' },
  { id: 'q2', rfqId: 'rfq1', supplierName: 'Gulf Trading Co.', supplierCountry: 'UAE', price: 43500, currency: 'USD', validUntil: '2024-02-10', leadTime: '18 days', status: 'reviewed' },
  { id: 'q3', rfqId: 'rfq2', supplierName: 'German Foods GmbH', supplierCountry: 'Germany', price: 17500, currency: 'EUR', validUntil: '2024-02-20', leadTime: '25 days', status: 'pending' },
];

const sampleContracts: Contract[] = [
  { id: 'c1', contractNumber: 'CTR-2024-0156', supplierName: 'Almarai Company', value: 450000, status: 'active', startDate: '2024-01-01', endDate: '2024-12-31' },
  { id: 'c2', contractNumber: 'CTR-2024-0157', supplierName: 'Gulf Trading Co.', value: 280000, status: 'pending_signature', startDate: '2024-02-01', endDate: '2025-01-31' },
  { id: 'c3', contractNumber: 'CTR-2024-0158', supplierName: 'German Foods GmbH', value: 180000, status: 'draft', startDate: '2024-03-01', endDate: '2025-02-28' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'draft': case 'pending': return 'bg-slate-500/20 text-slate-400';
    case 'sent': case 'booking': return 'bg-blue-500/20 text-blue-400';
    case 'confirmed': case 'in_transit': case 'reviewed': return 'bg-amber-500/20 text-amber-400';
    case 'shipped': case 'uploaded': return 'bg-purple-500/20 text-purple-400';
    case 'delivered': case 'active': case 'verified': case 'accepted': case 'matched': return 'bg-emerald-500/20 text-emerald-400';
    case 'cancelled': case 'rejected': case 'expired': case 'mismatch': return 'bg-red-500/20 text-red-400';
    case 'customs': return 'bg-cyan-500/20 text-cyan-400';
    case 'pending_signature': return 'bg-orange-500/20 text-orange-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 95) return 'text-emerald-400';
  if (score >= 85) return 'text-amber-400';
  return 'text-red-400';
};

const getAISuggestedSuppliers = (query: string): AISuggestedSupplier[] => {
  // Simulate AI matching based on query
  const suggestions: AISuggestedSupplier[] = [
    { id: '1', name: 'Almarai Company', country: 'Saudi Arabia', rating: 4.9, reliabilityScore: 98, minOrder: 5000, leadTime: '14-21 days', certifications: ['ISO 22000', 'HACCP'], matchReason: 'Top-rated dairy supplier with 98% reliability' },
    { id: '2', name: 'Gulf Trading Co.', country: 'UAE', rating: 4.7, reliabilityScore: 95, minOrder: 3000, leadTime: '10-14 days', certifications: ['ISO 9001', 'Halal'], matchReason: 'Fast delivery to GCC region, competitive pricing' },
    { id: '3', name: 'Mediterranean Foods', country: 'Turkey', rating: 4.5, reliabilityScore: 94, minOrder: 2000, leadTime: '7-12 days', certifications: ['ISO 22000', 'EU Organic'], matchReason: 'Premium quality, direct from manufacturer' },
  ];
  return suggestions;
};

// ============================================
// MAIN COMPONENT
// ============================================

const ProcurementWorkspace = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rfqs' | 'orders' | 'suppliers' | 'documents'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourcingQuery, setSourcingQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AISuggestedSupplier[]>([]);
  const [purchaseOrders] = useState<PurchaseOrder[]>(samplePurchaseOrders);
  const [suppliers] = useState<Supplier[]>(sampleSuppliers);
  const [shipments] = useState<Shipment[]>(sampleShipments);
  const [documentAlerts] = useState<DocumentAlert[]>(sampleDocumentAlerts);
  const [quotes] = useState<Quote[]>(sampleQuotes);
  const [contracts] = useState<Contract[]>(sampleContracts);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Hello! I'm your AI Procurement Assistant. I can help you find suppliers, compare quotes, and track orders. What would you like to do today?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Calculate metrics
  const totalActivePOs = purchaseOrders.filter(po => po.status !== 'delivered' && po.status !== 'cancelled').length;
  const totalSpendThisQuarter = purchaseOrders.reduce((sum, po) => sum + po.totalValue, 0);
  const costSavingsViaAI = 12500; // Simulated AI negotiation savings

  // Handle AI Sourcing Search
  const handleSearch = () => {
    if (!sourcingQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const results = getAISuggestedSuppliers(sourcingQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 1500);
  };

  // Handle chat send
  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    const userQuery = chatInput;
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      let response = "I can help with that! Here are some insights:\n\n";
      if (userQuery.toLowerCase().includes('supplier')) {
        response += "Based on your query, I recommend Almarai Company with a 98% reliability score and Gulf Trading Co. for competitive pricing.";
      } else if (userQuery.toLowerCase().includes('order') || userQuery.toLowerCase().includes('po')) {
        response += "You have 4 active purchase orders. The most urgent is PO-2024-0892 from Almarai, expected to arrive on Feb 10.";
      } else if (userQuery.toLowerCase().includes('document')) {
        response += "You have 1 document requiring attention: A mismatch detected on PO-2024-0895 from Nile Foods International.";
      } else {
        response += "I'm analyzing your request. Based on your procurement history, I can suggest cost optimization strategies. Would you like me to run a savings analysis?";
      }
      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
    }, 1000);
  };

  // Drag and drop handlers for Kanban
  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDrop = (status: string) => {
    if (draggedItem) {
      console.log(`Moving ${draggedItem} to ${status}`);
      setDraggedItem(null);
    }
  };

  // Render Top Metrics
  const renderTopMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl border border-blue-500/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+12%</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{totalActivePOs}</div>
        <div className="text-blue-400 text-sm font-medium">Total Active POs</div>
        <div className="text-slate-400 text-xs mt-1">+2 from last month</div>
      </div>

      <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl border border-amber-500/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+8.5%</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{formatCurrency(totalSpendThisQuarter)}</div>
        <div className="text-amber-400 text-sm font-medium">Total Spend This Quarter</div>
        <div className="text-slate-400 text-xs mt-1">Across {purchaseOrders.length} orders</div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl border border-emerald-500/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+22%</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-emerald-400 mb-1">{formatCurrency(costSavingsViaAI)}</div>
        <div className="text-emerald-400 text-sm font-medium">Cost Savings via AI Negotiations</div>
        <div className="text-slate-400 text-xs mt-1">12 negotiations optimized</div>
      </div>
    </div>
  );

  // Render AI Sourcing Assistant
  const renderAISourcingAssistant = () => (
    <div className="bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-slate-800/50 rounded-2xl border border-purple-500/30 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Sourcing Assistant</h2>
          <p className="text-purple-400 text-sm">Powered by Brands Bridge AI Core</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-3 mb-4">
        <div className="text-white font-medium mb-2 flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-amber-400" />
          What do you need to buy today?
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={sourcingQuery}
            onChange={(e) => setSourcingQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g., 'UHT milk from GCC suppliers' or 'chocolate for European market'"
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Find Suppliers
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <div className="text-slate-400 text-sm font-medium">Top 3 Verified Suppliers Matched:</div>
          {searchResults.map((supplier, idx) => (
            <div key={supplier.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30 hover:border-purple-500/50 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{supplier.name}</span>
                      <span className="text-emerald-400 text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full">#{idx + 1} Match</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                      <Globe className="w-3 h-3" />
                      {supplier.country}
                      <span>•</span>
                      <span>Min Order: {formatCurrency(supplier.minOrder)}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      {supplier.leadTime}
                    </div>
                    <div className="text-purple-400 text-sm bg-purple-500/10 px-3 py-1 rounded-lg inline-block">
                      {supplier.matchReason}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {supplier.certifications.map((cert, i) => (
                        <span key={i} className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">{cert}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-white font-bold">{supplier.rating}</span>
                  </div>
                  <div className="text-xs text-slate-400">AI Reliability</div>
                  <div className={`text-sm font-bold ${getScoreColor(supplier.reliabilityScore)}`}>{supplier.reliabilityScore}%</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/30">
                <button className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Request Quote
                </button>
                <button className="flex-1 py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Procurement Pipeline Kanban
  const renderProcurementPipeline = () => (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
      <div className="p-5 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Procurement Pipeline</h2>
        <p className="text-slate-400 text-sm">Track your RFQs, quotes, contracts, and shipments</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* RFQs Sent */}
          <div
            className="bg-slate-700/30 rounded-xl p-4 min-h-64 border-2 border-dashed border-blue-500/30"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('rfq')}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white font-semibold text-sm">RFQs Sent</span>
              <span className="text-slate-400 text-xs">({quotes.filter(q => q.status === 'pending').length})</span>
            </div>
            <div className="space-y-3">
              {quotes.filter(q => q.status === 'pending').map(quote => (
                <div
                  key={quote.id}
                  draggable
                  onDragStart={() => handleDragStart(quote.id)}
                  className="bg-slate-800/80 rounded-lg p-3 border border-slate-600/30 hover:border-blue-500/50 transition-all cursor-grab"
                >
                  <div className="text-white text-sm font-medium mb-1">{quote.supplierName}</div>
                  <div className="text-slate-400 text-xs mb-2">{quote.supplierCountry}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-bold text-sm">{formatCurrency(quote.price, quote.currency)}</span>
                    <span className="text-slate-400 text-xs">{quote.leadTime}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 px-3 border border-dashed border-slate-600/50 rounded-lg text-slate-400 text-sm hover:border-slate-500 hover:text-slate-300 transition-all">
                <Plus className="w-4 h-4 inline mr-1" />
                Send New RFQ
              </button>
            </div>
          </div>

          {/* Quotes Received */}
          <div
            className="bg-slate-700/30 rounded-xl p-4 min-h-64 border-2 border-dashed border-amber-500/30"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('quote')}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-white font-semibold text-sm">Quotes Received</span>
              <span className="text-slate-400 text-xs">({quotes.filter(q => q.status === 'reviewed').length})</span>
            </div>
            <div className="space-y-3">
              {quotes.filter(q => q.status === 'reviewed').map(quote => (
                <div
                  key={quote.id}
                  draggable
                  onDragStart={() => handleDragStart(quote.id)}
                  className="bg-slate-800/80 rounded-lg p-3 border border-slate-600/30 hover:border-amber-500/50 transition-all cursor-grab"
                >
                  <div className="text-white text-sm font-medium mb-1">{quote.supplierName}</div>
                  <div className="text-slate-400 text-xs mb-2">Valid until {formatDate(quote.validUntil)}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-sm">{formatCurrency(quote.price, quote.currency)}</span>
                    <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded">Best Value</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contracts Pending */}
          <div
            className="bg-slate-700/30 rounded-xl p-4 min-h-64 border-2 border-dashed border-purple-500/30"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('contract')}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-white font-semibold text-sm">Contracts Pending</span>
              <span className="text-slate-400 text-xs">({contracts.filter(c => c.status !== 'active' && c.status !== 'expired').length})</span>
            </div>
            <div className="space-y-3">
              {contracts.filter(c => c.status !== 'active' && c.status !== 'expired').map(contract => (
                <div
                  key={contract.id}
                  draggable
                  onDragStart={() => handleDragStart(contract.id)}
                  className="bg-slate-800/80 rounded-lg p-3 border border-slate-600/30 hover:border-purple-500/50 transition-all cursor-grab"
                >
                  <div className="text-white text-sm font-medium mb-1">{contract.supplierName}</div>
                  <div className="text-slate-400 text-xs mb-2">{contract.contractNumber}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold text-sm">{formatCurrency(contract.value)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(contract.status)}`}>
                      {contract.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Shipments */}
          <div
            className="bg-slate-700/30 rounded-xl p-4 min-h-64 border-2 border-dashed border-emerald-500/30"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('shipment')}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-white font-semibold text-sm">Active Shipments</span>
              <span className="text-slate-400 text-xs">({shipments.filter(s => s.status !== 'delivered').length})</span>
            </div>
            <div className="space-y-3">
              {shipments.filter(s => s.status !== 'delivered').map(shipment => (
                <div
                  key={shipment.id}
                  draggable
                  onDragStart={() => handleDragStart(shipment.id)}
                  className="bg-slate-800/80 rounded-lg p-3 border border-slate-600/30 hover:border-emerald-500/50 transition-all cursor-grab"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{shipment.poNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mb-2">{shipment.supplierName}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    {shipment.destination}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Supplier Performance Matrix
  const renderSupplierMatrix = () => (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Supplier Performance Matrix</h2>
          <p className="text-slate-400 text-sm">AI-powered reliability scores and performance metrics</p>
        </div>
        <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/30">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Supplier</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">AI Reliability</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">On-Time</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Quality</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Total Orders</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Total Value</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {suppliers.map(supplier => (
              <tr key={supplier.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{supplier.name}</div>
                      <div className="text-slate-400 text-xs flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {supplier.country}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-lg font-bold ${getScoreColor(supplier.reliabilityScore)} bg-slate-700/50`}>
                      {supplier.reliabilityScore}%
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      AI Score
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getScoreColor(supplier.onTimeDelivery)}`}>{supplier.onTimeDelivery}%</span>
                    {supplier.onTimeDelivery >= 95 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-white font-medium">{supplier.qualityRating}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-white">{supplier.totalOrders}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-white font-medium">{formatCurrency(supplier.totalValue)}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors" title="Order">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors" title="More">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Smart Document Wallet
  const renderSmartDocumentWallet = () => (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              Smart Document Wallet
            </h2>
            <p className="text-slate-400 text-sm">AI-verified shipping documents and compliance checks</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
              {documentAlerts.filter(d => d.aiCheckStatus !== 'matched').length} Needs Attention
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {documentAlerts.map(alert => (
          <div key={alert.id} className={`p-4 rounded-xl border transition-all ${
            alert.aiCheckStatus === 'matched' ? 'bg-emerald-500/10 border-emerald-500/30' :
            alert.aiCheckStatus === 'mismatch' ? 'bg-red-500/10 border-red-500/30' :
            'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  alert.aiCheckStatus === 'matched' ? 'bg-emerald-500/20' :
                  alert.aiCheckStatus === 'mismatch' ? 'bg-red-500/20' :
                  'bg-amber-500/20'
                }`}>
                  {alert.aiCheckStatus === 'matched' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : alert.aiCheckStatus === 'mismatch' ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Clock3 className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{alert.documentName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      alert.aiCheckStatus === 'matched' ? 'bg-emerald-500/20 text-emerald-400' :
                      alert.aiCheckStatus === 'mismatch' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {alert.aiCheckStatus === 'matched' ? 'AI Verified' :
                       alert.aiCheckStatus === 'mismatch' ? 'Mismatch' : 'Pending Review'}
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm mb-2">
                    {alert.supplierName} • {alert.poNumber}
                  </div>
                  {alert.aiCheckDetails && (
                    <div className={`text-xs p-2 rounded-lg ${
                      alert.aiCheckStatus === 'matched' ? 'bg-emerald-500/10 text-emerald-300' :
                      alert.aiCheckStatus === 'mismatch' ? 'bg-red-500/10 text-red-300' :
                      'bg-amber-500/10 text-amber-300'
                    }`}>
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {alert.aiCheckDetails}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">{new Date(alert.uploadedAt).toLocaleString()}</span>
                <button className="p-2 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Recent POs with Document Status */}
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3">Recent Purchase Orders</h3>
          <div className="space-y-2">
            {purchaseOrders.slice(0, 4).map(po => (
              <div key={po.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    po.status === 'delivered' ? 'bg-emerald-500/20' :
                    po.status === 'shipped' ? 'bg-purple-500/20' :
                    'bg-slate-600/50'
                  }`}>
                    <FileText className={`w-4 h-4 ${
                      po.status === 'delivered' ? 'text-emerald-400' :
                      po.status === 'shipped' ? 'text-purple-400' :
                      'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{po.poNumber}</div>
                    <div className="text-slate-400 text-xs">{po.supplierName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(po.status)}`}>
                    {po.status}
                  </span>
                  <span className="text-white font-bold text-sm">{formatCurrency(po.totalValue, po.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 z-40 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Briefcase className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <span className="text-white font-bold">Procurement</span>
                <span className="text-amber-400 font-bold"> Hub</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-3 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 flex-shrink-0 ${activeTab === 'dashboard' ? 'text-purple-400' : ''}`} />
            {!sidebarCollapsed && <span className="font-medium">Dashboard</span>}
          </button>
          <button
            onClick={() => setActiveTab('rfqs')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'rfqs'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
            }`}
          >
            <FileText className={`w-5 h-5 flex-shrink-0 ${activeTab === 'rfqs' ? 'text-purple-400' : ''}`} />
            {!sidebarCollapsed && <span className="font-medium">RFQs</span>}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
            }`}
          >
            <ShoppingCart className={`w-5 h-5 flex-shrink-0 ${activeTab === 'orders' ? 'text-purple-400' : ''}`} />
            {!sidebarCollapsed && <span className="font-medium">Orders</span>}
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'suppliers'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
            }`}
          >
            <Users className={`w-5 h-5 flex-shrink-0 ${activeTab === 'suppliers' ? 'text-purple-400' : ''}`} />
            {!sidebarCollapsed && <span className="font-medium">Suppliers</span>}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'documents'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
            }`}
          >
            <Wallet className={`w-5 h-5 flex-shrink-0 ${activeTab === 'documents' ? 'text-purple-400' : ''}`} />
            {!sidebarCollapsed && <span className="font-medium">Documents</span>}
          </button>
        </nav>

        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">AI Assistant</div>
                <div className="text-purple-400 text-xs">Powered by Brands Bridge AI</div>
              </div>
            </div>
            <button
              onClick={() => setShowChat(true)}
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat Now
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search POs, suppliers, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New PO
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                BM
              </div>
              <div className="hidden md:block">
                <div className="text-white font-medium text-sm">Buyer Manager</div>
                <div className="text-slate-400 text-xs">Procurement Team</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-purple-600/20 to-slate-800/50 rounded-2xl border border-purple-500/30 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Good Morning, Buyer Manager</h1>
                    <p className="text-slate-400">Your procurement command center is ready. {documentAlerts.filter(d => d.aiCheckStatus !== 'matched').length} documents need your attention today.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-8 h-8 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">AI Active</span>
                  </div>
                </div>
              </div>

              {renderTopMetrics()}
              {renderAISourcingAssistant()}
              {renderProcurementPipeline()}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSupplierMatrix()}
                {renderSmartDocumentWallet()}
              </div>
            </div>
          )}

          {activeTab === 'rfqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Request for Quotes</h1>
                  <p className="text-slate-400">Manage RFQs and compare supplier quotes</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create RFQ
                </button>
              </div>
              {renderProcurementPipeline()}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Purchase Orders</h1>
                  <p className="text-slate-400">Track and manage all your purchase orders</p>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/30">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">PO Number</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Supplier</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Value</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Expected Delivery</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">AI Reliability</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {purchaseOrders.map(po => (
                        <tr key={po.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-5 py-4">
                            <span className="text-purple-400 font-mono font-medium">{po.poNumber}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-slate-500" />
                              <div>
                                <div className="text-white font-medium">{po.supplierName}</div>
                                <div className="text-slate-400 text-xs">{po.supplierCountry}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-white font-bold">{formatCurrency(po.totalValue, po.currency)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(po.status)}`}>
                              {po.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-300 text-sm">{formatDate(po.expectedDelivery)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`font-bold ${getScoreColor(po.aiReliabilityScore)}`}>{po.aiReliabilityScore}%</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                                <Download className="w-4 h-4" />
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
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Supplier Management</h1>
                  <p className="text-slate-400">View and manage your supplier relationships</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Supplier
                </button>
              </div>
              {renderSupplierMatrix()}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Document Wallet</h1>
                  <p className="text-slate-400">AI-verified shipping documents and compliance checks</p>
                </div>
              </div>
              {renderSmartDocumentWallet()}
            </div>
          )}
        </div>
      </main>

      {/* AI Chat Widget */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">AI Procurement Assistant</div>
                <div className="text-purple-200 text-xs">Powered by Brands Bridge AI Core</div>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-purple-500 text-white rounded-br-none'
                    : 'bg-slate-700/50 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Ask about suppliers, orders, or documents..."
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button
                onClick={handleChatSend}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl transition-all"
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

export default ProcurementWorkspace;
