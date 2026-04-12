import { useState } from 'react';
import {
  DollarSign,
  UserPlus,
  Target,
  Sparkles,
  Activity,
  Calendar,
  Mail,
  Phone,
  FileText,
  MoreHorizontal,
  Plus,
  Filter,
  Search,
  Bell,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  LogOut,
  Users,
  Package,
  Video,
  Megaphone,
  Ship
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SupplierSidebar from '../components/SupplierSidebar';

// ============================================
// CRM DATA TYPES
// ============================================

export interface CRMPipelineDeal {
  id: string;
  companyName: string;
  companyLogo: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  dealValue: number;
  leadScore: number;
  stage: 'new_leads' | 'qualified' | 'negotiation' | 'closing';
  lastActivity: string;
  lastActivityDate: string;
  probability: number;
  expectedCloseDate: string;
  products: string[];
  country: string;
  automationEnabled: boolean;
}

export interface AIInsight {
  id: string;
  type: 'follow_up' | 'opportunity' | 'alert' | 'recommendation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  companyId: string;
  companyName: string;
  potentialValue: number;
  timestamp: string;
}

export interface CRMTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  relatedCompany?: string;
  relatedDeal?: string;
  type: 'call' | 'email' | 'meeting' | 'follow_up' | 'document';
}

export interface CRMActivity {
  id: string;
  type: 'email_sent' | 'call_logged' | 'meeting_scheduled' | 'invoice_generated' | 'deal_created' | 'note_added';
  title: string;
  description: string;
  companyName: string;
  timestamp: string;
  user: string;
  metadata?: Record<string, string>;
}

// ============================================
// SAMPLE DATA
// ============================================

const sampleDeals: CRMPipelineDeal[] = [
  {
    id: 'deal-1',
    companyName: 'Al Ain Farms',
    companyLogo: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=100',
    contactName: 'Omar Al Mazrouei',
    contactEmail: 'export@alainfarms.ae',
    contactPhone: '+97124567890',
    dealValue: 145000,
    leadScore: 96,
    stage: 'closing',
    lastActivity: 'Final approval pending',
    lastActivityDate: '2024-01-28',
    probability: 90,
    expectedCloseDate: '2024-02-05',
    products: ['Dairy Products', 'Beverages'],
    country: 'UAE',
    automationEnabled: true
  },
  {
    id: 'deal-2',
    companyName: 'Almarai Company',
    companyLogo: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=100',
    contactName: 'Fahad Al Otaibi',
    contactEmail: 'export@almarai.com',
    contactPhone: '+966112345678',
    dealValue: 285000,
    leadScore: 91,
    stage: 'negotiation',
    lastActivity: 'Price negotiation in progress',
    lastActivityDate: '2024-01-28',
    probability: 70,
    expectedCloseDate: '2024-02-20',
    products: ['Dairy Products', 'Bakery Products'],
    country: 'Saudi Arabia',
    automationEnabled: true
  },
  {
    id: 'deal-3',
    companyName: 'Savola Group',
    companyLogo: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100',
    contactName: 'Waleed Al Ghamdi',
    contactEmail: 'export@savola.com',
    contactPhone: '+966122345678',
    dealValue: 198000,
    leadScore: 88,
    stage: 'negotiation',
    lastActivity: 'Contract terms being reviewed',
    lastActivityDate: '2024-01-27',
    probability: 65,
    expectedCloseDate: '2024-02-25',
    products: ['Oils & Fats', 'Sugar & Sweeteners'],
    country: 'Saudi Arabia',
    automationEnabled: true
  },
  {
    id: 'deal-4',
    companyName: 'Baladna Food Industries',
    companyLogo: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=100',
    contactName: 'Khalid Al Romaihi',
    contactEmail: 'export@baladna.com',
    contactPhone: '+97444567890',
    dealValue: 186000,
    leadScore: 82,
    stage: 'qualified',
    lastActivity: 'Discovery call scheduled',
    lastActivityDate: '2024-01-26',
    probability: 45,
    expectedCloseDate: '2024-03-15',
    products: ['Dairy Products', 'Fresh Food'],
    country: 'Qatar',
    automationEnabled: false
  },
  {
    id: 'deal-5',
    companyName: 'Americana Foods',
    companyLogo: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100',
    contactName: 'Karim Al Sayed',
    contactEmail: 'export@americana-food.com',
    contactPhone: '+97143789012',
    dealValue: 124000,
    leadScore: 79,
    stage: 'qualified',
    lastActivity: 'Samples sent for review',
    lastActivityDate: '2024-01-25',
    probability: 40,
    expectedCloseDate: '2024-03-10',
    products: ['Frozen Foods', 'Bakery Products'],
    country: 'UAE',
    automationEnabled: true
  },
  {
    id: 'deal-6',
    companyName: 'Al Meera Consumer Goods',
    companyLogo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100',
    contactName: 'Mohammed Al Kuwari',
    contactEmail: 'export@almeera.com.qa',
    contactPhone: '+97444123456',
    dealValue: 65000,
    leadScore: 72,
    stage: 'new_leads',
    lastActivity: 'Initial inquiry for dairy products',
    lastActivityDate: '2024-01-28',
    probability: 25,
    expectedCloseDate: '2024-04-01',
    products: ['FMCG', 'Dairy Products'],
    country: 'Qatar',
    automationEnabled: false
  },
  {
    id: 'deal-7',
    companyName: 'Gulf Food Industries',
    companyLogo: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=100',
    contactName: 'Jassim Al Mutairi',
    contactEmail: 'export@gfi.com.kw',
    contactPhone: '+96522345678',
    dealValue: 38000,
    leadScore: 68,
    stage: 'new_leads',
    lastActivity: 'Product catalog requested',
    lastActivityDate: '2024-01-27',
    probability: 20,
    expectedCloseDate: '2024-04-15',
    products: ['Confectionery & Chocolate', 'Snacks & Chips'],
    country: 'Kuwait',
    automationEnabled: false
  }
];

const sampleAIInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'follow_up',
    priority: 'high',
    title: 'Follow up with Almarai Company',
    description: 'High probability of closing. Contract review completed.',
    action: 'Schedule final call to confirm deal terms',
    companyId: '4',
    companyName: 'Almarai Company',
    potentialValue: 285000,
    timestamp: '2024-01-28T10:00:00Z'
  },
  {
    id: 'insight-2',
    type: 'opportunity',
    priority: 'high',
    title: 'Send catalog to Baladna',
    description: 'They viewed your profile 4 times this week.',
    action: 'Send personalized catalog with volume discounts',
    companyId: '2',
    companyName: 'Baladna Food Industries',
    potentialValue: 186000,
    timestamp: '2024-01-28T09:30:00Z'
  },
  {
    id: 'insight-3',
    type: 'alert',
    priority: 'medium',
    title: 'Al Ain Farms deal expiring',
    description: 'Final approval pending. Follow up within 48 hours to ensure signature.',
    action: 'Send reminder email or call directly',
    companyId: '6',
    companyName: 'Al Ain Farms',
    potentialValue: 145000,
    timestamp: '2024-01-28T08:00:00Z'
  },
  {
    id: 'insight-4',
    type: 'recommendation',
    priority: 'low',
    title: 'Americana Foods ready for demo',
    description: 'Discovery call completed. They are interested in frozen product range.',
    action: 'Schedule product demo with samples',
    companyId: '8',
    companyName: 'Americana Foods',
    potentialValue: 124000,
    timestamp: '2024-01-27T15:00:00Z'
  }
];

const sampleTasks: CRMTask[] = [
  {
    id: 'task-1',
    title: 'Call Fahad Al Otaibi - Almarai',
    description: 'Final contract discussion for dairy supply deal',
    dueDate: '2024-01-29',
    priority: 'high',
    status: 'pending',
    relatedCompany: 'Almarai Company',
    relatedDeal: 'deal-2',
    type: 'call'
  },
  {
    id: 'task-2',
    title: 'Send revised quotation - Baladna',
    description: 'Include volume discount pricing',
    dueDate: '2024-01-30',
    priority: 'high',
    status: 'in_progress',
    relatedCompany: 'Baladna Food Industries',
    relatedDeal: 'deal-4',
    type: 'email'
  },
  {
    id: 'task-3',
    title: 'Product demo - Americana Foods',
    description: 'Prepare frozen product samples and presentation',
    dueDate: '2024-02-01',
    priority: 'medium',
    status: 'pending',
    relatedCompany: 'Americana Foods',
    relatedDeal: 'deal-5',
    type: 'meeting'
  },
  {
    id: 'task-4',
    title: 'Follow up - Al Ain Farms contract',
    description: 'Ensure contract signature is received',
    dueDate: '2024-01-29',
    priority: 'high',
    status: 'pending',
    relatedCompany: 'Al Ain Farms',
    relatedDeal: 'deal-1',
    type: 'follow_up'
  }
];

const sampleActivities: CRMActivity[] = [
  {
    id: 'activity-1',
    type: 'call_logged',
    title: 'Call with Almarai - Contract Review',
    description: 'Discussed final terms and delivery schedule',
    companyName: 'Almarai Company',
    timestamp: '2024-01-28T11:30:00Z',
    user: 'Sales Team'
  },
  {
    id: 'activity-2',
    type: 'email_sent',
    title: 'Quotation sent to Baladna',
    description: 'Revised quotation with volume discount',
    companyName: 'Baladna Food Industries',
    timestamp: '2024-01-28T10:15:00Z',
    user: 'Export Manager'
  },
  {
    id: 'activity-3',
    type: 'invoice_generated',
    title: 'Proforma Invoice - Al Ain Farms',
    description: 'Invoice #INV-2024-0156 for $145,000',
    companyName: 'Al Ain Farms',
    timestamp: '2024-01-28T09:00:00Z',
    user: 'Finance Team'
  },
  {
    id: 'activity-4',
    type: 'meeting_scheduled',
    title: 'Demo scheduled with Americana Foods',
    description: 'Video call on Feb 1, 2024 at 14:00 GST',
    companyName: 'Americana Foods',
    timestamp: '2024-01-27T16:45:00Z',
    user: 'Sales Team'
  },
  {
    id: 'activity-5',
    type: 'deal_created',
    title: 'New deal created - Al Meera',
    description: 'Initial inquiry for dairy products',
    companyName: 'Al Meera Consumer Goods',
    timestamp: '2024-01-27T14:20:00Z',
    user: 'Lead Agent'
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(timestamp);
};

// ============================================
// MAIN COMPONENT
// ============================================

const CRMDashboard = () => {
  const { user, logout } = useAuth();
  const [deals, setDeals] = useState(sampleDeals);
  const [aiInsights] = useState(sampleAIInsights);
  const [tasks] = useState(sampleTasks);
  const [activities] = useState(sampleActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedDeal, setDraggedDeal] = useState<CRMPipelineDeal | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Calculate stats
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.dealValue, 0);
  const activeLeads = deals.filter(d => d.stage !== 'closing').length;
  const dealsInProgress = deals.filter(d => d.stage === 'closing').length;
  const avgProbability = Math.round(deals.reduce((sum, d) => sum + d.probability, 0) / deals.length);
  const aiPredictedRevenue = Math.round(totalPipelineValue * (avgProbability / 100));

  // Pipeline stages
  const stages = [
    { id: 'new_leads', label: 'New Leads', color: 'bg-blue-500' },
    { id: 'qualified', label: 'Qualified', color: 'bg-amber-500' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-500' },
    { id: 'closing', label: 'Closing', color: 'bg-emerald-500' }
  ];

  // Get deals by stage
  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, deal: CRMPipelineDeal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedDeal) {
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.id === draggedDeal.id
            ? { ...deal, stage: stageId as CRMPipelineDeal['stage'] }
            : deal
        )
      );
      setDraggedDeal(null);
    }
  };

  // Get activity icon
  const getActivityIcon = (type: CRMActivity['type']) => {
    switch (type) {
      case 'email_sent': return Mail;
      case 'call_logged': return Phone;
      case 'meeting_scheduled': return Calendar;
      case 'invoice_generated': return FileText;
      case 'deal_created': return Plus;
      case 'note_added': return MessageSquare;
      default: return Activity;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Get lead score color
  const getLeadScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      {/* Supplier Sidebar */}
      <SupplierSidebar activePage="pipeline" />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* PERSISTENT TOP HEADER */}
        <div className="h-12 bg-[#0A0F1E] border-b border-slate-800/50 flex items-center justify-between px-6">
          {/* Left: Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {}}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#0A0F1E]" />
            </div>
            <span className="text-sm font-semibold text-white">Brands Bridge AI</span>
          </div>

          {/* Center: Platform Name */}
          <div className="text-sm font-medium text-white">Supplier Hub</div>

          {/* Right: Bell, User, Logout */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <span className="text-sm text-white font-medium">{user?.name || 'OZMO Export Team'}</span>
            <button
              onClick={() => { logout(); }}
              className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Header */}
        <header className="sticky top-12 z-30 bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">Sales CRM</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-400 text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Pipeline
                  </span>
                  <span className="text-xs text-slate-500">Sales CRM</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Analytics
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A0F1E] font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Deal
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Pipeline Value */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{formatCurrency(totalPipelineValue)}</div>
              <div className="text-slate-400 text-sm">Total Pipeline Value</div>
            </div>

            {/* Active Leads */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+8</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{activeLeads}</div>
              <div className="text-slate-400 text-sm">Active Leads</div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+5.2%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{avgProbability}%</div>
              <div className="text-slate-400 text-sm">Avg. Conversion Rate</div>
            </div>

            {/* AI Predicted Revenue */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>AI</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{formatCurrency(aiPredictedRevenue)}</div>
              <div className="text-slate-400 text-sm">AI Predicted Revenue</div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Pipeline - 2 columns */}
            <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Sales Pipeline</h2>
                  <p className="text-slate-400 text-sm">Drag and drop deals between stages</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-amber-400 hover:to-amber-500 text-[#0A0F1E] rounded-xl font-medium text-sm transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  Add Deal
                </button>
              </div>

              {/* Kanban Board */}
              <div className="p-4 overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                  {stages.map((stage) => {
                    const stageDeals = getDealsByStage(stage.id);
                    const stageValue = stageDeals.reduce((sum, d) => sum + d.dealValue, 0);
                    return (
                      <div
                        key={stage.id}
                        className="w-72 flex-shrink-0"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage.id)}
                      >
                        {/* Stage Header */}
                        <div className="flex items-center gap-2 mb-3 px-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          <span className="text-white font-semibold text-sm">{stage.label}</span>
                          <span className="text-slate-400 text-xs">({stageDeals.length})</span>
                          <span className="ml-auto text-[#D4AF37] text-xs font-medium">
                            {formatCurrency(stageValue)}
                          </span>
                        </div>

                        {/* Stage Cards */}
                        <div className="space-y-3 min-h-96">
                          {stageDeals.map((deal) => (
                            <div
                              key={deal.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, deal)}
                              className={`bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 cursor-grab active:cursor-grabbing hover:border-[#D4AF37]/50 transition-all duration-200 ${
                                draggedDeal?.id === deal.id ? 'opacity-50 scale-95' : ''
                              }`}
                            >
                              {/* Company Info */}
                              <div className="flex items-center gap-3 mb-3">
                                <img
                                  src={deal.companyLogo}
                                  alt={deal.companyName}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-white font-semibold text-sm truncate">
                                    {deal.companyName}
                                  </div>
                                  <div className="text-slate-400 text-xs truncate">{deal.country}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-[#D4AF37] font-bold text-sm">
                                    {formatCurrency(deal.dealValue)}
                                  </span>
                                  <span className="text-slate-500 text-xs">Deal Value</span>
                                </div>
                              </div>

                              {/* Lead Score */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-400 text-xs">Score:</span>
                                    <span className={`font-bold text-sm ${getLeadScoreColor(deal.leadScore)}`}>
                                      {deal.leadScore}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    deal.probability >= 75 ? 'bg-emerald-500/20 text-emerald-400' :
                                    deal.probability >= 50 ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {deal.probability}% likely
                                  </span>
                                </div>
                              </div>

                              {/* Last Activity */}
                              <div className="bg-slate-700/50 rounded-lg p-2 mb-3">
                                <div className="text-slate-300 text-xs font-medium truncate">
                                  {deal.lastActivity}
                                </div>
                                <div className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(deal.lastActivityDate)}
                                </div>
                              </div>

                              {/* Products */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {deal.products.slice(0, 2).map((product, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded"
                                  >
                                    {product}
                                  </span>
                                ))}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                                    <Mail className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                                    <Phone className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                                    <Calendar className="w-4 h-4" />
                                  </button>
                                </div>
                                <button className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Add Deal Button */}
                          <button className="w-full py-4 border-2 border-dashed border-slate-700/50 rounded-xl text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-200 flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            <span className="text-sm">Add Deal</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - AI Insights */}
            <div className="space-y-6">
              {/* AI Next Best Action */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold">AI Next Best Action</h2>
                      <p className="text-slate-400 text-xs">The MCP Touch</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-[#D4AF37]/50 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            insight.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            insight.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {insight.priority}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            insight.type === 'follow_up' ? 'bg-emerald-500/20 text-emerald-400' :
                            insight.type === 'opportunity' ? 'bg-amber-500/20 text-amber-400' :
                            insight.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {insight.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-slate-500 text-xs">{getRelativeTime(insight.timestamp)}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">{insight.title}</h3>
                      <p className="text-slate-400 text-xs mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#D4AF37] font-bold text-sm">
                          {formatCurrency(insight.potentialValue)}
                        </span>
                        <button className="px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-amber-400 hover:to-amber-500 text-[#0A0F1E] rounded-lg text-xs font-medium transition-all duration-200">
                          Take Action
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tasks */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold">Today's Tasks</h2>
                      <p className="text-slate-400 text-xs">{tasks.filter(t => t.status !== 'completed').length} pending</p>
                    </div>
                  </div>
                  <button className="text-[#D4AF37] hover:text-amber-400 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {tasks.slice(0, 4).map((task) => {
                    const TaskIcon = task.type === 'call' ? Phone : task.type === 'email' ? Mail : task.type === 'meeting' ? Calendar : CheckCircle2;
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          task.status === 'completed' ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                        }`}>
                          <TaskIcon className={`w-4 h-4 ${task.status === 'completed' ? 'text-emerald-400' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className={`px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span>Due: {formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                        {task.status !== 'completed' && (
                          <button className="p-1 rounded-lg hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors">
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mt-6 bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Recent Activities</h2>
                  <p className="text-slate-400 text-xs">Latest interactions across all deals</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {activities.map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <tr key={activity.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center">
                              <ActivityIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">{activity.title}</div>
                              <div className="text-slate-400 text-xs">{activity.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-white text-sm">{activity.companyName}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-slate-300 text-sm">{activity.user}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-slate-400 text-sm">{getRelativeTime(activity.timestamp)}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="px-3 py-1.5 text-[#D4AF37] hover:text-amber-400 hover:bg-[#D4AF37]/10 rounded-lg text-sm font-medium transition-colors">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CRMDashboard;