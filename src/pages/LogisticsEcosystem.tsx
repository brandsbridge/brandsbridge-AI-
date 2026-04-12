import { useState, useEffect } from 'react';
import {
  Ship,
  Truck,
  Plane,
  Anchor,
  Package,
  MapPin,
  Globe,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  FileText,
  Download,
  Send,
  Eye,
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Users,
  Building2,
  Briefcase,
  Sparkles,
  Box,
  Weight,
  Ruler,
  Zap,
  Target,
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Filter,
  MoreHorizontal,
  ClipboardCheck,
  Cpu,
  Bot,
  LayoutDashboard,
  Warehouse,
  Wallet,
  MessageSquare,
  SparklesIcon,
  Percent,
  Maximize2,
  Layers,
  Container as ContainerIcon,
  Scale,
  Timer,
  Edit,
  Trash2,
  Shield
} from 'lucide-react';
import SupplierSidebar from '../components/SupplierSidebar';

// ============================================
// DATA TYPES
// ============================================

interface ShippingRoute {
  id: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  transitDays: number;
  frequency: string;
  price20ft: number;
  price40ft: number;
}

interface ContainerType {
  id: string;
  name: string;
  code: string;
  capacity: number;
  maxWeight: number;
  description: string;
  available: boolean;
}

interface ShippingCompany {
  id: string;
  name: string;
  logo: string;
  country: string;
  headquarters: string;
  vessels: number;
  containers: number;
  reliabilityScore: number;
  rating: number;
  partneredWith: string;
  routes: ShippingRoute[];
  containerTypes: ContainerType[];
  certifications: string[];
  description: string;
}

interface FreightRequest {
  id: string;
  requestNumber: string;
  exporterName: string;
  origin: string;
  destination: string;
  cargoType: string;
  volume: number;
  weight: number;
  containerType: string;
  preferredDate: string;
  status: 'new' | 'quoted' | 'awarded' | 'shipped';
  createdAt: string;
}

interface FreightQuote {
  id: string;
  requestId: string;
  carrierName: string;
  price: number;
  currency: string;
  incoterm: 'FOB' | 'CIF' | 'CFR' | 'EXW';
  transitDays: number;
  validUntil: string;
  status: 'submitted' | 'accepted' | 'rejected';
  submittedAt: string;
}

interface ActiveShipment {
  id: string;
  shipmentId: string;
  carrierName: string;
  vesselName: string;
  origin: string;
  destination: string;
  containerNumbers: string[];
  departureDate: string;
  eta: string;
  status: 'loading' | 'in_transit' | 'customs' | 'delivered';
  cargoDescription: string;
  currentPosition?: string;
}

interface CargoItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  palletCount: number;
  volumePerUnit: number;
  weightPerUnit: number;
  totalVolume: number;
  totalWeight: number;
}

interface ContainerLoad {
  containerType: '20ft' | '40ft' | '40ft HC';
  maxVolume: number;
  maxWeight: number;
  usedVolume: number;
  usedWeight: number;
  utilizationPercent: number;
  items: CargoItem[];
  isOptimized: boolean;
}

// ============================================
// SAMPLE DATA
// ============================================

const sampleShippingCompanies: ShippingCompany[] = [
  {
    id: '1',
    name: 'Apex Global Logistics',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Maersk_Group_Logo.svg/200px-Maersk_Group_Logo.svg.png',
    country: 'UAE',
    headquarters: 'Dubai',
    vessels: 708,
    containers: 4300000,
    reliabilityScore: 97,
    rating: 4.8,
    partneredWith: 'Partnered with: Maersk & MSC',
    description: 'A trusted freight forwarder offering comprehensive logistics solutions across Middle East, Europe, and Asia with guaranteed competitive rates.',
    routes: [
      { id: 'r1', origin: 'Istanbul', originCode: 'IST', destination: 'Dubai', destinationCode: 'DXB', transitDays: 12, frequency: 'Weekly', price20ft: 1800, price40ft: 3200 },
      { id: 'r2', origin: 'Istanbul', originCode: 'IST', destination: 'Mumbai', destinationCode: 'BOM', transitDays: 18, frequency: 'Bi-weekly', price20ft: 2200, price40ft: 4000 },
      { id: 'r3', origin: 'Izmir', originCode: 'IZM', destination: 'Jeddah', destinationCode: 'JED', transitDays: 10, frequency: 'Weekly', price20ft: 1500, price40ft: 2700 },
    ],
    containerTypes: [
      { id: 'c1', name: 'Standard Dry 20ft', code: '20DC', capacity: 33.2, maxWeight: 28000, description: 'Standard dry container for general cargo', available: true },
      { id: 'c2', name: 'Standard Dry 40ft', code: '40DC', capacity: 67.7, maxWeight: 30480, description: 'Standard dry container for high volume cargo', available: true },
      { id: 'c3', name: 'High Cube 40ft', code: '40HC', capacity: 76.4, maxWeight: 30480, description: 'Extra height for voluminous cargo', available: true },
      { id: 'c4', name: 'Reefer 20ft', code: '20RF', capacity: 28.3, maxWeight: 27500, description: 'Temperature controlled for perishable goods', available: true },
      { id: 'c5', name: 'Reefer 40ft', code: '40RF', capacity: 59.3, maxWeight: 29500, description: 'High capacity temperature controlled', available: true },
    ],
    certifications: ['ISO 9001', 'ISO 14001', 'FIATA Certified', 'AEO Certified', 'IATA Approved']
  },
  {
    id: '2',
    name: 'Crescent Freight Solutions',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/MSC_logo.svg/200px-MSC_logo.svg.png',
    country: 'Turkey',
    headquarters: 'Istanbul',
    vessels: 560,
    containers: 2800000,
    reliabilityScore: 95,
    rating: 4.7,
    partneredWith: 'Partnered with: MSC & Hapag-Lloyd',
    description: 'Specialized in Mediterranean and Black Sea trade routes with 15+ years of experience serving FMCG exporters.',
    routes: [
      { id: 'r4', origin: 'Istanbul', originCode: 'IST', destination: 'Alexandria', destinationCode: 'ALY', transitDays: 5, frequency: 'Weekly', price20ft: 950, price40ft: 1700 },
      { id: 'r5', origin: 'Mersin', originCode: 'MER', destination: 'Port Said', destinationCode: 'PSD', transitDays: 4, frequency: 'Weekly', price20ft: 850, price40ft: 1500 },
    ],
    containerTypes: [
      { id: 'c6', name: 'Standard Dry 20ft', code: '20DC', capacity: 33.2, maxWeight: 28000, description: 'Standard dry container', available: true },
      { id: 'c7', name: 'Standard Dry 40ft', code: '40DC', capacity: 67.7, maxWeight: 30480, description: 'Standard dry container', available: true },
      { id: 'c8', name: 'Reefer 40ft', code: '40RF', capacity: 59.3, maxWeight: 29500, description: 'Temperature controlled', available: true },
    ],
    certifications: ['ISO 9001', 'ISM Code', 'TAPA FSR', 'C-TPAT Member']
  },
  {
    id: '3',
    name: 'Atlas Trade Logistics',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Hapag-Lloyd_AG_Logo.svg/200px-Hapag-Lloyd_AG_Logo.svg.png',
    country: 'Germany',
    headquarters: 'Hamburg',
    vessels: 253,
    containers: 1700000,
    reliabilityScore: 96,
    rating: 4.6,
    partneredWith: 'Partnered with: Hapag-Lloyd & ONE Line',
    description: 'European-based freight forwarder specializing in cross-border trade with extensive customs clearance expertise.',
    routes: [
      { id: 'r6', origin: 'Istanbul', originCode: 'IST', destination: 'Rotterdam', destinationCode: 'RTM', transitDays: 14, frequency: 'Weekly', price20ft: 2100, price40ft: 3800 },
      { id: 'r7', origin: 'Istanbul', originCode: 'IST', destination: 'Hamburg', destinationCode: 'HAM', transitDays: 15, frequency: 'Weekly', price20ft: 2200, price40ft: 4000 },
    ],
    containerTypes: [
      { id: 'c9', name: 'Standard Dry 20ft', code: '20DC', capacity: 33.2, maxWeight: 28000, description: 'Standard dry container', available: true },
      { id: 'c10', name: 'High Cube 40ft', code: '40HC', capacity: 76.4, maxWeight: 30480, description: 'Extra height container', available: true },
    ],
    certifications: ['ISO 9001', 'ISO 14001', 'ISM Code', 'AEO Certified', 'GDP Compliant']
  }
];

const sampleFreightRequests: FreightRequest[] = [
  { id: '1', requestNumber: 'FR-2024-0891', exporterName: 'Mediterranean Foods Export', origin: 'Istanbul, Turkey', destination: 'Dubai, UAE', cargoType: 'Olive Oil & Tahini', volume: 45, weight: 28000, containerType: '40ft HC Reefer', preferredDate: '2024-02-15', status: 'new', createdAt: '2024-01-28' },
  { id: '2', requestNumber: 'FR-2024-0890', exporterName: 'Anatolia Beverages', origin: 'Izmir, Turkey', destination: 'Jeddah, Saudi Arabia', cargoType: 'UHT Milk Products', volume: 55, weight: 35000, containerType: '40ft Reefer', preferredDate: '2024-02-20', status: 'new', createdAt: '2024-01-27' },
  { id: '3', requestNumber: 'FR-2024-0889', exporterName: 'Aegean Confectionery', origin: 'Mersin, Turkey', destination: 'Alexandria, Egypt', cargoType: 'Chocolate Products', volume: 30, weight: 18000, containerType: '20ft Dry', preferredDate: '2024-02-10', status: 'quoted', createdAt: '2024-01-25' },
  { id: '4', requestNumber: 'FR-2024-0888', exporterName: 'Black Sea Grains', origin: 'Istanbul, Turkey', destination: 'Mumbai, India', cargoType: 'Canned Tomatoes', volume: 65, weight: 42000, containerType: '40ft Dry', preferredDate: '2024-02-25', status: 'new', createdAt: '2024-01-29' },
];

const sampleFreightQuotes: FreightQuote[] = [
  { id: 'q1', requestId: '3', carrierName: 'MSC Mediterranean', price: 2450, currency: 'USD', incoterm: 'CIF', transitDays: 5, validUntil: '2024-02-05', status: 'submitted', submittedAt: '2024-01-26' },
  { id: 'q2', requestId: '3', carrierName: 'Maersk Line', price: 2650, currency: 'USD', incoterm: 'FOB', transitDays: 6, validUntil: '2024-02-07', status: 'submitted', submittedAt: '2024-01-26' },
];

const sampleActiveShipments: ActiveShipment[] = [
  { id: '1', shipmentId: 'MSC-SHP-2024-4521', carrierName: 'MSC Mediterranean', vesselName: 'MSC Gülsün', origin: 'Istanbul', destination: 'Dubai', containerNumbers: ['MSCU1234567', 'MSCU1234568'], departureDate: '2024-01-20', eta: '2024-02-02', status: 'in_transit', cargoDescription: 'Premium Olive Oil 20 pallets', currentPosition: 'Suez Canal' },
  { id: '2', shipmentId: 'MAE-SHP-2024-8921', carrierName: 'Maersk Line', vesselName: 'Maersk Elba', origin: 'Izmir', destination: 'Mumbai', containerNumbers: ['MAEU9876543'], departureDate: '2024-01-15', eta: '2024-02-08', status: 'customs', cargoDescription: 'UHT Milk Products 15 pallets' },
  { id: '3', shipmentId: 'HAP-SHP-2024-3341', carrierName: 'Hapag-Lloyd', vesselName: 'Hamburg Express', origin: 'Istanbul', destination: 'Rotterdam', containerNumbers: ['HLCU5555555', 'HLCU5555556', 'HLCU5555557'], departureDate: '2024-01-10', eta: '2024-01-28', status: 'delivered', cargoDescription: 'Turkish Spreads 35 pallets' },
];

const sampleCargoItems: CargoItem[] = [
  { id: '1', name: 'Premium Olive Oil 1L', category: 'Oils', quantity: 5000, palletCount: 20, volumePerUnit: 0.001, weightPerUnit: 1.05, totalVolume: 5, totalWeight: 5250 },
  { id: '2', name: 'Tahini Paste 1kg', category: 'Spreads', quantity: 3000, palletCount: 15, volumePerUnit: 0.001, weightPerUnit: 1.1, totalVolume: 3, totalWeight: 3300 },
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
    case 'new': case 'loading': return 'bg-blue-500/20 text-blue-400';
    case 'quoted': case 'submitted': case 'in_transit': return 'bg-amber-500/20 text-amber-400';
    case 'awarded': case 'accepted': case 'customs': return 'bg-purple-500/20 text-purple-400';
    case 'shipped': case 'delivered': return 'bg-emerald-500/20 text-emerald-400';
    case 'rejected': return 'bg-red-500/20 text-red-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 95) return 'text-emerald-400';
  if (score >= 85) return 'text-amber-400';
  return 'text-red-400';
};

// ============================================
// MAIN COMPONENT
// ============================================

const LogisticsEcosystem = () => {
  const [activeView, setActiveView] = useState<'marketplace' | 'carrier' | 'exporter'>('marketplace');
  const [selectedCompany, setSelectedCompany] = useState<ShippingCompany | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showCargoOptimizer, setShowCargoOptimizer] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<'20ft' | '40ft' | '40ft HC'>('40ft HC');
  const [cargoItems, setCargoItems] = useState<CargoItem[]>(sampleCargoItems);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [freightRequests, setFreightRequests] = useState<FreightRequest[]>(sampleFreightRequests);
  const [freightQuotes] = useState<FreightQuote[]>(sampleFreightQuotes);
  const [activeShipments] = useState<ActiveShipment[]>(sampleActiveShipments);
  const [draggedRequest, setDraggedRequest] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Welcome to the Logistics Hub! I can help you find shipping companies, compare rates, and optimize your cargo loading. What do you need today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [hoveredScore, setHoveredScore] = useState<string | null>(null);

  // Calculate container load
  const containerSpecs = {
    '20ft': { maxVolume: 33.2, maxWeight: 28000, name: '20ft Standard' },
    '40ft': { maxVolume: 67.7, maxWeight: 30480, name: '40ft Standard' },
    '40ft HC': { maxVolume: 76.4, maxWeight: 30480, name: '40ft High Cube' }
  };

  const totalVolume = cargoItems.reduce((sum, item) => sum + item.totalVolume, 0);
  const totalWeight = cargoItems.reduce((sum, item) => sum + item.totalWeight, 0);
  const currentContainer = containerSpecs[selectedContainer];
  const utilizationPercent = Math.round((totalVolume / currentContainer.maxVolume) * 100);
  const emptyPercent = 100 - utilizationPercent;
  const isOptimized = utilizationPercent >= 85 && utilizationPercent <= 100;

  // AI suggestions
  const getAISuggestion = () => {
    if (utilizationPercent < 70) {
      return `Your container is ${emptyPercent}% empty! Consider adding ${Math.ceil((currentContainer.maxVolume * 0.9 - totalVolume) / 5)} more pallets of complementary products like Olive Oil or Spreads to maximize shipping cost efficiency.`;
    } else if (utilizationPercent >= 70 && utilizationPercent < 85) {
      return `Good utilization at ${utilizationPercent}%! You could optimize by adding ${Math.ceil((currentContainer.maxVolume * 0.95 - totalVolume) / 5)} more pallets to reach optimal 95% capacity.`;
    } else if (utilizationPercent >= 85 && utilizationPercent <= 100) {
      return `Excellent! Your container is optimally loaded at ${utilizationPercent}%. Weight utilization: ${Math.round((totalWeight / currentContainer.maxWeight) * 100)}%. Ready for booking!`;
    } else {
      return `Warning: Container is ${utilizationPercent}% full by volume. Consider upgrading to a larger container or reducing cargo to avoid overload fees.`;
    }
  };

  // Render Container Visual
  const renderContainerVisual = () => {
    const fillHeight = Math.min(utilizationPercent, 100);
    const isOverfilled = utilizationPercent > 100;

    return (
      <div className="relative">
        {/* Container 3D-ish Visual */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {/* Container Back */}
            <div className="absolute -left-2 -top-2 w-full h-full bg-slate-600/50 rounded-lg" />
            {/* Container Front */}
            <div className={`relative bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg border-4 ${isOverfilled ? 'border-red-500' : 'border-blue-400'} shadow-xl`} style={{ width: '320px', height: '280px' }}>
              {/* Container Door Pattern */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2 border-r border-blue-400/30" />
                <div className="w-1/2" />
              </div>
              {/* Container Door Handles */}
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2 w-3 h-8 bg-blue-300/50 rounded-sm" />
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-3 h-8 bg-blue-300/50 rounded-sm" />

              {/* Cargo Fill Visualization */}
              <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b">
                <div
                  className={`transition-all duration-700 ease-out ${
                    isOverfilled ? 'bg-red-500/60' : utilizationPercent >= 85 ? 'bg-emerald-500/60' : 'bg-amber-500/60'
                  }`}
                  style={{ height: `${fillHeight}%` }}
                >
                  {/* Cargo Boxes Pattern */}
                  <div className="h-full flex flex-wrap content-start p-2 gap-1">
                    {Array.from({ length: Math.min(Math.floor(fillHeight / 10), 8) }).map((_, i) => (
                      <div key={i} className="w-8 h-6 bg-slate-700/80 rounded-sm flex items-center justify-center">
                        <Package className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Container Label */}
              <div className="absolute top-2 left-2 bg-blue-800/80 px-2 py-1 rounded text-xs text-white font-bold">
                {selectedContainer}
              </div>

              {/* Utilization Badge */}
              <div className={`absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                isOverfilled ? 'bg-red-500 text-white' : utilizationPercent >= 85 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-900'
              }`}>
                {utilizationPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Container Specs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Ruler className="w-3 h-3" />
              Max Volume
            </div>
            <div className="text-white font-bold">{currentContainer.maxVolume} CBM</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Weight className="w-3 h-3" />
              Max Weight
            </div>
            <div className="text-white font-bold">{(currentContainer.maxWeight / 1000).toFixed(1)} tons</div>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Volume Used</span>
            <span className={`font-bold ${isOverfilled ? 'text-red-400' : utilizationPercent >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {totalVolume.toFixed(1)} / {currentContainer.maxVolume} CBM
            </span>
          </div>
          <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                isOverfilled ? 'bg-red-500' : utilizationPercent >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="h-px bg-slate-700/50 my-4" />

        {/* Weight Check */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Weight Used</span>
            <span className={`font-bold ${(totalWeight / currentContainer.maxWeight) > 0.9 ? 'text-red-400' : 'text-white'}`}>
              {(totalWeight / 1000).toFixed(1)} / {(currentContainer.maxWeight / 1000).toFixed(1)} tons ({(Math.round((totalWeight / currentContainer.maxWeight) * 100))}%)
            </span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full bg-blue-500`}
              style={{ width: `${Math.min((totalWeight / currentContainer.maxWeight) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render Marketplace View (Public Shipping Company Profiles)
  const renderMarketplace = () => (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900/50 via-slate-800/80 to-blue-800/50 rounded-2xl border border-blue-500/30 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Global Freight Forwarders Marketplace</h1>
            <p className="text-slate-400 text-lg max-w-2xl">Connect with KYB-verified freight forwarders. Compare rates, transit times, and AI reliability scores. Book your cargo space with escrow protection.</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">200+</div>
              <div className="text-slate-400 text-sm">Verified Forwarders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">2,500+</div>
              <div className="text-slate-400 text-sm">Active Routes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">97%</div>
              <div className="text-slate-400 text-sm">Avg. Reliability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-center gap-3">
        <Shield className="w-5 h-5 text-emerald-400" />
        <span className="text-emerald-300 font-medium">All shipments booked through Brands Bridge are protected by our Escrow Payment System.</span>
        <Shield className="w-5 h-5 text-emerald-400" />
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shipping companies, routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
            <option>All Regions</option>
            <option>Europe</option>
            <option>Middle East</option>
            <option>Asia</option>
            <option>Africa</option>
          </select>
          <select className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
            <option>All Container Types</option>
            <option>Reefer</option>
            <option>Dry</option>
            <option>High Cube</option>
          </select>
        </div>
      </div>

      {/* Shipping Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleShippingCompanies.map(company => (
          <div key={company.id} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all group">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-900/30 to-slate-800/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                    <Building2 className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-lg">{company.name}</h3>
                      {/* KYB Verified Badge */}
                      <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/40 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-blue-400 text-[10px] font-bold">KYB Verified</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Globe className="w-3 h-3" />
                      {company.country}
                    </div>
                    {/* Partnered With */}
                    <div className="text-blue-400/80 text-xs mt-1">{company.partneredWith}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold">{company.rating}</span>
                  </div>
                </div>
              </div>

              {/* AI Reliability Score with Tooltip */}
              <div
                className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3 cursor-help relative"
                onMouseEnter={() => setHoveredScore(company.id)}
                onMouseLeave={() => setHoveredScore(null)}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300 text-sm">AI Reliability</span>
                  <AlertTriangle className="w-4 h-4 text-slate-500" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(company.reliabilityScore)}`}>
                  {company.reliabilityScore}%
                </div>
                {/* Tooltip */}
                {hoveredScore === company.id && (
                  <div className="absolute top-full left-4 mt-2 z-50 bg-slate-900 border border-blue-500/50 rounded-xl p-3 shadow-xl min-w-64">
                    <div className="text-white font-semibold text-sm mb-2">Performance Breakdown</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">On-Time Delivery</span>
                        <span className="text-emerald-400 font-medium">98%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Document Accuracy</span>
                        <span className="text-emerald-400 font-medium">100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Response Time</span>
                        <span className="text-blue-400 font-medium">&lt;4 hrs</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700/50 text-[10px] text-slate-500">
                      Updated: Jan 2024 • Brands Bridge AI Core
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-xs mb-1">Fleet Size</div>
                  <div className="text-white font-semibold">{company.vessels} vessels</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Containers</div>
                  <div className="text-white font-semibold">{(company.containers / 1000000).toFixed(1)}M TEU</div>
                </div>
              </div>
            </div>

            {/* Routes */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="text-slate-400 text-sm mb-3 font-medium">Popular Routes</div>
              <div className="space-y-2">
                {company.routes.slice(0, 2).map(route => (
                  <div key={route.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">{route.originCode} → {route.destinationCode}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {route.transitDays}d
                      </div>
                      <span className="text-emerald-400 font-semibold text-sm">Est. ${route.price20ft}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 flex gap-3">
              <button
                onClick={() => setSelectedCompany(company)}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </button>
              <button className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4" />
                Request Custom Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Carrier Backend (Freight Bidding Dashboard)
  const renderCarrierBackend = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Freight Bidding Dashboard</h1>
          <p className="text-slate-400">Manage freight requests and submit competitive quotes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
            <Ship className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Carrier Mode</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">New Requests</span>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{freightRequests.filter(r => r.status === 'new').length}</div>
          <div className="text-slate-400 text-xs">Awaiting quotes</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Quotes Submitted</span>
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{freightQuotes.filter(q => q.status === 'submitted').length}</div>
          <div className="text-slate-400 text-xs">Active bids</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Active Shipments</span>
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Ship className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{activeShipments.filter(s => s.status !== 'delivered').length}</div>
          <div className="text-slate-400 text-xs">In progress</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Win Rate</span>
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-400">68%</div>
          <div className="text-slate-400 text-xs">Last 30 days</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">Procurement Pipeline</h2>
          <p className="text-slate-400 text-sm">Drag requests between stages to update status</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* New Freight Requests */}
            <div
              className="bg-slate-700/30 rounded-xl p-4 min-h-80 border-2 border-dashed border-blue-500/30"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {}}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-white font-semibold text-sm">New Requests</span>
                <span className="text-slate-400 text-xs">({freightRequests.filter(r => r.status === 'new').length})</span>
              </div>
              <div className="space-y-3">
                {freightRequests.filter(r => r.status === 'new').map(request => (
                  <div
                    key={request.id}
                    draggable
                    onDragStart={() => setDraggedRequest(request.id)}
                    className="bg-slate-800/80 rounded-xl p-4 border border-slate-600/30 hover:border-blue-500/50 transition-all cursor-grab"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 font-mono font-medium text-sm">{request.requestNumber}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{request.containerType}</span>
                    </div>
                    <div className="text-white font-medium text-sm mb-1">{request.exporterName}</div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                      <MapPin className="w-3 h-3" />
                      {request.origin} → {request.destination}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{request.cargoType}</span>
                      <span className="text-slate-400">{request.volume}CBM</span>
                    </div>
                    <button
                      onClick={() => setShowQuoteModal(true)}
                      className="w-full mt-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <DollarSign className="w-3 h-3" />
                      Submit Bid
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quotes Submitted */}
            <div
              className="bg-slate-700/30 rounded-xl p-4 min-h-80 border-2 border-dashed border-amber-500/30"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {}}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-white font-semibold text-sm">Quotes Submitted</span>
                <span className="text-slate-400 text-xs">({freightQuotes.filter(q => q.status === 'submitted').length})</span>
              </div>
              <div className="space-y-3">
                {freightQuotes.filter(q => q.status === 'submitted').map(quote => (
                  <div
                    key={quote.id}
                    draggable
                    onDragStart={() => setDraggedRequest(quote.id)}
                    className="bg-slate-800/80 rounded-xl p-4 border border-slate-600/30 hover:border-amber-500/50 transition-all cursor-grab"
                  >
                    <div className="text-white font-medium text-sm mb-1">{quote.carrierName}</div>
                    <div className="text-amber-400 font-bold text-lg mb-2">{formatCurrency(quote.price, quote.currency)}</div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="px-2 py-0.5 bg-slate-700/50 rounded">{quote.incoterm}</span>
                      <span>{quote.transitDays} days</span>
                    </div>
                    <div className="text-slate-400 text-xs">Valid until {formatDate(quote.validUntil)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Shipments */}
            <div
              className="bg-slate-700/30 rounded-xl p-4 min-h-80 border-2 border-dashed border-purple-500/30"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {}}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-white font-semibold text-sm">Active Shipments</span>
                <span className="text-slate-400 text-xs">({activeShipments.filter(s => s.status !== 'delivered').length})</span>
              </div>
              <div className="space-y-3">
                {activeShipments.filter(s => s.status !== 'delivered').map(shipment => (
                  <div
                    key={shipment.id}
                    draggable
                    onDragStart={() => setDraggedRequest(shipment.id)}
                    className="bg-slate-800/80 rounded-xl p-4 border border-slate-600/30 hover:border-purple-500/50 transition-all cursor-grab"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-400 font-mono font-medium text-xs">{shipment.shipmentId}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(shipment.status)}`}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-white font-medium text-sm mb-1">{shipment.vesselName}</div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                      <MapPin className="w-3 h-3" />
                      {shipment.origin} → {shipment.destination}
                    </div>
                    {shipment.currentPosition && (
                      <div className="text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded">
                        <Ship className="w-3 h-3 inline mr-1" />
                        {shipment.currentPosition}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Completed */}
            <div
              className="bg-slate-700/30 rounded-xl p-4 min-h-80 border-2 border-dashed border-emerald-500/30"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {}}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-white font-semibold text-sm">Completed</span>
                <span className="text-slate-400 text-xs">({activeShipments.filter(s => s.status === 'delivered').length})</span>
              </div>
              <div className="space-y-3">
                {activeShipments.filter(s => s.status === 'delivered').map(shipment => (
                  <div
                    key={shipment.id}
                    className="bg-slate-800/80 rounded-xl p-4 border border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-400 font-mono font-medium text-xs">{shipment.shipmentId}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-white font-medium text-sm">{shipment.cargoDescription}</div>
                    <div className="text-slate-400 text-xs mt-1">Delivered {formatDate(shipment.eta)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Exporter Backend (AI Cargo Optimizer)
  const renderExporterBackend = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Cargo Optimizer</h1>
          <p className="text-slate-400">Optimize your container loading for maximum efficiency</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCargoOptimizer(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Open AI Optimizer
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Pending Bookings</span>
            <ContainerIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">12</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Avg. Utilization</span>
            <BarChart3 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">78%</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Potential Savings</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">$4,200</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Active Shipments</span>
            <Ship className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">5</div>
        </div>
      </div>

      {/* Cargo Items Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Current Cargo Items</h2>
            <p className="text-slate-400 text-sm">Your exported products ready for shipping</p>
          </div>
          <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Quantity</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Pallets</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Volume</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Weight</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {cargoItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">{item.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white">{item.quantity.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white">{item.palletCount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white">{item.totalVolume} CBM</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white">{(item.totalWeight / 1000).toFixed(1)} tons</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Cargo Optimizer Preview */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/10 rounded-2xl border border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">AI Cargo Optimization</h3>
              <p className="text-purple-400 text-sm">Powered by Brands Bridge AI</p>
            </div>
          </div>
          <button
            onClick={() => setShowCargoOptimizer(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all"
          >
            Open Optimizer
          </button>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="text-slate-400 text-sm mb-1">Current Utilization</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }} />
                </div>
                <span className="text-amber-400 font-bold">70%</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-amber-400 font-medium text-sm">Container Optimization Available</div>
                <div className="text-slate-300 text-sm mt-1">Your container is 30% empty. Add 5 more pallets of complementary products to maximize shipping cost efficiency.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // AI Cargo Optimizer Modal
  const renderCargoOptimizerModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-purple-500/50 w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/20 to-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Cargo Optimizer</h2>
                <p className="text-purple-400 text-sm">Maximize container efficiency • Powered by Brands Bridge AI Core</p>
              </div>
            </div>
            <button
              onClick={() => setShowCargoOptimizer(false)}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Container Visual */}
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <ContainerIcon className="w-5 h-5 text-blue-400" />
                  Container Visualization
                </h3>

                {/* Container Type Selector */}
                <div className="flex gap-2 mb-6">
                  {(['20ft', '40ft', '40ft HC'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedContainer(type)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        selectedContainer === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {renderContainerVisual()}

                {/* AI Suggestion */}
                <div className={`rounded-xl p-4 ${
                  isOptimized
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : utilizationPercent < 70
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isOptimized
                        ? 'bg-emerald-500/20'
                        : 'bg-amber-500/20'
                    }`}>
                      <Zap className={`w-5 h-5 ${isOptimized ? 'text-emerald-400' : 'text-amber-400'}`} />
                    </div>
                    <div>
                      <div className={`font-semibold mb-1 ${
                        isOptimized
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}>
                        {isOptimized ? 'Optimal Loading!' : 'Optimization Suggestion'}
                      </div>
                      <div className="text-slate-300 text-sm">{getAISuggestion()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Cargo Items & Actions */}
            <div className="space-y-4">
              {/* Cargo Items */}
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-400" />
                    Cargo Items
                  </h3>
                  <button className="px-3 py-1.5 bg-slate-600/50 hover:bg-slate-500/50 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {cargoItems.map(item => (
                    <div key={item.id} className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Box className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{item.name}</div>
                          <div className="text-slate-400 text-xs">{item.palletCount} pallets</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium text-sm">{item.totalVolume} CBM</div>
                        <div className="text-slate-400 text-xs">{(item.totalWeight / 1000).toFixed(1)} tons</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  Booking Summary
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Container Type</span>
                    <span className="text-white font-medium">{selectedContainer} {currentContainer.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Volume Utilization</span>
                    <span className={`font-medium ${utilizationPercent >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>{utilizationPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Weight Utilization</span>
                    <span className={`font-medium ${(totalWeight / currentContainer.maxWeight) > 0.9 ? 'text-red-400' : 'text-white'}`}>
                      {Math.round((totalWeight / currentContainer.maxWeight) * 100)}%
                    </span>
                  </div>
                  <div className="h-px bg-slate-600/50 my-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Estimated Cost</span>
                    <span className="text-emerald-400 font-bold text-lg">{formatCurrency(currentContainer.maxVolume * 45)}</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <Ship className="w-5 h-5" />
                  Book Container Space
                </button>
                <button className="w-full mt-2 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Compare Carrier Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Quote Modal
  const renderQuoteModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-amber-500/50 w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Submit Freight Quote</h3>
              <p className="text-amber-400 text-sm">Competitive pricing wins business</p>
            </div>
          </div>
          <button
            onClick={() => setShowQuoteModal(false)}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Incoterm</label>
            <select className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-amber-500">
              <option>FOB - Free On Board</option>
              <option>CIF - Cost, Insurance & Freight</option>
              <option>CFR - Cost and Freight</option>
              <option>EXW - Ex Works</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Price (USD)</label>
              <input
                type="number"
                placeholder="2,500"
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Transit Days</label>
              <input
                type="number"
                placeholder="12"
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">Valid Until</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">Additional Notes</label>
            <textarea
              rows={3}
              placeholder="Include any additional terms, special handling requirements..."
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setShowQuoteModal(false)}
            className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Submit Quote
          </button>
        </div>
      </div>
    </div>
  );

  // Shipping Company Profile Modal
  const renderCompanyProfile = () => {
    if (!selectedCompany) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-2xl border border-blue-500/50 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-900/30 to-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3 shadow-lg">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCompany.name}</h2>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {selectedCompany.country}
                    </span>
                    <span>•</span>
                    <span>HQ: {selectedCompany.headquarters}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left - Stats & Info */}
              <div className="space-y-6">
                {/* AI Reliability */}
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/30 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <span className="text-white font-semibold">AI Reliability Score</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`text-5xl font-bold ${getScoreColor(selectedCompany.reliabilityScore)}`}>
                      {selectedCompany.reliabilityScore}%
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-5 h-5 fill-amber-400" />
                        <span className="text-white font-bold text-xl">{selectedCompany.rating}</span>
                      </div>
                      <div className="text-slate-400 text-sm">Customer Rating</div>
                    </div>
                  </div>
                </div>

                {/* Fleet Info */}
                <div className="bg-slate-700/30 rounded-xl border border-slate-600/30 p-5">
                  <h4 className="text-white font-semibold mb-4">Fleet Overview</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-slate-400 text-xs mb-1">Vessels</div>
                      <div className="text-white font-bold text-lg">{selectedCompany.vessels}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-slate-400 text-xs mb-1">Container Capacity</div>
                      <div className="text-white font-bold text-lg">{(selectedCompany.containers / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-white font-semibold mb-2">About</h4>
                  <p className="text-slate-400 text-sm">{selectedCompany.description}</p>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.certifications.map((cert, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Routes & Containers */}
              <div className="space-y-6">
                {/* Available Routes */}
                <div className="bg-slate-700/30 rounded-xl border border-slate-600/30 p-5">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    Available Routes
                  </h4>
                  <div className="space-y-3">
                    {selectedCompany.routes.map(route => (
                      <div key={route.id} className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded font-mono text-sm font-medium">{route.originCode}</span>
                            <ArrowRight className="w-4 h-4 text-slate-500" />
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded font-mono text-sm font-medium">{route.destinationCode}</span>
                          </div>
                          <span className="text-slate-400 text-xs">{route.frequency}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-4 h-4" />
                            {route.transitDays} days transit
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">20ft: <span className="text-white font-medium">${route.price20ft}</span></span>
                            <span className="text-slate-400">40ft: <span className="text-emerald-400 font-medium">${route.price40ft}</span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Container Types */}
                <div className="bg-slate-700/30 rounded-xl border border-slate-600/30 p-5">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <ContainerIcon className="w-5 h-5 text-amber-400" />
                    Container Types
                  </h4>
                  <div className="space-y-2">
                    {selectedCompany.containerTypes.map(container => (
                      <div key={container.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                          <div className="text-white font-medium text-sm">{container.name}</div>
                          <div className="text-slate-400 text-xs">{container.code} • {container.capacity}CBM</div>
                        </div>
                        {container.available ? (
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">Unavailable</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700/50 flex gap-3">
            <button className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contact Carrier
            </button>
            <button className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <DollarSign className="w-4 h-4" />
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Unified Supplier Sidebar */}
      <SupplierSidebar activePage="logistics" />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search routes, carriers, shipments..."
                className="w-80 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                LO
              </div>
              <div className="hidden md:block">
                <div className="text-white font-medium text-sm">Logistics Operator</div>
                <div className="text-slate-400 text-xs">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeView === 'marketplace' && renderMarketplace()}
          {activeView === 'carrier' && renderCarrierBackend()}
          {activeView === 'exporter' && renderExporterBackend()}
        </div>
      </main>

      {/* Modals */}
      {showCargoOptimizer && renderCargoOptimizerModal()}
      {showQuoteModal && renderQuoteModal()}
      {selectedCompany && renderCompanyProfile()}

      {/* AI Chat Widget */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">Logistics AI Assistant</div>
                <div className="text-blue-200 text-xs">Powered by Brands Bridge AI Core</div>
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
                    ? 'bg-blue-500 text-white rounded-br-none'
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
                placeholder="Ask about shipping..."
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white rounded-xl transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsEcosystem;
