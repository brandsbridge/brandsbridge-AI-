import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Truck,
  Sparkles,
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
  FileText,
  Download,
  Send,
  Edit,
  Trash2,
  MoreHorizontal,
  X,
  MessageSquare,
  ChevronDown,
  Warehouse,
  Box,
  BarChart3,
  Calendar,
  Filter,
  Eye,
  Copy,
  SendHorizontal,
  FileCheck,
  Ship,
  Plane,
  Building2,
  User,
  RefreshCw,
  Zap,
  Briefcase,
  CreditCard,
  Receipt,
  PackageOpen,
  AlertCircle,
  ArrowRight,
  Globe,
  MapPin,
  CalendarDays,
  Hash,
  Layers,
  Scale,
  Target,
  BellRing,
  PackageCheck,
  FileSpreadsheet,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Bot,
  Cpu,
  Lightbulb,
  ShoppingCart,
  Percent,
  Minus,
  Save,
  RotateCcw,
  Check,
  Mail,
  GripVertical,
  SparklesIcon,
  PenLine,
  ArrowLeftRight,
  ReceiptIcon
} from 'lucide-react';
import SupplierSidebar from '../components/SupplierSidebar';
import { useGlobalTrade } from '../contexts/GlobalTradeContext';

// ============================================
// DATA TYPES
// ============================================

interface SKU {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit: string;
  warehouse: string;
  batchNumber: string;
  expiryDate: string;
  costPrice: number;
  sellPrice: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expiring_soon';
  reservedStock: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerCountry: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  items: { name: string; quantity: number; price: number; sku?: string }[];
  dealId?: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  customerName: string;
  destination: string;
  origin: string;
  status: 'booking' | 'confirmed' | 'in_transit' | 'customs' | 'delivered';
  departureDate: string;
  eta: string;
  freightType: 'sea' | 'air' | 'land';
  containerType: string;
  documents: { name: string; status: 'pending' | 'ready' | 'submitted' }[];
}

interface AInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'alert' | 'tip' | 'action';
  title: string;
  description: string;
  action: string;
  metric?: string;
  trend?: 'up' | 'down' | 'neutral';
  actionType?: 'campaign' | 'restock' | 'followup' | 'optimize';
  priority: 'high' | 'medium' | 'low';
}

interface FinanceTransaction {
  id: string;
  type: 'payment_in' | 'payment_out' | 'expense';
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

interface Deal {
  id: string;
  companyName: string;
  dealValue: number;
  stage: 'new' | 'qualified' | 'negotiation' | 'closing';
  products: { name: string; quantity: number; sku: string }[];
  probability: number;
  expectedCloseDate: string;
  lastActivity: string;
  // Lead Score Breakdown for Kanban cards
  score?: number;
  scoreBreakdown?: {
    marketFit: { points: number; reason: string };
    inquiryIntent: { points: number; reason: string };
    profileInteraction: { points: number; reason: string };
  };
}

// Lead Score Interface with breakdown
interface LeadScore {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  country: string;
  score: number;
  breakdown: {
    engagement: { points: number; reason: string };
    marketFit: { points: number; reason: string };
    trust: { points: number; reason: string };
  };
  lastActivity: string;
  products: string[];
  exportRegions: string[];
}

interface CommodityPrice {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
}

// ============================================
// SAMPLE DATA
// ============================================

const sampleSKUs: SKU[] = [
  { id: '1', name: 'Premium Olive Oil 1L', sku: 'OIL-OLV-001', category: 'Oils & Fats', stock: 2450, unit: 'cases', warehouse: 'Istanbul WH', batchNumber: 'BTH-2024-001', expiryDate: '2026-06-15', costPrice: 8.50, sellPrice: 12.99, status: 'in_stock', reservedStock: 0 },
  { id: '2', name: 'Apple Juice 1L', sku: 'BEV-AJL-001', category: 'Beverages', stock: 180, unit: 'cases', warehouse: 'Istanbul WH', batchNumber: 'BTH-2024-015', expiryDate: '2024-08-20', costPrice: 3.20, sellPrice: 5.49, status: 'expiring_soon', reservedStock: 0 },
  { id: '3', name: 'Chocolate Wafer Bars 750g', sku: 'CNF-WFR-001', category: 'Confectionery', stock: 85, unit: 'cases', warehouse: 'Izmir WH', batchNumber: 'BTH-2024-008', expiryDate: '2025-03-10', costPrice: 6.80, sellPrice: 9.99, status: 'low_stock', reservedStock: 50 },
  { id: '4', name: 'Organic Honey 500g', sku: 'SPO-HNY-001', category: 'Spreads', stock: 0, unit: 'cases', warehouse: 'Istanbul WH', batchNumber: 'BTH-2023-045', expiryDate: '2024-12-01', costPrice: 9.50, sellPrice: 14.99, status: 'out_of_stock', reservedStock: 0 },
  { id: '5', name: 'UHT Milk 1L', sku: 'DRY-MLK-001', category: 'Dairy', stock: 3200, unit: 'cases', warehouse: 'Ankara WH', batchNumber: 'BTH-2024-022', expiryDate: '2025-01-30', costPrice: 2.80, sellPrice: 4.29, status: 'in_stock', reservedStock: 1000 },
  { id: '6', name: 'Tomato Paste 400g', sku: 'CND-TMT-001', category: 'Canned Foods', stock: 5600, unit: 'cases', warehouse: 'Izmir WH', batchNumber: 'BTH-2024-018', expiryDate: '2026-09-22', costPrice: 2.10, sellPrice: 3.49, status: 'in_stock', reservedStock: 0 },
  { id: '7', name: 'Natural Mineral Water 1.5L', sku: 'BEV-WTR-001', category: 'Beverages', stock: 420, unit: 'cases', warehouse: 'Ankara WH', batchNumber: 'BTH-2024-031', expiryDate: '2025-04-18', costPrice: 1.50, sellPrice: 2.49, status: 'low_stock', reservedStock: 0 },
  { id: '8', name: 'Tahini Paste 1kg', sku: 'SPO-THN-001', category: 'Spreads', stock: 890, unit: 'cases', warehouse: 'Istanbul WH', batchNumber: 'BTH-2024-012', expiryDate: '2025-08-05', costPrice: 7.20, sellPrice: 11.99, status: 'in_stock', reservedStock: 200 },
];

// Smart Lead Scoring Data
const sampleLeads: LeadScore[] = [
  {
    id: 'lead-1',
    companyName: 'Almarai Company',
    contactName: 'Ahmed Al-Rashid',
    email: 'ahmed.alrashid@almarai.com',
    country: 'Saudi Arabia',
    score: 92,
    breakdown: {
      engagement: { points: 25, reason: 'Downloaded Catalog 3x' },
      marketFit: { points: 15, reason: 'Matches GCC Export Region' },
      trust: { points: 10, reason: 'Verified Business Email' }
    },
    lastActivity: '2 hours ago',
    products: ['UHT Milk 1L', 'Tomato Paste 400g'],
    exportRegions: ['GCC', 'Middle East']
  },
  {
    id: 'lead-2',
    companyName: 'Gulf Trading Co.',
    contactName: 'Fatima Hassan',
    email: 'f.hassan@gulftrading.ae',
    country: 'UAE',
    score: 78,
    breakdown: {
      engagement: { points: 20, reason: 'Opened 5 Emails' },
      marketFit: { points: 15, reason: 'Matches Export Profile' },
      trust: { points: 8, reason: 'LinkedIn Verified' }
    },
    lastActivity: '1 day ago',
    products: ['Premium Olive Oil 1L', 'Tahini Paste 1kg'],
    exportRegions: ['GCC']
  },
  {
    id: 'lead-3',
    companyName: 'Premium Foods UK',
    contactName: 'James Mitchell',
    email: 'j.mitchell@premiumfoods.co.uk',
    country: 'United Kingdom',
    score: 65,
    breakdown: {
      engagement: { points: 15, reason: 'Visited Product Page' },
      marketFit: { points: 10, reason: 'Europe Region Match' },
      trust: { points: 5, reason: 'Personal Email' }
    },
    lastActivity: '3 days ago',
    products: ['Chocolate Wafer Bars 750g'],
    exportRegions: ['Europe']
  },
  {
    id: 'lead-4',
    companyName: 'German Foods GmbH',
    contactName: 'Klaus Weber',
    email: 'k.weber@germanfoods.de',
    country: 'Germany',
    score: 88,
    breakdown: {
      engagement: { points: 22, reason: 'Requested Quote 2x' },
      marketFit: { points: 15, reason: 'Premium Market Fit' },
      trust: { points: 10, reason: 'Verified Business Email' }
    },
    lastActivity: '5 hours ago',
    products: ['Premium Olive Oil 1L', 'Tahini Paste 1kg'],
    exportRegions: ['Europe', 'DACH']
  },
  {
    id: 'lead-5',
    companyName: 'Nile Foods International',
    contactName: 'Omar Farouk',
    email: 'o.farouk@nilefoods.eg',
    country: 'Egypt',
    score: 54,
    breakdown: {
      engagement: { points: 10, reason: 'Newsletter Click' },
      marketFit: { points: 12, reason: 'MENA Region' },
      trust: { points: 7, reason: 'Company Email' }
    },
    lastActivity: '1 week ago',
    products: ['Tomato Paste 400g', 'Organic Honey 500g'],
    exportRegions: ['MENA', 'Africa']
  },
];

const sampleDeals: Deal[] = [
  { id: 'deal-1', companyName: 'Almarai Company', dealValue: 125000, stage: 'closing', products: [{ name: 'UHT Milk 1L', quantity: 10000, sku: 'DRY-MLK-001' }], probability: 90, expectedCloseDate: '2024-02-15', lastActivity: 'Contract review completed', score: 92, scoreBreakdown: { marketFit: { points: 25, reason: 'GCC Export Region Match' }, inquiryIntent: { points: 40, reason: 'Requested Quote 3x' }, profileInteraction: { points: 27, reason: 'Website Visit 5x' } } },
  { id: 'deal-2', companyName: 'Gulf Trading Co.', dealValue: 85000, stage: 'negotiation', products: [{ name: 'Premium Olive Oil 1L', quantity: 2000, sku: 'OIL-OLV-001' }, { name: 'Tahini Paste 1kg', quantity: 800, sku: 'SPO-THN-001' }], probability: 65, expectedCloseDate: '2024-02-28', lastActivity: 'Sent revised quotation', score: 78, scoreBreakdown: { marketFit: { points: 22, reason: 'UAE Distribution Network' }, inquiryIntent: { points: 35, reason: 'Opened 5 Emails' }, profileInteraction: { points: 21, reason: 'Catalog Downloaded' } } },
  { id: 'deal-3', companyName: 'Premium Foods UK', dealValue: 156000, stage: 'qualified', products: [{ name: 'Chocolate Wafer Bars 750g', quantity: 2500, sku: 'CNF-WFR-001' }], probability: 45, expectedCloseDate: '2024-03-15', lastActivity: 'Discovery call completed', score: 65, scoreBreakdown: { marketFit: { points: 18, reason: 'Europe Premium Market' }, inquiryIntent: { points: 28, reason: 'Visited Product Page' }, profileInteraction: { points: 19, reason: 'Email Engagement' } } },
  { id: 'deal-4', companyName: 'German Foods GmbH', dealValue: 198000, stage: 'closing', products: [{ name: 'Premium Olive Oil 1L', quantity: 5000, sku: 'OIL-OLV-001' }, { name: 'Tahini Paste 1kg', quantity: 3000, sku: 'SPO-THN-001' }], probability: 95, expectedCloseDate: '2024-02-05', lastActivity: 'Final contract sent', score: 88, scoreBreakdown: { marketFit: { points: 28, reason: 'DACH Region Premium' }, inquiryIntent: { points: 38, reason: 'Requested Quote 2x' }, profileInteraction: { points: 22, reason: 'LinkedIn Verified' } } },
];

const sampleCommodityPrices: CommodityPrice[] = [
  { name: 'Olive Oil', symbol: 'OLIVE', price: 4850, change: 125, changePercent: 2.65, unit: 'USD/MT' },
  { name: 'Sugar', symbol: 'SUGAR', price: 420, change: -8, changePercent: -1.87, unit: 'USD/MT' },
  { name: 'Cocoa', symbol: 'COCOA', price: 5840, change: 340, changePercent: 6.18, unit: 'USD/MT' },
  { name: 'Coffee', symbol: 'COFFEE', price: 185, change: 3.5, changePercent: 1.93, unit: 'USD/lb' },
  { name: 'Wheat', symbol: 'WHEAT', price: 285, change: -2.5, changePercent: -0.87, unit: 'USD/bu' },
  { name: 'Palm Oil', symbol: 'PALM', price: 890, change: 15, changePercent: 1.71, unit: 'USD/MT' },
  { name: 'Milk Powder', symbol: 'MILK', price: 3100, change: -50, changePercent: -1.59, unit: 'USD/MT' },
  { name: 'Tomatoes', symbol: 'TOM', price: 1250, change: 80, changePercent: 6.84, unit: 'USD/MT' },
];

const sampleAIInsights: AInsight[] = [
  { id: '1', type: 'action', title: 'High Probability: Almarai ready for order', description: 'German Foods GmbH has 95% probability. Send Proforma Invoice now for immediate close.', action: 'Send Proforma Invoice', metric: '+€198K potential', trend: 'up', actionType: 'followup', priority: 'high' },
  { id: '2', type: 'opportunity', title: 'Almarai Company matching your profile', description: 'Almarai has 92% lead score. High engagement with Dairy & Spreads. Perfect match for your inventory.', action: 'Launch AI Follow-up', metric: '+€125K potential', trend: 'up', actionType: 'followup', priority: 'high' },
  { id: '3', type: 'tip', title: '14 Products near expiry', description: 'Apple Juice and Natural Mineral Water are expiring within 60 days. Consider running a flash sale.', action: 'Run Flash Sale Campaign', metric: '14 items at risk', trend: 'down', actionType: 'campaign', priority: 'high' },
];

const sampleInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-0156', customerName: 'Gulf Trading Co.', customerCountry: 'UAE', amount: 45600, currency: 'USD', status: 'paid', issueDate: '2024-01-15', dueDate: '2024-02-15', items: [{ name: 'Premium Olive Oil 1L', quantity: 2000, price: 12.99, sku: 'OIL-OLV-001' }, { name: 'Tahini Paste 1kg', quantity: 800, price: 11.99, sku: 'SPO-THN-001' }], dealId: 'deal-2' },
  { id: '2', invoiceNumber: 'INV-2024-0157', customerName: 'Almarai Company', customerCountry: 'Saudi Arabia', amount: 78500, currency: 'USD', status: 'sent', issueDate: '2024-01-20', dueDate: '2024-02-20', items: [{ name: 'UHT Milk 1L', quantity: 10000, price: 4.29, sku: 'DRY-MLK-001' }, { name: 'Tomato Paste 400g', quantity: 8000, price: 3.49, sku: 'CND-TMT-001' }], dealId: 'deal-1' },
  { id: '3', invoiceNumber: 'INV-2024-0158', customerName: 'Premium Foods UK', customerCountry: 'United Kingdom', amount: 32500, currency: 'EUR', status: 'overdue', issueDate: '2024-01-05', dueDate: '2024-01-25', items: [{ name: 'Chocolate Wafer Bars 750g', quantity: 2500, price: 9.99, sku: 'CNF-WFR-001' }], dealId: 'deal-3' },
  { id: '4', invoiceNumber: 'INV-2024-0159', customerName: 'Nile Foods International', customerCountry: 'Egypt', amount: 18900, currency: 'USD', status: 'draft', issueDate: '2024-01-28', dueDate: '2024-02-28', items: [{ name: 'Tomato Paste 400g', quantity: 3000, price: 3.49, sku: 'CND-TMT-001' }, { name: 'Organic Honey 500g', quantity: 600, price: 14.99, sku: 'SPO-HNY-001' }] },
  { id: '5', invoiceNumber: 'INV-2024-0160', customerName: 'German Foods GmbH', customerCountry: 'Germany', amount: 67200, currency: 'EUR', status: 'paid', issueDate: '2024-01-10', dueDate: '2024-02-10', items: [{ name: 'Premium Olive Oil 1L', quantity: 3000, price: 13.50, sku: 'OIL-OLV-001' }, { name: 'Tahini Paste 1kg', quantity: 2000, price: 12.50, sku: 'SPO-THN-001' }], dealId: 'deal-4' },
];

const sampleShipments: Shipment[] = [
  { id: '1', trackingNumber: 'SHP-TRK-2024-0045', customerName: 'Gulf Trading Co.', destination: 'Dubai, UAE', origin: 'Istanbul, Turkey', status: 'in_transit', departureDate: '2024-01-25', eta: '2024-02-12', freightType: 'sea', containerType: '40ft HC Reefer', documents: [{ name: 'Bill of Lading', status: 'ready' }, { name: 'Certificate of Origin', status: 'ready' }, { name: 'Packing List', status: 'submitted' }] },
  { id: '2', trackingNumber: 'SHP-TRK-2024-0046', customerName: 'Almarai Company', destination: 'Riyadh, Saudi Arabia', origin: 'Ankara, Turkey', status: 'customs', departureDate: '2024-01-20', eta: '2024-02-05', freightType: 'land', containerType: '20ft Dry', documents: [{ name: 'Bill of Lading', status: 'submitted' }, { name: 'Certificate of Origin', status: 'submitted' }, { name: 'Commercial Invoice', status: 'ready' }] },
  { id: '3', trackingNumber: 'SHP-TRK-2024-0047', customerName: 'Premium Foods UK', destination: 'London, UK', origin: 'Izmir, Turkey', status: 'booking', departureDate: '2024-02-01', eta: '2024-02-10', freightType: 'air', containerType: 'Air Cargo', documents: [{ name: 'Air Waybill', status: 'pending' }, { name: 'Phytosanitary Certificate', status: 'pending' }] },
  { id: '4', trackingNumber: 'SHP-TRK-2024-0044', customerName: 'German Foods GmbH', destination: 'Munich, Germany', origin: 'Istanbul, Turkey', status: 'delivered', departureDate: '2024-01-10', eta: '2024-01-28', freightType: 'sea', containerType: '40ft Dry', documents: [{ name: 'Bill of Lading', status: 'submitted' }, { name: 'Certificate of Origin', status: 'submitted' }, { name: 'Packing List', status: 'submitted' }] },
];

const sampleTransactions: FinanceTransaction[] = [
  { id: '1', type: 'payment_in', description: 'Invoice #INV-2024-0156 - Gulf Trading Co.', amount: 45600, currency: 'USD', date: '2024-01-28', status: 'completed', method: 'Wire Transfer' },
  { id: '2', type: 'payment_in', description: 'Invoice #INV-2024-0160 - German Foods GmbH', amount: 67200, currency: 'EUR', date: '2024-01-25', status: 'completed', method: 'Letter of Credit' },
  { id: '3', type: 'payment_out', description: 'Warehouse Rental - February 2024', amount: 8500, currency: 'USD', date: '2024-01-20', status: 'completed', method: 'Bank Transfer' },
  { id: '4', type: 'payment_out', description: 'Container Freight - Booking #SHP-0045', amount: 3200, currency: 'USD', date: '2024-01-22', status: 'completed', method: 'Credit Card' },
  { id: '5', type: 'expense', description: 'Customs Clearance - Shipment #SHP-0044', amount: 1850, currency: 'EUR', date: '2024-01-28', status: 'pending', method: 'Pending' },
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

const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'in_stock': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'low_stock': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'out_of_stock': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'expiring_soon': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'paid': case 'completed': case 'delivered': return 'bg-emerald-500/20 text-emerald-400';
    case 'sent': case 'in_transit': case 'confirmed': return 'bg-blue-500/20 text-blue-400';
    case 'overdue': case 'pending': return 'bg-amber-500/20 text-amber-400';
    case 'draft': case 'booking': return 'bg-slate-500/20 text-slate-400';
    case 'customs': return 'bg-purple-500/20 text-purple-400';
    case 'ready': return 'bg-emerald-500/20 text-emerald-400';
    case 'submitted': return 'bg-blue-500/20 text-blue-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const CRBHub = () => {
  const { addInvoice, deals: globalDeals, updateDealStatus } = useGlobalTrade();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCoPilot, setShowCoPilot] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [showReserveStockModal, setShowReserveStockModal] = useState(false);
  const [showExportDocsModal, setShowExportDocsModal] = useState(false);
  const [showClosingModal, setShowClosingModal] = useState(false);
  const [selectedDealForReserve, setSelectedDealForReserve] = useState<Deal | null>(null);
  const [selectedInvoiceForDocs, setSelectedInvoiceForDocs] = useState<Invoice | null>(null);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Hello! I'm your AI Business Partner powered by Brands Bridge AI Core. I analyze your leads, sales, and inventory to provide actionable insights. How can I help you today?" }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [skus, setSkus] = useState(sampleSKUs);
  const [deals, setDeals] = useState(sampleDeals);
  const [leads] = useState(sampleLeads);
  const [hoveredLead, setHoveredLead] = useState<string | null>(null);
  const [hoveredDeal, setHoveredDeal] = useState<string | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState<LeadScore | null>(null);
  const [draftedEmail, setDraftedEmail] = useState('');
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [invoices, setInvoices] = useState(sampleInvoices);

  // Calculate dashboard stats
  const totalStockValue = skus.reduce((sum, sku) => sum + (sku.stock * sku.costPrice), 0);
  const totalInventory = skus.reduce((sum, sku) => sum + sku.stock, 0);
  const lowStockItems = skus.filter(s => s.status === 'low_stock' || s.status === 'out_of_stock').length;
  const expiringItems = skus.filter(s => s.status === 'expiring_soon').length;
  const totalRevenue = sampleInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingPayments = sampleInvoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);
  const activeShipments = sampleShipments.filter(s => s.status !== 'delivered' && s.status !== 'booking').length;

  // Navigation items - Changed AI Automations to AI Agents
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Product & Inventory', icon: Package },
    { id: 'crm', label: 'AI Lead Hub', icon: Bot },
    { id: 'finance', label: 'Smart Finance', icon: DollarSign },
    { id: 'exports', label: 'Export Log Center', icon: Truck },
    { id: 'agents', label: 'AI Agents', icon: SparklesIcon },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Filter SKUs
  const filteredSKUs = skus.filter(sku => {
    const matchesSearch = sku.name.toLowerCase().includes(searchQuery.toLowerCase()) || sku.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = selectedWarehouse === 'all' || sku.warehouse.toLowerCase().includes(selectedWarehouse.toLowerCase());
    const matchesExpiry = expiryFilter === 'all' ||
      (expiryFilter === 'expiring_30' && getDaysUntilExpiry(sku.expiryDate) <= 30) ||
      (expiryFilter === 'expiring_60' && getDaysUntilExpiry(sku.expiryDate) <= 60 && getDaysUntilExpiry(sku.expiryDate) > 30) ||
      (expiryFilter === 'expiring_90' && getDaysUntilExpiry(sku.expiryDate) <= 90 && getDaysUntilExpiry(sku.expiryDate) > 60);
    return matchesSearch && matchesWarehouse && matchesExpiry;
  });

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, newStage: Deal['stage']) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== newStage) {
      const updatedDeals = deals.map(d => d.id === draggedDeal.id ? { ...d, stage: newStage } : d);
      setDeals(updatedDeals);

      // Show toast notification for stage change
      const stageLabels: Record<string, string> = {
        new: 'New Leads',
        qualified: 'Qualified',
        negotiation: 'Negotiation',
        closing: 'Closing'
      };
      toast.success(`${draggedDeal.companyName} moved to ${stageLabels[newStage]}`);

      // Show modal when dropped to Closing
      if (newStage === 'closing') {
        setSelectedDealForReserve(draggedDeal);
        setShowClosingModal(true);
        toast.success('AI is preparing invoice draft and document checklist');
      }
    }
    setDraggedDeal(null);
  };

  // Handle stock reservation
  const handleReserveStock = (deal: Deal) => {
    const updatedSKUs = skus.map(sku => {
      const productInDeal = deal.products.find(p => p.sku === sku.sku);
      if (productInDeal) {
        return { ...sku, reservedStock: sku.reservedStock + productInDeal.quantity };
      }
      return sku;
    });
    setSkus(updatedSKUs);
    setShowClosingModal(false);
    setShowReserveStockModal(false);
    setSelectedDealForReserve(null);
    toast.success(`${deal.companyName}: Stock reserved, Proforma Invoice generated!`);
  };

  // Handle document generation
  const handleGenerateDocs = (invoice: Invoice) => {
    setSelectedInvoiceForDocs(invoice);
    setShowExportDocsModal(true);
    toast.success(`Preparing export documents for ${invoice.customerName}`);
  };

  // Generate AI Email Draft
  const handleLaunchAIFollowUp = (lead: LeadScore) => {
    setSelectedLeadForEmail(lead);
    setIsDraftingEmail(true);
    setShowEmailModal(true);
    toast.loading('AI is drafting personalized email...', { id: 'ai-email' });

    // Simulate AI drafting email
    setTimeout(() => {
      const emailDraft = `Subject: Re: Your Interest in Turkish FMCG Products

Dear ${lead.contactName},

Thank you for your interest in ${lead.companyName}'s potential partnership with our Turkish FMCG portfolio.

Based on your inquiry about ${lead.products.join(', ')}, I wanted to personally reach out. Our ${lead.exportRegions.join(' & ')} expansion aligns perfectly with your distribution network.

Key Highlights for ${lead.companyName}:
• Premium quality products with competitive pricing
• Flexible MOQ starting at 500 cases
• Complete export documentation support
• Competitive freight rates to ${lead.country}

I've attached our latest catalog featuring ${lead.products.join(' and ')} - products we believe would perform exceptionally well in ${lead.country}.

Would you be available for a 15-minute call this week to discuss terms?

Best regards,
Export Sales Team
Powered by Brands Bridge AI Core`;

      setDraftedEmail(emailDraft);
      setIsDraftingEmail(false);
      toast.success('AI email draft ready!', { id: 'ai-email' });
    }, 2000);
  };

  // ========== GLOBAL TRADE FLOW HANDLER ==========
  // When supplier closes a deal, create invoice and notify buyer
  const handleCloseDeal = (deal: Deal) => {
    // Update deal status in global context
    updateDealStatus(deal.id, 'closed');

    // Create invoice in global context (this will notify the buyer)
    addInvoice({
      dealId: deal.id,
      supplierName: 'Golden Dates Co.',
      buyerName: deal.companyName,
      product: deal.products.map(p => p.name).join(', '),
      amount: deal.dealValue,
      status: 'sent',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    });

    // Also add to local invoices for display
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
      customerName: deal.companyName,
      customerCountry: 'International',
      amount: deal.dealValue,
      currency: 'USD',
      status: 'sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: deal.products.map(p => ({ name: p.name, quantity: p.quantity, price: 0 })),
      dealId: deal.id
    };
    setInvoices([newInvoice, ...invoices]);

    toast.success(
      <div>
        <div className="font-semibold">Deal Closed!</div>
        <div className="text-sm text-gray-300">{deal.companyName} - ${deal.dealValue.toLocaleString()}</div>
        <div className="text-sm text-emerald-400 mt-1">Invoice created and sent to buyer</div>
      </div>,
      { duration: 5000 }
    );
  };

  // Get score color
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-slate-400';
  };

  // Get score background
  const getScoreBg = (score: number): string => {
    if (score >= 80) return 'bg-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/20';
    return 'bg-slate-500/20';
  };

  // Render AI Next Best Action Widget (Updated)
  const renderNextBestAction = () => {
    const topLead = leads.sort((a, b) => b.score - a.score)[0];
    if (!topLead) return null;

    return (
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 text-sm font-semibold">AI Next Best Action</span>
        </div>
        <div className="space-y-2">
          <div className="text-white font-medium text-sm">
            High Probability: {topLead.companyName} is ready for an order
          </div>
          <div className="text-slate-400 text-xs">
            Lead score {topLead.score}% • {topLead.products.length} products matched
          </div>
          <button
            onClick={() => handleLaunchAIFollowUp(topLead)}
            className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Send Proforma Invoice Now
          </button>
        </div>
      </div>
    );
  };

  // Render Lead Score with Hover Tooltip
  const renderLeadScore = (lead: LeadScore) => (
    <div className="relative">
      <div
        className={`px-3 py-1.5 rounded-lg font-bold cursor-help ${getScoreBg(lead.score)} ${getScoreColor(lead.score)}`}
        onMouseEnter={() => setHoveredLead(lead.id)}
        onMouseLeave={() => setHoveredLead(null)}
      >
        {lead.score}
      </div>

      {/* Hover Tooltip with Score Breakdown */}
      {hoveredLead === lead.id && (
        <div className="absolute z-50 left-0 top-full mt-2 w-72 bg-slate-800 rounded-xl border border-slate-600 shadow-2xl p-4">
          <div className="text-white font-semibold text-sm mb-3 pb-2 border-b border-slate-600">
            Score Breakdown: {lead.companyName}
          </div>
          <div className="space-y-3">
            {/* Engagement */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Engagement</span>
                  <span className="text-blue-400 font-bold text-sm">+{lead.breakdown.engagement.points}</span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">{lead.breakdown.engagement.reason}</div>
              </div>
            </div>

            {/* Market Fit */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Market Fit</span>
                  <span className="text-emerald-400 font-bold text-sm">+{lead.breakdown.marketFit.points}</span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">{lead.breakdown.marketFit.reason}</div>
              </div>
            </div>

            {/* Trust */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Trust</span>
                  <span className="text-purple-400 font-bold text-sm">+{lead.breakdown.trust.points}</span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">{lead.breakdown.trust.reason}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-600 flex items-center justify-between">
            <span className="text-slate-400 text-xs">Total Score</span>
            <span className={`font-bold ${getScoreColor(lead.score)}`}>{lead.score}/100</span>
          </div>
        </div>
      )}
    </div>
  );

  // Render Deal Score with Hover Tooltip for Kanban cards
  const renderDealScore = (deal: Deal) => {
    if (!deal.score || !deal.scoreBreakdown) return null;

    return (
      <div className="relative">
        <div
          className={`px-3 py-1.5 rounded-lg font-bold cursor-help text-xs ${getScoreBg(deal.score)} ${getScoreColor(deal.score)}`}
          onMouseEnter={() => setHoveredDeal(deal.id)}
          onMouseLeave={() => setHoveredDeal(null)}
        >
          Score: {deal.score}
        </div>

        {/* Hover Tooltip with Score Breakdown */}
        {hoveredDeal === deal.id && (
          <div className="absolute z-50 left-0 top-full mt-2 w-72 bg-slate-800 rounded-xl border border-slate-600 shadow-2xl p-4">
            <div className="text-white font-semibold text-sm mb-3 pb-2 border-b border-slate-600">
              Score Breakdown: {deal.companyName}
            </div>
            <div className="space-y-3">
              {/* Market Fit */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Market Fit</span>
                    <span className="text-emerald-400 font-bold text-sm">+{deal.scoreBreakdown.marketFit.points}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">{deal.scoreBreakdown.marketFit.reason}</div>
                </div>
              </div>

              {/* Inquiry Intent */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Inquiry Intent</span>
                    <span className="text-amber-400 font-bold text-sm">+{deal.scoreBreakdown.inquiryIntent.points}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">{deal.scoreBreakdown.inquiryIntent.reason}</div>
                </div>
              </div>

              {/* Profile Interaction */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Profile Interaction</span>
                    <span className="text-blue-400 font-bold text-sm">+{deal.scoreBreakdown.profileInteraction.points}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">{deal.scoreBreakdown.profileInteraction.reason}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-600 flex items-center justify-between">
              <span className="text-slate-400 text-xs">Total Score</span>
              <span className={`font-bold ${getScoreColor(deal.score)}`}>{deal.score}/100</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render AI Co-Pilot Sidebar
  const renderCoPilot = () => (
    <div className={`fixed right-0 top-0 h-full bg-slate-800/95 backdrop-blur-xl border-l border-slate-700/50 transition-all duration-300 z-50 ${showCoPilot ? 'w-80' : 'w-0 overflow-hidden'}`}>
      {showCoPilot && (
        <div className="h-full flex flex-col">
          {/* Header - Updated to Brands Bridge AI Core */}
          <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/20 to-purple-900/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold">AI Co-Pilot</div>
                  <div className="text-purple-400 text-xs">Powered by Brands Bridge AI Core</div>
                </div>
              </div>
              <button
                onClick={() => setShowCoPilot(false)}
                className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Custom LLM Active
            </div>
          </div>

          {/* AI Next Best Action Widget */}
          <div className="p-4 border-b border-slate-700/50">
            {renderNextBestAction()}
          </div>

          {/* Insights */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sampleAIInsights.map(insight => (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${
                  insight.priority === 'high' ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50' :
                  insight.priority === 'medium' ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50' :
                  'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {insight.type === 'action' && <Target className="w-4 h-4 text-red-400" />}
                    {insight.type === 'opportunity' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                    {insight.type === 'tip' && <Lightbulb className="w-4 h-4 text-amber-400" />}
                    <span className={`text-xs font-medium ${
                      insight.priority === 'high' ? 'text-red-400' :
                      insight.priority === 'medium' ? 'text-amber-400' : 'text-blue-400'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                  {insight.metric && (
                    <span className="text-xs text-slate-400">{insight.metric}</span>
                  )}
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-slate-400 text-xs mb-3">{insight.description}</p>
                <button
                  className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    insight.actionType === 'campaign' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white' :
                    insight.actionType === 'followup' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white' :
                    insight.actionType === 'restock' ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900' :
                    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white'
                  }`}
                  onClick={() => {
                    if (insight.actionType === 'followup') {
                      const lead = leads.find(l => l.companyName.includes('Almarai'));
                      if (lead) handleLaunchAIFollowUp(lead);
                    } else if (insight.actionType === 'campaign') {
                      setActiveModule('inventory');
                    }
                  }}
                >
                  {insight.actionType === 'campaign' && <Zap className="w-3 h-3" />}
                  {insight.actionType === 'followup' && <Mail className="w-3 h-3" />}
                  {insight.actionType === 'restock' && <ShoppingCart className="w-3 h-3" />}
                  {insight.action}
                </button>
              </div>
            ))}
          </div>

          {/* Toggle Button */}
          <div className="p-4 border-t border-slate-700/50">
            <button
              onClick={() => setShowCoPilot(false)}
              className="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              Collapse Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Render Global Commodity Ticker
  const renderCommodityTicker = () => (
    <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 overflow-hidden">
      <div className="flex items-center">
        <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold text-xs flex items-center gap-2">
          <Activity className="w-3 h-3" />
          LIVE FMCG PRICES
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-8 py-2 animate-[scroll_30s_linear_infinite]">
            {[...sampleCommodityPrices, ...sampleCommodityPrices].map((commodity, idx) => (
              <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
                <span className="text-slate-400 text-xs font-mono">{commodity.symbol}</span>
                <span className="text-white text-sm font-semibold">{formatCurrency(commodity.price)}</span>
                <div className="flex items-center gap-1">
                  {commodity.change >= 0 ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${commodity.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {commodity.change >= 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Dashboard with Drag-and-Drop Kanban
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Sales Pipeline Section - Updated with Drag-and-Drop */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Sales Pipeline - AI-Powered Kanban</h2>
              <p className="text-slate-400 text-sm">Drag deals between stages • Moving to "Closing" triggers AI document generation</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-medium text-sm transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Deal
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['new', 'qualified', 'negotiation', 'closing'].map((stage) => {
              const stageDeals = deals.filter(d => d.stage === stage);
              const stageColors: Record<string, string> = {
                new: 'bg-blue-500',
                qualified: 'bg-amber-500',
                negotiation: 'bg-purple-500',
                closing: 'bg-emerald-500'
              };
              const stageLabels: Record<string, string> = {
                new: 'New Leads',
                qualified: 'Qualified',
                negotiation: 'Negotiation',
                closing: 'Closing'
              };
              return (
                <div
                  key={stage}
                  className={`bg-slate-700/30 rounded-xl p-4 min-h-64 border-2 border-dashed transition-all ${
                    draggedDeal ? 'border-amber-500/50' : 'border-transparent'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage as Deal['stage'])}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${stageColors[stage]}`} />
                    <span className="text-white font-semibold text-sm">{stageLabels[stage]}</span>
                    <span className="text-slate-400 text-xs">({stageDeals.length})</span>
                  </div>
                  <div className="space-y-3">
                    {stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal)}
                        className={`bg-slate-800/80 rounded-xl p-4 border border-slate-600/30 hover:border-amber-500/50 transition-all cursor-grab active:cursor-grabbing ${
                          draggedDeal?.id === deal.id ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-slate-500" />
                            <span className="text-white font-semibold text-sm">{deal.companyName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderDealScore(deal)}
                            <span className="text-emerald-400 font-bold text-sm">{formatCurrency(deal.dealValue)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span>{deal.products.length} products</span>
                          <span>{deal.probability}% likely</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStageChange(deal, stage as Deal['stage'])}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                              stage === 'closing'
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            {stage === 'closing' ? 'Reserve Stock' : 'Update'}
                          </button>
                          {stage === 'closing' && (
                            <button
                              onClick={() => handleCloseDeal(deal)}
                              className="flex-1 py-1.5 px-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-[#D4AF37] text-black font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                            >
                              <ReceiptIcon className="w-3 h-3" />
                              Close Deal
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        Drop deals here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+18.5%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatCurrency(totalRevenue)}</div>
          <div className="text-slate-400 text-sm">Total Revenue (YTD)</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl flex items-center justify-center">
              <Warehouse className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
              <Package className="w-4 h-4" />
              <span>{totalInventory.toLocaleString()} units</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatCurrency(totalStockValue)}</div>
          <div className="text-slate-400 text-sm">Inventory Value</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{sampleInvoices.filter(i => i.status === 'overdue').length} overdue</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatCurrency(pendingPayments)}</div>
          <div className="text-slate-400 text-sm">Pending Payments</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl flex items-center justify-center">
              <Ship className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <Truck className="w-4 h-4" />
              <span>{activeShipments} active</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{sampleShipments.length}</div>
          <div className="text-slate-400 text-sm">Total Shipments</div>
        </div>
      </div>

      {/* Cash Flow */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Cash Flow Overview</h2>
            <p className="text-slate-400 text-sm">Income, expenses, and net cash flow</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-medium text-sm transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-emerald-400 text-sm font-medium">Money In</div>
                  <div className="text-slate-400 text-xs">This Month</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                {formatCurrency(sampleTransactions.filter(t => t.type === 'payment_in' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>

            <div className="p-5 bg-red-500/10 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-red-400 text-sm font-medium">Money Out</div>
                  <div className="text-slate-400 text-xs">This Month</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {formatCurrency(sampleTransactions.filter(t => (t.type === 'payment_out' || t.type === 'expense') && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>

            <div className="p-5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-amber-400 text-sm font-medium">Net Cash Flow</div>
                  <div className="text-slate-400 text-xs">This Month</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {formatCurrency(
                  sampleTransactions.filter(t => t.type === 'payment_in' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0) -
                  sampleTransactions.filter(t => (t.type === 'payment_out' || t.type === 'expense') && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Handle stage change
  const handleStageChange = (deal: Deal, newStage: Deal['stage']) => {
    const updatedDeals = deals.map(d => d.id === deal.id ? { ...d, stage: newStage } : d);
    setDeals(updatedDeals);

    if (newStage === 'closing') {
      setSelectedDealForReserve(deal);
      setShowClosingModal(true);
    }
  };

  // Render AI Lead Hub (CRM) Module
  const renderCRM = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Lead Hub</h1>
          <p className="text-slate-400">Smart lead scoring powered by Brands Bridge AI Core</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">Total Leads</div>
          <div className="text-2xl font-bold text-white">{leads.length}</div>
        </div>
        <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-4">
          <div className="text-emerald-400 text-sm mb-1">Hot Leads (80+)</div>
          <div className="text-2xl font-bold text-emerald-400">{leads.filter(l => l.score >= 80).length}</div>
        </div>
        <div className="bg-amber-500/10 rounded-xl border border-amber-500/20 p-4">
          <div className="text-amber-400 text-sm mb-1">Warm Leads (60-79)</div>
          <div className="text-2xl font-bold text-amber-400">{leads.filter(l => l.score >= 60 && l.score < 80).length}</div>
        </div>
        <div className="bg-slate-500/10 rounded-xl border border-slate-500/20 p-4">
          <div className="text-slate-400 text-sm mb-1">Cold Leads (&lt;60)</div>
          <div className="text-2xl font-bold text-slate-400">{leads.filter(l => l.score < 60).length}</div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">All Leads with Smart Scoring</h2>
          <p className="text-slate-400 text-sm mt-1">Hover over scores to see breakdown • AI agents ready to follow up</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Contact</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Score</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Products</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Regions</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Last Activity</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{lead.companyName}</div>
                        <div className="text-slate-400 text-xs flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {lead.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-white text-sm">{lead.contactName}</div>
                    <div className="text-slate-400 text-xs">{lead.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    {renderLeadScore(lead)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {lead.products.slice(0, 2).map((product, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-300">
                          {product}
                        </span>
                      ))}
                      {lead.products.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">
                          +{lead.products.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {lead.exportRegions.map((region, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {region}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-300 text-sm">{lead.lastActivity}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleLaunchAIFollowUp(lead)}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                      >
                        <PenLine className="w-3 h-3" />
                        Launch AI Follow-up
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
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
  );

  // Render AI Agents Module
  const renderAIAgents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Agents</h1>
          <p className="text-slate-400">Powered by Brands Bridge AI Core • Custom LLM</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create AI Agent
        </button>
      </div>

      {/* AI Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Email Writer Agent */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl border border-purple-500/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-white font-bold">Email Writer Agent</div>
              <div className="text-purple-400 text-xs">Drafts personalized emails</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Analyzes lead data and company products to generate compelling, personalized outreach emails.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs">Active</span>
            </div>
            <button className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition-colors">
              Configure
            </button>
          </div>
        </div>

        {/* Follow-up Agent */}
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl border border-amber-500/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-white font-bold">Follow-up Agent</div>
              <div className="text-amber-400 text-xs">Auto-follows on leads</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Monitors lead engagement and automatically triggers follow-up sequences based on behavior.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs">Active</span>
            </div>
            <button className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/30 transition-colors">
              Configure
            </button>
          </div>
        </div>

        {/* Invoice Generator Agent */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl border border-emerald-500/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-white font-bold">Invoice Generator</div>
              <div className="text-emerald-400 text-xs">Creates export documents</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Automatically generates Commercial Invoices, Packing Lists, and Certificates of Origin.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs">Active</span>
            </div>
            <button className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors">
              Configure
            </button>
          </div>
        </div>

        {/* Inventory Monitor Agent */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl border border-blue-500/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold">Inventory Monitor</div>
              <div className="text-blue-400 text-xs">Tracks stock levels</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Alerts on low stock, expiring products, and suggests optimal reorder points based on deal pipeline.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs">Active</span>
            </div>
            <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-colors">
              Configure
            </button>
          </div>
        </div>

        {/* Lead Scoring Agent */}
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-2xl border border-red-500/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-white font-bold">Lead Scoring Agent</div>
              <div className="text-red-400 text-xs">Scores & ranks leads</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Uses engagement, market fit, and trust signals to score and prioritize leads automatically.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs">Active</span>
            </div>
            <button className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors">
              Configure
            </button>
          </div>
        </div>

        {/* Market Intelligence Agent */}
        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-2xl border border-cyan-500/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-bold">Market Intel Agent</div>
              <div className="text-cyan-400 text-xs">Analyzes commodity prices</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Tracks commodity prices and provides buying recommendations based on market trends.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs">Active</span>
            </div>
            <button className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 transition-colors">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Inventory Module
  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product & Inventory</h1>
          <p className="text-slate-400">Manage SKUs, stock levels, and batch tracking</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-medium text-sm transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Smart Filters */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 text-sm font-medium">Smart Filters:</span>
          </div>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Warehouses</option>
            <option value="Istanbul">Istanbul WH</option>
            <option value="Izmir">Izmir WH</option>
            <option value="Ankara">Ankara WH</option>
          </select>

          <select
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Expiry Dates</option>
            <option value="expiring_30">Expiring in 30 days</option>
            <option value="expiring_60">Expiring in 60 days</option>
            <option value="expiring_90">Expiring in 90 days</option>
          </select>

          <select className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500">
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>

          <div className="ml-auto flex items-center gap-2 text-sm text-slate-400">
            <span>{filteredSKUs.length} products found</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">Total SKUs</div>
          <div className="text-2xl font-bold text-white">{filteredSKUs.length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">Available Stock</div>
          <div className="text-2xl font-bold text-white">{filteredSKUs.reduce((sum, s) => sum + (s.stock - s.reservedStock), 0).toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">Reserved Stock</div>
          <div className="text-2xl font-bold text-amber-400">{filteredSKUs.reduce((sum, s) => sum + s.reservedStock, 0).toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">Low Stock Alerts</div>
          <div className="text-2xl font-bold text-red-400">{lowStockItems + expiringItems}</div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">All Products</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 text-sm w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">SKU</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Stock / Reserved</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Warehouse</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Batch</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Expiry</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredSKUs.map(sku => (
                <tr key={sku.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{sku.name}</div>
                        <div className="text-slate-400 text-xs">{formatCurrency(sku.sellPrice)} / {sku.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-300 text-sm font-mono">{sku.sku}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${sku.stock - sku.reservedStock < 200 ? 'text-red-400' : 'text-white'}`}>
                        {(sku.stock - sku.reservedStock).toLocaleString()}
                      </span>
                      {sku.reservedStock > 0 && (
                        <span className="text-amber-400 text-xs">({sku.reservedStock} reserved)</span>
                      )}
                      <span className="text-slate-500 text-xs">{sku.unit}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-300 text-sm">{sku.warehouse}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-300 text-sm font-mono">{sku.batchNumber}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <span className={`text-sm ${getDaysUntilExpiry(sku.expiryDate) < 60 ? 'text-orange-400' : 'text-slate-300'}`}>
                        {formatDate(sku.expiryDate)}
                      </span>
                      <div className="text-slate-500 text-xs">{getDaysUntilExpiry(sku.expiryDate)} days</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(sku.status)}`}>
                      {sku.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors" title="Reserve Stock">
                        <PackageCheck className="w-4 h-4" />
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
  );

  // Render Finance Module
  const renderFinance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart Finance Suite</h1>
          <p className="text-slate-400">Generate invoices and track payments</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-medium text-sm transition-all flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'invoices'
              ? 'text-amber-400 border-amber-400'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Proforma Invoices
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'text-amber-400 border-amber-400'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Payment Tracking
        </button>
      </div>

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <div className="text-slate-400 text-sm mb-1">Total Invoices</div>
              <div className="text-2xl font-bold text-white">{invoices.length}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <div className="text-slate-400 text-sm mb-1">Total Value</div>
              <div className="text-2xl font-bold text-amber-400">
                {formatCurrency(invoices.reduce((sum, i) => sum + i.amount, 0))}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <div className="text-slate-400 text-sm mb-1">Paid</div>
              <div className="text-2xl font-bold text-emerald-400">
                {formatCurrency(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0))}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <div className="text-slate-400 text-sm mb-1">Outstanding</div>
              <div className="text-2xl font-bold text-amber-400">
                {formatCurrency(invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Invoice #</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Customer</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Issue Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Due Date</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {invoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-amber-400 font-mono font-medium">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-500" />
                          <div>
                            <div className="text-white font-medium">{invoice.customerName}</div>
                            <div className="text-slate-400 text-xs">{invoice.customerCountry}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-white font-bold">{formatCurrency(invoice.amount, invoice.currency)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-300 text-sm">{formatDate(invoice.issueDate)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-sm ${invoice.status === 'overdue' ? 'text-red-400' : 'text-slate-300'}`}>
                          {formatDate(invoice.dueDate)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleGenerateDocs(invoice)}
                            className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                          >
                            <FileSpreadsheet className="w-3 h-3" />
                            Export Docs
                          </button>
                          {invoice.status === 'draft' && (
                            <button className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/30 transition-colors flex items-center gap-1">
                              <SendHorizontal className="w-3 h-3" />
                              Send
                            </button>
                          )}
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

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-emerald-400 font-medium">Payments Received</div>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                {formatCurrency(sampleTransactions.filter(t => t.type === 'payment_in').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>
            <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-red-400 font-medium"> Payments Out</div>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {formatCurrency(sampleTransactions.filter(t => t.type === 'payment_out').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>
            <div className="bg-amber-500/10 rounded-xl border border-amber-500/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-amber-400 font-medium">Pending</div>
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {formatCurrency(sampleTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-5 border-b border-slate-700/50">
              <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-slate-700/50">
              {sampleTransactions.map(transaction => (
                <div key={transaction.id} className="p-5 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'payment_in' ? 'bg-emerald-500/20' :
                      transaction.type === 'payment_out' ? 'bg-red-500/20' : 'bg-amber-500/20'
                    }`}>
                      {transaction.type === 'payment_in' ? (
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{transaction.description}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{formatDate(transaction.date)}</span>
                        <span>•</span>
                        <span>{transaction.method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${transaction.type === 'payment_in' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {transaction.type === 'payment_in' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render Export Module
  const renderExports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Export Log Center</h1>
          <p className="text-slate-400">Track shipments, logistics, and documents</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-medium text-sm transition-all flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Book Shipping
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">Active Shipments</div>
          <div className="text-2xl font-bold text-white">{sampleShipments.filter(s => s.status !== 'delivered').length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">In Transit</div>
          <div className="text-2xl font-bold text-blue-400">{sampleShipments.filter(s => s.status === 'in_transit').length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">At Customs</div>
          <div className="text-2xl font-bold text-purple-400">{sampleShipments.filter(s => s.status === 'customs').length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="text-slate-400 text-sm mb-1">Delivered</div>
          <div className="text-2xl font-bold text-emerald-400">{sampleShipments.filter(s => s.status === 'delivered').length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {sampleShipments.map(shipment => (
          <div key={shipment.id} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  shipment.freightType === 'sea' ? 'bg-blue-500/20' :
                  shipment.freightType === 'air' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                }`}>
                  {shipment.freightType === 'sea' ? (
                    <Ship className="w-6 h-6 text-blue-400" />
                  ) : shipment.freightType === 'air' ? (
                    <Plane className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Truck className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{shipment.trackingNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm">
                    {shipment.customerName} • {shipment.containerType}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-slate-400 text-xs">ETA</div>
                  <div className="text-white font-medium">{formatDate(shipment.eta)}</div>
                </div>
                <button className="p-2 bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-400 text-xs">Origin</div>
                    <div className="text-white text-sm">{shipment.origin}</div>
                  </div>
                </div>
                <div className="flex-1 flex items-center px-4">
                  <div className="h-px bg-slate-600 flex-1" />
                  <div className="px-4">
                    <Ship className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="h-px bg-slate-600 flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-slate-400 text-xs">Destination</div>
                    <div className="text-white text-sm">{shipment.destination}</div>
                  </div>
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-slate-400" />
                Shipping Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {shipment.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-white text-sm">{doc.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Unified Supplier Sidebar */}
      <SupplierSidebar activePage="crb" />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Commodity Ticker */}
        {renderCommodityTicker()}

        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, invoices, shipments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCoPilot(true)}
              className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              AI Co-Pilot
            </button>
            <button className="relative p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold">
                SA
              </div>
              <div className="hidden md:block">
                <div className="text-white font-medium text-sm">Sales Agent</div>
                <div className="text-slate-400 text-xs">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeModule === 'dashboard' && renderDashboard()}
          {activeModule === 'inventory' && renderInventory()}
          {activeModule === 'crm' && renderCRM()}
          {activeModule === 'agents' && renderAIAgents()}
          {activeModule === 'finance' && renderFinance()}
          {activeModule === 'exports' && renderExports()}
          {activeModule === 'settings' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Settings className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Settings</h2>
                <p className="text-slate-400">Configuration options coming soon</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Co-Pilot Sidebar */}
      {renderCoPilot()}

      {/* Closing Modal - AI Task Popup */}
      {showClosingModal && selectedDealForReserve && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-purple-500/50 w-full max-w-2xl p-6 shadow-2xl shadow-purple-500/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">AI Task: Sales to CRB Hub</h3>
                  <p className="text-purple-400 text-sm">Auto-triggered on deal move to Closing</p>
                </div>
              </div>
              <button
                onClick={() => setShowClosingModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Deal Summary */}
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/30 p-4 mb-6">
              <div className="text-white font-semibold mb-2">
                Deal: {selectedDealForReserve.companyName}
              </div>
              <div className="text-slate-400 text-sm flex items-center gap-4">
                <span>Value: {formatCurrency(selectedDealForReserve.dealValue)}</span>
                <span>Probability: {selectedDealForReserve.probability}%</span>
              </div>
            </div>

            {/* Inventory Check Section */}
            <div className="bg-slate-700/30 rounded-xl border border-slate-600/30 p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-semibold">Inventory Check</span>
                <span className="text-xs text-slate-400 bg-slate-600/50 px-2 py-0.5 rounded">Auto-verified</span>
              </div>
              <div className="space-y-3">
                {selectedDealForReserve.products.map((product, idx) => {
                  const skuItem = skus.find(s => s.sku === product.sku);
                  const availableStock = skuItem ? skuItem.stock - skuItem.reservedStock : 0;
                  const isAvailable = availableStock >= product.quantity;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {isAvailable ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <div className="text-white font-medium text-sm">{product.name}</div>
                          <div className="text-slate-400 text-xs">SKU: {product.sku}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-sm ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                          {availableStock.toLocaleString()} / {product.quantity.toLocaleString()} units
                        </div>
                        <div className={`text-xs ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isAvailable ? 'In Stock' : 'Insufficient'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proforma Invoice Preview */}
            <div className="bg-slate-700/30 rounded-xl border border-slate-600/30 p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="text-white font-semibold">Proforma Invoice Preview</span>
                <span className="text-xs text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Auto-generated</span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm">Invoice Number:</span>
                  <span className="text-amber-400 font-mono font-medium">PI-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm">Customer:</span>
                  <span className="text-white font-medium">{selectedDealForReserve.companyName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Amount:</span>
                  <span className="text-emerald-400 font-bold text-lg">{formatCurrency(selectedDealForReserve.dealValue)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowClosingModal(false)}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Reserve stock
                  handleReserveStock(selectedDealForReserve);
                  // Auto-generate Proforma Invoice
                  const newInvoice: Invoice = {
                    id: (invoices.length + 1).toString(),
                    invoiceNumber: `PI-${Date.now().toString().slice(-6)}`,
                    customerName: selectedDealForReserve.companyName,
                    customerCountry: 'International',
                    amount: selectedDealForReserve.dealValue,
                    currency: 'USD',
                    status: 'draft',
                    issueDate: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    items: selectedDealForReserve.products.map(p => ({
                      name: p.name,
                      quantity: p.quantity,
                      price: selectedDealForReserve.dealValue / selectedDealForReserve.products.reduce((sum, prod) => sum + prod.quantity, 0) * p.quantity,
                      sku: p.sku
                    })),
                    dealId: selectedDealForReserve.id
                  };
                  setInvoices(prev => [newInvoice, ...prev]);
                  setAiMessages(prev => [...prev,
                    { role: 'ai', content: `Proforma Invoice ${newInvoice.invoiceNumber} auto-generated for ${selectedDealForReserve.companyName}. Stock reserved for all ${selectedDealForReserve.products.length} products.` }
                  ]);
                  setShowClosingModal(false);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Confirm & Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Email Draft Modal */}
      {showEmailModal && selectedLeadForEmail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-purple-500/50 w-full max-w-2xl p-6 shadow-2xl shadow-purple-500/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <PenLine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">AI Email Draft</h3>
                  <p className="text-purple-400 text-sm">Powered by Brands Bridge AI Core</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isDraftingEmail ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                <div className="text-white font-semibold">AI is drafting your email...</div>
                <div className="text-slate-400 text-sm mt-2">Analyzing {selectedLeadForEmail.companyName}'s profile</div>
              </div>
            ) : (
              <>
                <div className="bg-slate-700/30 rounded-xl p-3 mb-4">
                  <div className="text-slate-400 text-xs mb-1">Recipient</div>
                  <div className="text-white font-medium">{selectedLeadForEmail.contactName}</div>
                  <div className="text-slate-400 text-sm">{selectedLeadForEmail.email}</div>
                </div>

                <div className="mb-4">
                  <textarea
                    value={draftedEmail}
                    onChange={(e) => setDraftedEmail(e.target.value)}
                    className="w-full h-80 bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 text-white text-sm resize-none focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowEmailModal(false);
                      setAiMessages(prev => [...prev,
                        { role: 'ai', content: `Email draft sent to ${selectedLeadForEmail.contactName} at ${selectedLeadForEmail.companyName}. AI will track engagement and trigger follow-up if no response in 48 hours.` }
                      ]);
                      setShowAIChat(true);
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Email
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reserve Stock Modal */}
      {showReserveStockModal && selectedDealForReserve && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <PackageCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Reserve Stock</h3>
                  <p className="text-slate-400 text-sm">Deal: {selectedDealForReserve.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowReserveStockModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="text-slate-300 text-sm mb-2">Products to reserve for this deal:</div>
              {selectedDealForReserve.products.map((product, idx) => {
                const skuItem = skus.find(s => s.sku === product.sku);
                return (
                  <div key={idx} className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{product.name}</span>
                      <span className="text-emerald-400 font-bold">{product.quantity.toLocaleString()} units</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Available: {skuItem ? (skuItem.stock - skuItem.reservedStock).toLocaleString() : 'N/A'}</span>
                      {skuItem && product.quantity > (skuItem.stock - skuItem.reservedStock) && (
                        <span className="text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Insufficient stock
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReserveStockModal(false)}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReserveStock(selectedDealForReserve)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Reserve Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Docs Modal */}
      {showExportDocsModal && selectedInvoiceForDocs && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">One-Click Export Docs</h3>
                  <p className="text-slate-400 text-sm">Invoice: {selectedInvoiceForDocs.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportDocsModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="text-slate-300 text-sm mb-2">Select documents to generate:</div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Commercial Invoice</div>
                      <div className="text-slate-400 text-xs">Official invoice for customs clearance</div>
                    </div>
                  </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Packing List</div>
                      <div className="text-slate-400 text-xs">Detailed list of packed items</div>
                    </div>
                  </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Certificate of Origin</div>
                      <div className="text-slate-400 text-xs">Proves country of manufacture</div>
                    </div>
                  </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Ship className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Bill of Lading</div>
                      <div className="text-slate-400 text-xs">Shipping contract document</div>
                    </div>
                  </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExportDocsModal(false)}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExportDocsModal(false);
                  setAiMessages(prev => [...prev,
                    { role: 'ai', content: `Documents generated for ${selectedInvoiceForDocs.invoiceNumber}! Commercial Invoice and Packing List are ready for download.` }
                  ]);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Generate & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      {showAIChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">AI Business Partner</div>
                <div className="text-purple-200 text-xs">Powered by Brands Bridge AI Core</div>
              </div>
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.map((message, idx) => (
              <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-amber-500 text-slate-900 rounded-br-md'
                    : 'bg-slate-700 text-white rounded-bl-md'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask your AI partner..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiInput.trim()) {
                    setAiMessages(prev => [...prev, { role: 'user', content: aiInput }, { role: 'ai', content: `I understand you need help with "${aiInput}". Let me analyze your data and provide insights powered by Brands Bridge AI Core.` }]);
                    setAiInput('');
                  }
                }}
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button className="p-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!showAIChat && (
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <SparklesIcon className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default CRBHub;
