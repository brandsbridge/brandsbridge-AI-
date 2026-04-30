import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  BadgeCheck,
  MapPin,
  ArrowRight,
  Grid3X3,
  List,
  SlidersHorizontal,
  Sparkles,
  Shield,
  Truck,
  Package,
  Calendar,
  DollarSign,
  MessageSquare,
  Send,
  FileText,
  Video,
  Ship,
  CheckCircle2,
  Star,
  Zap,
  Globe,
  Building2,
  ChevronRight,
  ExternalLink,
  Radio,
  Users,
  Target,
  Eye,
  Anchor,
  Clock,
  BarChart3,
  Warehouse,
  Lock,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { companies, categories, countries, Company, threePLCompanies, cargoAuctions } from '../data/mockData';
import { calculateAIReliability, getRatingDisplay } from '../lib/companyMetrics';
import VirtualBoothModal from '../components/VirtualBoothModal';

type TabType = 'suppliers' | 'live' | 'shipping' | 'cargo' | 'categories';

const CompaniesPage = () => {
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('suppliers');

  // Virtual Booth Modal State
  const [showVirtualBooth, setShowVirtualBooth] = useState(false);
  const [boothCompany, setBoothCompany] = useState<Company | null>(null);

  // Handle opening Virtual Booth
  const handleOpenVirtualBooth = (company: Company) => {
    setBoothCompany(company);
    setShowVirtualBooth(true);
  };

  const formatLiveTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // AI Search State
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isAISearchFocused, setIsAISearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<Company[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [selectedVerification, setSelectedVerification] = useState('');
  const [selectedExportCapacity, setSelectedExportCapacity] = useState('');
  const [selectedMOQ, setSelectedMOQ] = useState('');
  const [selectedLogistics, setSelectedLogistics] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'bridge'>('bridge');
  const [showFilters, setShowFilters] = useState(false);

  // Modal States
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showFreightQuoteModal, setShowFreightQuoteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedShippingCompany, setSelectedShippingCompany] = useState<ShippingCompany | null>(null);

  // Buyer data (simulated from Procurement Hub)
  const buyerData = {
    companyName: 'Gulf Trading Co.',
    country: 'UAE',
    contactName: 'Ahmed Al-Rashid',
    email: 'ahmed@gulftrading.ae',
    procurementManager: 'Procurement Team'
  };

  const businessTypes = ['Manufacturer', 'Exporter', 'Importer', 'Distributor', 'Agent'];
  const verificationOptions = ['All', 'KYB Verified', 'ISO Certified', 'Premium Partner'];
  const exportCapacityOptions = ['All', '1-50 containers/month', '50-200 containers/month', '200+ containers/month'];
  const moqOptions = ['All', '< $1,000', '$1,000 - $10,000', '$10,000 - $50,000', '> $50,000'];
  const logisticsOptions = ['All', 'FOB Origin', 'CIF Destination', 'DDP Delivered', 'Multi-modal'];

  // Live Companies Data
  const liveCompanies = [
    {
      id: 'live1',
      name: 'OZMO Confectionery',
      country: 'Turkey',
      flag: '🇹🇷',
      logo: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100&h=100&fit=crop',
      category: 'Confectionery & Chocolate',
      waiting: 23,
      revenue: '$8,200',
      deals: 5,
      matchScore: 94,
      products: ['Chocolate Wafers 750g', 'Premium Biscuits 500g'],
      time: 4525
    },
    {
      id: 'live2',
      name: 'Almarai Company',
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      logo: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop',
      category: 'Dairy & Poultry Products',
      waiting: 15,
      revenue: '$12,500',
      deals: 8,
      matchScore: 87,
      products: ['Fresh Milk 1L', 'Yogurt 500g', 'Cheese Cheddar 1kg'],
      time: 6120
    },
    {
      id: 'live3',
      name: 'Golden Dates Co.',
      country: 'UAE',
      flag: '🇦🇪',
      logo: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=100&h=100&fit=crop',
      category: 'Premium Dates & Dry Fruits',
      waiting: 8,
      revenue: '$4,200',
      deals: 3,
      matchScore: 91,
      products: ['Medjool Dates 1kg', 'Mixed Dry Fruits 500g'],
      time: 2340
    },
    {
      id: 'live4',
      name: 'Euro Arcade',
      country: 'Germany',
      flag: '🇩🇪',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
      category: 'Confectionery & Snacks',
      waiting: 31,
      revenue: '$15,800',
      deals: 12,
      matchScore: 82,
      products: ['Gummy Bears 250g', 'Hard Candies 500g', 'Chocolate Bars'],
      time: 8940
    }
  ];

  // Shipping Companies Data
  interface ShippingCompany {
    id: string;
    name: string;
    country: string;
    flag: string;
    logo: string;
    partners: string;
    reliability: number;
    vessels: number;
    containers: string;
    routes: { from: string; to: string; price: string; days: number }[];
    containerTypes: string[];
  }

  const shippingCompanies: ShippingCompany[] = [
    {
      id: 'ship1',
      name: 'Apex Global Logistics',
      country: 'UAE',
      flag: '🇦🇪',
      logo: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=100&h=100&fit=crop',
      partners: 'Maersk & MSC',
      reliability: 97,
      vessels: 708,
      containers: '4.3M TEU',
      routes: [
        { from: 'Istanbul', to: 'Dubai', price: '$1,800', days: 12 },
        { from: 'Jeddah', to: 'Mumbai', price: '$2,200', days: 18 }
      ],
      containerTypes: ['20ft', '40ft', 'Reefer', 'HC']
    },
    {
      id: 'ship2',
      name: 'Crescent Freight Solutions',
      country: 'Turkey',
      flag: '🇹🇷',
      logo: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=100&h=100&fit=crop',
      partners: 'MSC & Hapag-Lloyd',
      reliability: 95,
      vessels: 560,
      containers: '2.8M TEU',
      routes: [
        { from: 'Mersin', to: 'Dubai', price: '$1,750', days: 14 },
        { from: 'Istanbul', to: 'Jeddah', price: '$1,950', days: 16 }
      ],
      containerTypes: ['20ft', '40ft', 'Reefer']
    },
    {
      id: 'ship3',
      name: 'Atlas Trade Logistics',
      country: 'Germany',
      flag: '🇩🇪',
      logo: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d16e?w=100&h=100&fit=crop',
      partners: 'Hapag-Lloyd & ONE Line',
      reliability: 96,
      vessels: 253,
      containers: '1.5M TEU',
      routes: [
        { from: 'Hamburg', to: 'Dubai', price: '$2,800', days: 24 },
        { from: 'Rotterdam', to: 'Jeddah', price: '$2,400', days: 20 }
      ],
      containerTypes: ['20ft', '40ft', '40ft HC', 'Reefer']
    },
    {
      id: 'ship4',
      name: 'Gulf Freight Partners',
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      logo: 'https://images.unsplash.com/photo-1585155770913-5bda4dd7a44a?w=100&h=100&fit=crop',
      partners: 'Evergreen & COSCO',
      reliability: 94,
      vessels: 180,
      containers: '1.2M TEU',
      routes: [
        { from: 'Jeddah', to: 'Singapore', price: '$3,200', days: 28 },
        { from: 'Dubai', to: 'Mumbai', price: '$1,600', days: 10 }
      ],
      containerTypes: ['20ft', '40ft', 'HC']
    },
    {
      id: 'ship5',
      name: 'Euro FMCG Logistics',
      country: 'Netherlands',
      flag: '🇳🇱',
      logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&h=100&fit=crop',
      partners: 'Maersk & CMA CGM',
      reliability: 98,
      vessels: 425,
      containers: '2.6M TEU',
      routes: [
        { from: 'Rotterdam', to: 'Dubai', price: '$2,600', days: 22 },
        { from: 'Hamburg', to: 'Riyadh', price: '$2,900', days: 26 }
      ],
      containerTypes: ['20ft', '40ft', '40ft HC', 'Reefer']
    },
    {
      id: 'ship6',
      name: 'Eastern Bridge Cargo',
      country: 'Singapore',
      flag: '🇸🇬',
      logo: 'https://images.unsplash.com/photo-1565976461081-8503297c4eb6?w=100&h=100&fit=crop',
      partners: 'ONE Line & PIL',
      reliability: 93,
      vessels: 320,
      containers: '1.8M TEU',
      routes: [
        { from: 'Singapore', to: 'Dubai', price: '$2,100', days: 14 },
        { from: 'Shanghai', to: 'Jeddah', price: '$2,800', days: 20 }
      ],
      containerTypes: ['20ft', '40ft', 'Reefer']
    }
  ];

  // Shipping filters
  const [shippingRegion, setShippingRegion] = useState('');
  const [containerType, setContainerType] = useState('');
  const [sortBy, setSortBy] = useState('reliability');
  const [shippingSubTab, setShippingSubTab] = useState<'freight' | '3pl'>('freight');

  // Categories Data
  const categoriesData = [
    {
      id: 'confectionery',
      name: 'Confectionery & Chocolate',
      description: 'Chocolates, candies, sweets',
      image: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400',
      color: 'from-amber-600/80 to-amber-900/80'
    },
    {
      id: 'dairy',
      name: 'Dairy Products',
      description: 'Milk, cheese, yogurt, butter',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
      color: 'from-blue-600/80 to-blue-900/80'
    },
    {
      id: 'beverages',
      name: 'Beverages',
      description: 'Soft drinks, juices, water',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
      color: 'from-cyan-600/80 to-cyan-900/80'
    },
    {
      id: 'snacks',
      name: 'Snacks & Chips',
      description: 'Chips, nuts, crackers',
      image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
      color: 'from-orange-600/80 to-orange-900/80'
    },
    {
      id: 'canned',
      name: 'Canned Foods',
      description: 'Canned vegetables, fruits, meat',
      image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400',
      color: 'from-emerald-600/80 to-emerald-900/80'
    },
    {
      id: 'bakery',
      name: 'Bakery Products',
      description: 'Bread, cakes, pastries',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      color: 'from-yellow-600/80 to-yellow-900/80'
    },
    {
      id: 'frozen',
      name: 'Frozen Foods',
      description: 'Frozen meals, vegetables, meat',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      color: 'from-sky-600/80 to-sky-900/80'
    },
    {
      id: 'sauces',
      name: 'Sauces & Condiments',
      description: 'Ketchup, mayonnaise, spices',
      image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400',
      color: 'from-red-600/80 to-red-900/80'
    },
    {
      id: 'baby',
      name: 'Baby Food',
      description: 'Formula, purees, snacks',
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400',
      color: 'from-pink-600/80 to-pink-900/80'
    },
    {
      id: 'cosmetics',
      name: 'Cosmetics & Personal Care',
      description: 'Skincare, haircare, beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      color: 'from-purple-600/80 to-purple-900/80'
    },
    {
      id: 'detergents',
      name: 'Detergents & Household',
      description: 'Cleaning, laundry, household',
      image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
      color: 'from-teal-600/80 to-teal-900/80'
    },
    {
      id: 'ingredients',
      name: 'Ingredients & Raw Materials',
      description: 'Sugar, flour, oils, spices',
      image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=400',
      color: 'from-lime-600/80 to-lime-900/80'
    }
  ];

  // Handle Category Click
  const handleCategoryClick = (categoryName: string, count: number) => {
    setSelectedCategory(categoryName);
    setActiveTab('suppliers');
    toast.success(`Showing ${categoryName} suppliers (${count} companies)`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI Search Handler with Smart Matching
  const handleAISearch = () => {
    if (!aiSearchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setSearchQuery(aiSearchQuery);

    // Simulate AI processing
    setTimeout(() => {
      const query = aiSearchQuery.toLowerCase();

      const results = companies.filter((company) => {
        let score = 0;

        // Name match: +3 points
        if (company.name.toLowerCase().includes(query)) {
          score += 3;
        }

        // Country match: +2 points
        if (company.country?.toLowerCase().includes(query)) {
          score += 2;
        }

        // City match: +1 point
        if (company.city?.toLowerCase().includes(query)) {
          score += 1;
        }

        // Category match: +2 points
        if (company.categories?.some(cat => cat.toLowerCase().includes(query))) {
          score += 2;
        }

        // Description match: +1 point
        if (company.description?.toLowerCase().includes(query)) {
          score += 1;
        }

        // Certification match: +1 point
        if (company.certifications?.some(cert => cert.toLowerCase().includes(query))) {
          score += 1;
        }

        // Business type match: +1 point
        if (company.businessType?.toLowerCase().includes(query)) {
          score += 1;
        }

        // Smart keyword matching
        if (query.includes('halal') && company.certifications?.includes('Halal')) {
          score += 2;
        }
        if (query.includes('iso') && company.certifications?.some(c => c.includes('ISO'))) {
          score += 2;
        }
        if (query.includes('dairy') && company.categories?.some(c => c.includes('Dairy'))) {
          score += 2;
        }
        if (query.includes('chocolate') && company.categories?.some(c => c.includes('Confectionery') || c.includes('Chocolate'))) {
          score += 2;
        }
        if (query.includes('snacks') && company.categories?.some(c => c.includes('Snacks'))) {
          score += 2;
        }
        if (query.includes('organic') && company.categories?.some(c => c.includes('Organic'))) {
          score += 2;
        }
        if (query.includes('private label') && company.description?.toLowerCase().includes('private label')) {
          score += 2;
        }

        // GCC countries
        if (query.includes('gcc')) {
          const gccCountries = ['Qatar', 'UAE', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman'];
          if (gccCountries.includes(company.country)) {
            score += 2;
          }
        }
        if (query.includes('qatar') && company.country === 'Qatar') score += 2;
        if (query.includes('saudi') && company.country === 'Saudi Arabia') score += 2;
        if (query.includes('uae') && company.country === 'UAE') score += 2;
        if (query.includes('turkey') && company.country === 'Turkey') score += 2;
        if (query.includes('germany') && company.country === 'Germany') score += 2;

        // Business type keywords
        if (query.includes('manufacturer') && company.businessType === 'Manufacturer') score += 2;
        if (query.includes('exporter') && company.businessType === 'Exporter') score += 2;
        if (query.includes('importer') && company.businessType === 'Importer') score += 2;
        if (query.includes('distributor') && company.businessType === 'Distributor') score += 2;

        return score > 0;
      });

      // Sort by score descending
      results.sort((a, b) => {
        const getScore = (company: Company) => {
          let score = 0;
          if (company.name.toLowerCase().includes(query)) score += 3;
          if (company.country?.toLowerCase().includes(query)) score += 2;
          if (company.city?.toLowerCase().includes(query)) score += 1;
          if (company.categories?.some(cat => cat.toLowerCase().includes(query))) score += 2;
          if (company.description?.toLowerCase().includes(query)) score += 1;
          if (company.certifications?.some(cert => cert.toLowerCase().includes(query))) score += 1;
          if (company.businessType?.toLowerCase().includes(query)) score += 1;
          return score;
        };
        return getScore(b) - getScore(a);
      });

      setSearchResults(results);
      setIsSearching(false);
    }, 300); // brief delay so the skeleton is visible
  };

  // Clear Search
  const clearSearch = () => {
    setAiSearchQuery('');
    setSearchResults([]);
    setSearchQuery('');
    setHasSearched(false);
  };

  // Handle Direct Actions
  const handleSendInquiry = (company: Company) => {
    setSelectedCompany(company);
    setShowInquiryModal(true);
  };

  const handleRequestQuote = (company: Company) => {
    setSelectedCompany(company);
    setShowQuoteModal(true);
  };

  const handleBookMeeting = (company: Company) => {
    setSelectedCompany(company);
    setShowMeetingModal(true);
  };

  const handleViewCargo = () => {
    window.open('/logistics', '_blank');
  };

  const handleRequestFreightQuote = (company: ShippingCompany) => {
    setSelectedShippingCompany(company);
    setShowFreightQuoteModal(true);
  };

  // Country multi-select dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Unique countries derived from companies — { name, flag }
  const availableCountries = useMemo(() => {
    const map = new Map<string, string>();
    companies.forEach((c) => {
      if (!map.has(c.country)) map.set(c.country, c.countryFlag);
    });
    return Array.from(map.entries())
      .map(([name, flag]) => ({ name, flag }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter visible options by the in-dropdown search box
  const visibleCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return availableCountries;
    return availableCountries.filter((c) => c.name.toLowerCase().includes(q));
  }, [availableCountries, countrySearch]);

  // Click-outside to close the country dropdown
  useEffect(() => {
    if (!isCountryDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isCountryDropdownOpen]);

  // Trigger label: empty / single (with flag) / multi summary
  const countryTriggerLabel = (() => {
    if (selectedCountries.length === 0) return 'All Countries';
    if (selectedCountries.length === 1) {
      const c = availableCountries.find((x) => x.name === selectedCountries[0]);
      return c ? `${c.flag} ${c.name}` : selectedCountries[0];
    }
    const first = availableCountries.find((x) => x.name === selectedCountries[0]);
    const head = first ? `${first.flag} ${first.name}` : selectedCountries[0];
    return `${head} + ${selectedCountries.length - 1} more`;
  })();

  const toggleCountry = (name: string) => {
    setSelectedCountries((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Parse a minOrderValue string like "$10,000" or "$1.5K" into USD number, or null if missing/unparseable
  const parseMinOrderUSD = (str?: string): number | null => {
    if (!str) return null;
    const cleaned = str.replace(/[$,\s]/g, '');
    const match = cleaned.match(/^([\d.]+)([KkMm])?/);
    if (!match) return null;
    const num = parseFloat(match[1]);
    if (isNaN(num)) return null;
    const suffix = match[2]?.toLowerCase();
    if (suffix === 'k') return num * 1_000;
    if (suffix === 'm') return num * 1_000_000;
    return num;
  };

  // Filtered Companies — wires all 8 sidebar filters
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // 1. Search across name, description, categories
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        company.name.toLowerCase().includes(q) ||
        company.description.toLowerCase().includes(q) ||
        company.categories.some(cat => cat.toLowerCase().includes(q));

      // 2. Country (multi-select OR — match any selected)
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(company.country);

      // 3. Category
      const matchesCategory = selectedCategory === '' || company.categories.some(cat => cat.includes(selectedCategory));

      // 4. Business type
      const matchesBusinessType = selectedBusinessType === '' || company.businessType === selectedBusinessType;

      // 5. Verification — maps each option to a different field
      let matchesVerification = true;
      if (selectedVerification && selectedVerification !== 'All') {
        if (selectedVerification === 'KYB Verified') {
          matchesVerification = company.kybStatus === 'verified';
        } else if (selectedVerification === 'ISO Certified') {
          matchesVerification = company.certifications.some(c => c.toLowerCase().includes('iso'));
        } else if (selectedVerification === 'Premium Partner') {
          matchesVerification = company.subscriptionPlan === 'Premium' || company.subscriptionPlan === 'Expo';
        }
      }

      // 6. Export Capacity — buckets on monthlyContainers
      let matchesExportCapacity = true;
      if (selectedExportCapacity && selectedExportCapacity !== 'All') {
        const n = company.monthlyContainers;
        if (n == null) {
          matchesExportCapacity = false;
        } else if (selectedExportCapacity === '1-50 containers/month') {
          matchesExportCapacity = n >= 1 && n <= 50;
        } else if (selectedExportCapacity === '50-200 containers/month') {
          matchesExportCapacity = n > 50 && n <= 200;
        } else if (selectedExportCapacity === '200+ containers/month') {
          matchesExportCapacity = n > 200;
        }
      }

      // 7. MOQ — buckets on parsed minOrderValue (USD)
      let matchesMOQ = true;
      if (selectedMOQ && selectedMOQ !== 'All') {
        const usd = parseMinOrderUSD(company.minOrderValue);
        if (usd == null) {
          matchesMOQ = false;
        } else if (selectedMOQ === '< $1,000') {
          matchesMOQ = usd < 1_000;
        } else if (selectedMOQ === '$1,000 - $10,000') {
          matchesMOQ = usd >= 1_000 && usd <= 10_000;
        } else if (selectedMOQ === '$10,000 - $50,000') {
          matchesMOQ = usd > 10_000 && usd <= 50_000;
        } else if (selectedMOQ === '> $50,000') {
          matchesMOQ = usd > 50_000;
        }
      }

      // 8. Logistics Readiness — NO-OP for now
      // TODO: Logistics dropdown values are Incoterms (FOB/CIF/DDP/Multi-modal), but Company has
      // no Incoterm field. paymentTerms holds payment instruments ('LC at Sight', 'TT 30% advance'),
      // not shipping terms. Add a `incoterms?: string[]` field to Company and populate mockData
      // before wiring this filter.
      const matchesLogistics = true;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesCategory &&
        matchesBusinessType &&
        matchesVerification &&
        matchesExportCapacity &&
        matchesMOQ &&
        matchesLogistics
      );
    });
  }, [searchQuery, selectedCountries, selectedCategory, selectedBusinessType, selectedVerification, selectedExportCapacity, selectedMOQ, selectedLogistics]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountries([]);
    setSelectedCategory('');
    setSelectedBusinessType('');
    setSelectedVerification('');
    setSelectedExportCapacity('');
    setSelectedMOQ('');
    setSelectedLogistics('');
  };

  const activeFiltersCount =
    (selectedCountries.length > 0 ? 1 : 0) +
    [selectedCategory, selectedBusinessType, selectedVerification, selectedExportCapacity, selectedMOQ, selectedLogistics].filter(Boolean).length;

  return (
    <div className="min-h-screen" style={{ background: '#050D1A' }}>
      {/* Gold Line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }} />

      {/* AI Hero Search Section */}
      <div style={{ background: 'linear-gradient(135deg, #071120 0%, #0C1829 50%, #071120 100%)', borderBottom: '1px solid #162438' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0EA5C9]/20 border border-[#0EA5C9]/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#0EA5C9]" />
              <span className="text-[#0EA5C9] text-sm font-medium">AI-Powered Sourcing Engine</span>
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '48px', letterSpacing: '-1.5px' }} className="text-white mb-4 hidden md:block">
              Global <span style={{ color: '#D4AF37' }}>FMCG Expo Hall</span>
            </h1>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' }} className="text-white mb-4 md:hidden">
              Global <span style={{ color: '#D4AF37' }}>FMCG Expo Hall</span>
            </h1>
            <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '18px', color: '#94A3B8', lineHeight: 1.6 }}>
              Browse verified suppliers, join live deal rooms, and connect with freight forwarders — all in one place.
            </p>
          </div>

          {/* Premium AI Search Bar */}
          <div className="relative">
            <div
              className={`relative transition-all duration-300 ${isAISearchFocused ? 'scale-[1.02]' : ''}`}
              style={{
                background: '#0C1829',
                border: isAISearchFocused ? '1px solid #D4AF37' : '1px solid #162438',
                borderRadius: '16px',
                height: '64px',
                padding: '0 8px 0 20px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: isAISearchFocused ? '0 0 0 3px rgba(212,175,55,0.1)' : 'none'
              }}
            >
              <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', background: '#D4AF37', borderRadius: '10px', marginRight: '12px' }}>
                <Sparkles className="w-5 h-5 text-[#050D1A]" style={{ color: '#050D1A' }} />
              </div>
              <input
                type="text"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                onFocus={() => setIsAISearchFocused(true)}
                onBlur={() => setIsAISearchFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                placeholder="Find me a Turkish confectionery manufacturer with ISO 22000 for the Saudi market..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F8FAFC',
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '16px',
                  flex: 1,
                  outline: 'none'
                }}
              />
              <button
                onClick={handleAISearch}
                disabled={isSearching}
                style={{
                  background: isSearching ? '#A8892A' : '#D4AF37',
                  color: '#050D1A',
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: '14px',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  height: '48px',
                  border: 'none',
                  cursor: isSearching ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#050D1A]/30 border-t-[#050D1A] rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    AI Search
                  </>
                )}
              </button>
            </div>

            {/* Quick Search Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                { text: 'Chocolate exporters from Turkey', query: 'chocolate exporters Turkey' },
                { text: 'FMCG distributors in GCC', query: 'FMCG distributors GCC' },
                { text: 'Private label snack manufacturers', query: 'private label snacks manufacturer' },
                { text: 'Organic food suppliers', query: 'organic food' }
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAiSearchQuery(prompt.query);
                    handleAISearch();
                  }}
                  style={{
                    background: 'rgba(14,165,201,0.08)',
                    border: '1px solid rgba(14,165,201,0.2)',
                    color: '#0EA5C9',
                    borderRadius: '100px',
                    padding: '6px 16px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(14,165,201,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(14,165,201,0.2)';
                    e.currentTarget.style.color = '#0EA5C9';
                  }}
                >
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div style={{ background: '#071120', borderBottom: '1px solid #162438' }} className="py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2" style={{ color: '#94A3B8' }}>
            <Shield className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span>KYB Verified Partners</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#94A3B8' }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span>Escrow Payment Protection</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#94A3B8' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span>AI Reliability Scoring</span>
          </div>
        </div>
      </div>

      {/* ========== TABS SYSTEM ========== */}
      <div style={{ background: '#071120', borderBottom: '1px solid #162438' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {/* Tab 1: Suppliers */}
            <button
              onClick={() => setActiveTab('suppliers')}
              style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...(activeTab === 'suppliers' ? {
                  background: '#0EA5C9',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(14,165,201,0.3)'
                } : {
                  background: 'transparent',
                  color: '#94A3B8'
                })
              }}
            >
              <Building2 className="w-4 h-4" />
              Suppliers
              <span style={{
                padding: '2px 8px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                ...(activeTab === 'suppliers' ? {
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white'
                } : {
                  background: '#0C1829',
                  color: '#94A3B8'
                })
              }}>
                {companies.length}
              </span>
            </button>

            {/* Tab 2: Live Now */}
            <button
              onClick={() => setActiveTab('live')}
              style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...(activeTab === 'live' ? {
                  background: '#0EA5C9',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(14,165,201,0.3)'
                } : {
                  background: 'transparent',
                  color: '#94A3B8'
                })
              }}
            >
              <Video className="w-4 h-4" />
              Live
              <span
                className="uppercase tracking-wide"
                style={{
                  padding: '2px 6px',
                  borderRadius: '100px',
                  fontSize: '10px',
                  fontWeight: 700,
                  background: 'rgba(212, 175, 55, 0.2)',
                  color: '#D4AF37'
                }}
              >
                Soon
              </span>
            </button>

            {/* Tab 3: Shipping */}
            <button
              onClick={() => setActiveTab('shipping')}
              style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...(activeTab === 'shipping' ? {
                  background: '#0EA5C9',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(14,165,201,0.3)'
                } : {
                  background: 'transparent',
                  color: '#94A3B8'
                })
              }}
            >
              <Ship className="w-4 h-4" />
              Shipping
              <span style={{
                padding: '2px 8px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                ...(activeTab === 'shipping' ? {
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white'
                } : {
                  background: '#0C1829',
                  color: '#94A3B8'
                })
              }}>
                {shippingCompanies.length + threePLCompanies.length}
              </span>
            </button>

            {/* Tab 4: Categories */}
            <button
              onClick={() => setActiveTab('categories')}
              style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...(activeTab === 'categories' ? {
                  background: '#0EA5C9',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(14,165,201,0.3)'
                } : {
                  background: 'transparent',
                  color: '#94A3B8'
                })
              }}
            >
              <Package className="w-4 h-4" />
              Categories
              <span style={{
                padding: '2px 8px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                ...(activeTab === 'categories' ? {
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white'
                } : {
                  background: '#0C1829',
                  color: '#94A3B8'
                })
              }}>
                {categoriesData.length}
              </span>
            </button>

            {/* Tab 5: Cargo Auction */}
            <button
              onClick={() => setActiveTab('cargo')}
              style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...(activeTab === 'cargo' ? {
                  background: '#D4AF37',
                  color: '#050D1A',
                  boxShadow: '0 4px 16px rgba(212,175,55,0.3)'
                } : {
                  background: 'transparent',
                  color: '#94A3B8'
                })
              }}
            >
              <span className="text-lg">🔥</span>
              Cargo Auction
              <span style={{
                padding: '2px 8px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                ...(activeTab === 'cargo' ? {
                  background: 'rgba(5,13,26,0.3)',
                  color: '#050D1A'
                } : {
                  background: '#D4AF37',
                  color: '#050D1A'
                })
              }}>
                {cargoAuctions.filter(a => a.auction.status === 'active').length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========== TAB 1: SUPPLIERS (Existing Content) ========== */}
        {activeTab === 'suppliers' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Sourcing Filters</h3>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Country (multi-select) */}
                <div className="mb-6" ref={countryDropdownRef}>
                  <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    Country
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen((open) => !open)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <span className={`truncate ${selectedCountries.length === 0 ? 'text-slate-400' : 'text-white'}`}>
                        {countryTriggerLabel}
                      </span>
                      <ChevronDown className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute z-20 mt-2 left-0 right-0 bg-slate-800 border border-slate-600/70 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-slate-700/60">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search country…"
                              className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        {/* Options */}
                        <div className="max-h-64 overflow-y-auto py-1">
                          {visibleCountries.length === 0 && (
                            <div className="px-4 py-3 text-sm text-slate-500">No countries match.</div>
                          )}
                          {visibleCountries.map((c) => {
                            const checked = selectedCountries.includes(c.name);
                            return (
                              <label
                                key={c.name}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700/60 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleCountry(c.name)}
                                  className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-base leading-none">{c.flag}</span>
                                <span className={`text-sm ${checked ? 'text-white font-medium' : 'text-slate-300'}`}>{c.name}</span>
                              </label>
                            );
                          })}
                        </div>
                        {/* Footer — only when 1+ selected */}
                        {selectedCountries.length > 0 && (
                          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-700/60 bg-slate-900/40">
                            <span className="text-xs text-slate-400">
                              {selectedCountries.length} selected
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedCountries([])}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Verification Status
                  </label>
                  <div className="space-y-2">
                    {verificationOptions.map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="verification"
                          checked={selectedVerification === option || (option === 'All' && selectedVerification === '')}
                          onChange={() => setSelectedVerification(option === 'All' ? '' : option)}
                          className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-400 group-hover:text-white transition-colors">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Export Capacity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    Export Capacity
                  </label>
                  <select
                    value={selectedExportCapacity}
                    onChange={(e) => setSelectedExportCapacity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {exportCapacityOptions.map((option) => (
                      <option key={option} value={option === 'All' ? '' : option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* MOQ */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Minimum Order (MOQ)
                  </label>
                  <select
                    value={selectedMOQ}
                    onChange={(e) => setSelectedMOQ(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {moqOptions.map((option) => (
                      <option key={option} value={option === 'All' ? '' : option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Logistics Readiness */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400" />
                    Logistics Readiness
                  </label>
                  <select
                    value={selectedLogistics}
                    onChange={(e) => setSelectedLogistics(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {logisticsOptions.map((option) => (
                      <option key={option} value={option === 'All' ? '' : option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Quick Stats */}
                <div className="pt-6 border-t border-slate-700/50">
                  <div className="text-sm text-slate-400">
                    Showing <span className="font-semibold text-white">{filteredCompanies.length}</span> verified suppliers
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filters Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 font-medium"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Sourcing Filters
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  {/* Show search results count when searched */}
                  {hasSearched && !isSearching && (
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ color: '#10B981', fontFamily: 'Inter', fontWeight: 500, fontSize: '14px' }}>
                        ✓ Found {searchResults.length} verified suppliers matching your search
                      </span>
                    </div>
                  )}
                  {/* Show loading text when searching */}
                  {isSearching && (
                    <div style={{ color: '#D4AF37', fontFamily: 'Inter', fontWeight: 500, fontSize: '14px' }}>
                      🤖 AI is analyzing your request...
                    </div>
                  )}
                  {/* Default text when no search */}
                  {!hasSearched && !isSearching && (
                    <div style={{ color: '#94A3B8' }}>
                      Showing{' '}
                      <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{filteredCompanies.length}</span>
                      {' '}of{' '}
                      <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{companies.length}</span>
                      {' '}verified suppliers
                    </div>
                  )}
                  {/* Clear search button when searched */}
                  {hasSearched && !isSearching && (
                    <button
                      onClick={clearSearch}
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#94A3B8',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#F8FAFC';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#94A3B8';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      [Clear Search ×]
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('bridge')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      ...(viewMode === 'bridge' ? {
                        background: 'rgba(212,175,55,0.2)',
                        color: '#D4AF37',
                        border: '1px solid rgba(212,175,55,0.3)'
                      } : {
                        background: 'transparent',
                        color: '#94A3B8'
                      })
                    }}
                  >
                    Bridge View
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      ...(viewMode === 'grid' ? {
                        background: 'rgba(14,165,201,0.2)',
                        color: '#0EA5C9'
                      } : {
                        background: 'transparent',
                        color: '#94A3B8'
                      })
                    }}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      ...(viewMode === 'list' ? {
                        background: 'rgba(14,165,201,0.2)',
                        color: '#0EA5C9'
                      } : {
                        background: 'transparent',
                        color: '#94A3B8'
                      })
                    }}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Active Filters — visual chip count includes search + each country individually */}
              {(() => {
                const visibleChipCount =
                  (searchQuery ? 1 : 0) +
                  selectedCountries.length +
                  (selectedVerification ? 1 : 0) +
                  (selectedCategory ? 1 : 0) +
                  (selectedBusinessType ? 1 : 0) +
                  (selectedExportCapacity ? 1 : 0) +
                  (selectedMOQ ? 1 : 0);
                if (visibleChipCount === 0) return null;
                return (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-full text-sm">
                        <Search className="w-3 h-3" />
                        "{searchQuery}"
                        <button onClick={() => setSearchQuery('')} aria-label="Clear search"><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {selectedVerification && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm">
                        <Shield className="w-3 h-3" />
                        {selectedVerification}
                        <button onClick={() => setSelectedVerification('')} aria-label={`Remove ${selectedVerification} filter`}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {selectedCountries.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm">
                        <Globe className="w-3 h-3" />
                        {c}
                        <button onClick={() => setSelectedCountries((prev) => prev.filter((x) => x !== c))} aria-label={`Remove ${c} filter`}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm">
                        <Package className="w-3 h-3" />
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('')} aria-label={`Remove ${selectedCategory} filter`}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {selectedBusinessType && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-sm">
                        <Building2 className="w-3 h-3" />
                        {selectedBusinessType}
                        <button onClick={() => setSelectedBusinessType('')} aria-label={`Remove ${selectedBusinessType} filter`}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {selectedExportCapacity && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm">
                        <Truck className="w-3 h-3" />
                        {selectedExportCapacity}
                        <button onClick={() => setSelectedExportCapacity('')} aria-label={`Remove ${selectedExportCapacity} filter`}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {selectedMOQ && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-full text-sm">
                        <DollarSign className="w-3 h-3" />
                        MOQ: {selectedMOQ}
                        <button onClick={() => setSelectedMOQ('')} aria-label="Remove MOQ filter"><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {visibleChipCount >= 2 && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/40 rounded-full transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Loading Skeleton */}
              {isSearching && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        background: '#0C1829',
                        border: '1px solid #162438',
                        borderRadius: '16px',
                        padding: '24px',
                        animation: 'shimmer 1.5s infinite'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        {/* Logo skeleton */}
                        <div
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '12px',
                            background: 'linear-gradient(90deg, #0C1829 25%, #162438 50%, #0C1829 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite'
                          }}
                        />
                        {/* Content skeleton */}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              width: '60%',
                              height: '24px',
                              borderRadius: '6px',
                              marginBottom: '12px',
                              background: 'linear-gradient(90deg, #0C1829 25%, #162438 50%, #0C1829 75%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.5s infinite'
                            }}
                          />
                          <div
                            style={{
                              width: '40%',
                              height: '16px',
                              borderRadius: '4px',
                              marginBottom: '12px',
                              background: 'linear-gradient(90deg, #0C1829 25%, #162438 50%, #0C1829 75%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.5s infinite'
                            }}
                          />
                          <div
                            style={{
                              width: '80%',
                              height: '14px',
                              borderRadius: '4px',
                              background: 'linear-gradient(90deg, #0C1829 25%, #162438 50%, #0C1829 75%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.5s infinite'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Companies Grid - Bridge View (normal or search results) */}
              {!isSearching && viewMode === 'bridge' && (
                <div className="space-y-6">
                  {(hasSearched ? searchResults : filteredCompanies).slice(0, 6).map((company, index) => (
                    <div key={company.id} style={{ position: 'relative' }}>
                      {/* Relevance Badge for top 3 */}
                      {hasSearched && index < 3 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '20px',
                            zIndex: 10,
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontFamily: 'Inter',
                            fontWeight: 600,
                            ...(index === 0 ? {
                              background: '#D4AF37',
                              color: '#050D1A'
                            } : index === 1 ? {
                              background: '#0EA5C9',
                              color: 'white'
                            } : {
                              background: '#162438',
                              color: '#94A3B8'
                            })
                          }}
                        >
                          {index === 0 ? '🏆 Best Match' : index === 1 ? '⭐ Great Match' : '✓ Good Match'}
                        </div>
                      )}
                      <BridgeCard
                        key={company.id}
                        company={company}
                        buyerData={buyerData}
                        onSendInquiry={() => handleSendInquiry(company)}
                        onRequestQuote={() => handleRequestQuote(company)}
                        onBookMeeting={() => handleBookMeeting(company)}
                        onViewCargo={handleViewCargo}
                        onVirtualBooth={() => handleOpenVirtualBooth(company)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Companies Grid */}
              {!isSearching && viewMode === 'grid' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {(hasSearched ? searchResults : filteredCompanies).map((company) => (
                    <CompanyCard key={company.id} company={company} viewMode="grid" />
                  ))}
                </div>
              )}

              {/* Companies List */}
              {!isSearching && viewMode === 'list' && (
                <div className="space-y-4">
                  {(hasSearched ? searchResults : filteredCompanies).map((company) => (
                    <CompanyCard key={company.id} company={company} viewMode="list" />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isSearching && ((hasSearched && searchResults.length === 0) || filteredCompanies.length === 0) && (
                <div className="text-center py-16">
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      background: '#0C1829',
                      border: '1px solid #162438',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>🔍</span>
                  </div>
                  <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '20px', color: '#F8FAFC', marginBottom: '8px' }}>
                    No suppliers found
                  </h3>
                  <p style={{ fontFamily: 'Inter', color: '#94A3B8', marginBottom: '16px' }}>
                    Try searching for:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Inter', color: '#94A3B8', fontSize: '14px' }}>• A country (Qatar, UAE, Turkey)</span>
                    <span style={{ fontFamily: 'Inter', color: '#94A3B8', fontSize: '14px' }}>• A product (chocolate, dairy, snacks)</span>
                    <span style={{ fontFamily: 'Inter', color: '#94A3B8', fontSize: '14px' }}>• A certification (Halal, ISO, BRC)</span>
                  </div>
                  <button
                    onClick={hasSearched ? clearSearch : clearFilters}
                    style={{
                      padding: '12px 24px',
                      background: '#0EA5C9',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontFamily: 'Inter',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0B5E75';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#0EA5C9';
                    }}
                  >
                    {hasSearched ? 'Browse All Suppliers →' : 'Clear all filters'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== TAB 2: LIVE — COMING SOON ========== */}
        {activeTab === 'live' && (
          <div className="min-h-[600px] flex items-center justify-center py-8">
            <div
              className="w-full max-w-2xl mx-auto rounded-3xl p-10 sm:p-12 text-center"
              style={{
                background: 'linear-gradient(135deg, #071120 0%, #0C1829 100%)',
                border: '1px solid #162438'
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)'
                }}
              >
                <Video className="w-10 h-10" style={{ color: '#D4AF37' }} />
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">Live Deal Rooms</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Real-time video meetings between buyers and suppliers worldwide.
              </p>

              <div
                className="rounded-2xl p-6 mb-8 text-left"
                style={{
                  background: 'rgba(14, 165, 201, 0.05)',
                  border: '1px solid rgba(14, 165, 201, 0.2)'
                }}
              >
                <ul className="space-y-3">
                  {[
                    '8-Language Translation',
                    'HD Video & Crystal Audio',
                    'Built on Agora.io',
                    'Recorded for review',
                    'Calendar Integration',
                    'Document sharing in-call'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#0EA5C9' }} />
                      <span className="text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 justify-center mb-6">
                <div className="h-px flex-1 max-w-[80px]" style={{ background: '#162438' }} />
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: '#D4AF37', color: '#050D1A' }}
                >
                  Coming Soon
                </span>
                <div className="h-px flex-1 max-w-[80px]" style={{ background: '#162438' }} />
              </div>

              <p className="text-slate-500 text-sm">
                Part of the Brands Bridge roadmap.
              </p>
            </div>
          </div>
        )}

        {/* ========== TAB 3: SHIPPING & LOGISTICS ========== */}
        {activeTab === 'shipping' && (
          <div>
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    All shipments protected by Brands Bridge Escrow Payment System
                  </h2>
                  <p className="text-slate-400 text-sm">
                    200+ Verified Freight Forwarders | 2,500+ Active Routes | 97% Reliability
                  </p>
                </div>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 mb-8">
              <select
                value={shippingRegion}
                onChange={(e) => setShippingRegion(e.target.value)}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Regions</option>
                <option value="middle-east">Middle East</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
              </select>
              <select
                value={containerType}
                onChange={(e) => setContainerType(e.target.value)}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Container Type</option>
                <option value="20ft">20ft</option>
                <option value="40ft">40ft</option>
                <option value="40ft-hc">40ft HC</option>
                <option value="reefer">Reefer</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="reliability">Sort by: AI Reliability</option>
                <option value="vessels">Sort by: Fleet Size</option>
                <option value="routes">Sort by: Active Routes</option>
              </select>
            </div>

            {/* Shipping Sub-Tabs: Freight Forwarders | 3PL & Cold Storage */}
            <div className="flex gap-3 mb-8 p-1 bg-slate-800/30 rounded-xl w-fit">
              <button
                onClick={() => setShippingSubTab('freight')}
                className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  background: shippingSubTab === 'freight' ? '#0EA5C9' : 'transparent',
                  color: shippingSubTab === 'freight' ? 'white' : '#94A3B8'
                }}
              >
                <Truck className="w-4 h-4" />
                Freight Forwarders
              </button>
              <button
                onClick={() => setShippingSubTab('3pl')}
                className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  background: shippingSubTab === '3pl' ? '#0EA5C9' : 'transparent',
                  color: shippingSubTab === '3pl' ? 'white' : '#94A3B8'
                }}
              >
                <Warehouse className="w-4 h-4" />
                3PL & Cold Storage
                <span className="px-2 py-0.5 rounded-full text-xs" style={{
                  background: shippingSubTab === '3pl' ? 'rgba(255,255,255,0.2)' : '#0C1829',
                  color: shippingSubTab === '3pl' ? 'white' : '#94A3B8'
                }}>
                  3
                </span>
              </button>
            </div>

            {/* Freight Forwarders Content */}
            {shippingSubTab === 'freight' && (
              <>

            {/* Shipping Companies Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shippingCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-[#111827] border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
                >
                  <div className="p-5">
                    {/* Company Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-14 h-14 rounded-xl object-cover bg-white"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">{company.name}</h3>
                          <BadgeCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Globe className="w-3 h-3" />
                          <span>{company.country}</span>
                          <span>{company.flag}</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1">Partnered: {company.partners}</p>
                      </div>
                    </div>

                    {/* AI Reliability */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                          <span className="text-white text-sm font-medium">AI Reliability: {company.reliability}%</span>
                        </div>
                        <span className="text-emerald-400 font-bold">{company.reliability}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all"
                          style={{ width: `${company.reliability}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Container Types */}
                    <div className="mb-4">
                      <span className="text-slate-400 text-xs font-medium">Container Types:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {company.containerTypes.map((type, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-700/50 border border-slate-600/30 rounded text-xs text-slate-300">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top Routes */}
                    <div className="mb-4">
                      <span className="text-slate-400 text-xs font-medium">Top Routes:</span>
                      <div className="space-y-2 mt-2">
                        {company.routes.slice(0, 2).map((route, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">🔹</span>
                              <span className="text-slate-300">{route.from} → {route.to}</span>
                            </div>
                            <div className="text-slate-400 text-xs">
                              {route.price} | {route.days} days
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fleet Info */}
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4 pt-3 border-t border-slate-700/50">
                      <span>Fleet: {company.vessels} vessels</span>
                      <span>Containers: {company.containers}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestFreightQuote(company)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#0B5E75] to-[#0B5E75]/80 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                      >
                        Request Custom Quote
                      </button>
                      <button className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg font-medium hover:bg-slate-600/50 transition-all text-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              </>
            )}

            {/* 3PL & Cold Storage Content */}
            {shippingSubTab === '3pl' && (
              <>
                {/* 3PL Banner */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                      <Warehouse className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        Temperature-Controlled Storage Solutions
                      </h2>
                      <p className="text-slate-400 text-sm">
                        15+ Verified 3PL Providers | Frozen, Chilled & Ambient Storage | AI Reliability Scores
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3PL Companies Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {threePLCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-[#111827] border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
                    >
                      <div className="p-5">
                        {/* Company Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-cyan-500/20">
                            {company.logo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold">{company.name}</h3>
                              <BadgeCheck className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <MapPin className="w-3 h-3" />
                              <span>{company.city}, {company.country}</span>
                              <span>{company.countryFlag}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-400 text-sm mb-4">{company.tagline}</p>

                        {/* AI Reliability */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                              <span className="text-white text-sm font-medium">AI Reliability</span>
                            </div>
                            <span className="text-cyan-400 font-bold">{company.aiReliability}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full transition-all"
                              style={{ width: `${company.aiReliability}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Storage Services */}
                        <div className="mb-4">
                          <span className="text-slate-400 text-xs font-medium">Storage Zones:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {company.services.map((service, idx) => (
                              <span key={idx} className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Certifications */}
                        <div className="mb-4">
                          <span className="text-slate-400 text-xs font-medium">Certifications:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {company.certifications.slice(0, 2).map((cert, idx) => (
                              <span key={idx} className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-xs text-amber-300">
                                <Shield className="w-3 h-3 inline mr-1" />
                                {cert}
                              </span>
                            ))}
                            {company.certifications.length > 2 && (
                              <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400">
                                +{company.certifications.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Capacity Info */}
                        <div className="flex items-center justify-between text-sm text-slate-400 mb-4 pt-3 border-t border-slate-700/50">
                          <span>{company.totalCapacity.toLocaleString()} pallets</span>
                          <span className="text-cyan-400">{company.availableNow.toLocaleString()} available</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-600/80 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                          >
                            Request Storage Quote
                          </button>
                          <button className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg font-medium hover:bg-slate-600/50 transition-all text-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========== TAB 4: CATEGORIES ========== */}
        {activeTab === 'categories' && (
          <div>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">
                Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#0B5E75]">Category</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Find manufacturers, exporters, and distributors in your industry segment.
                <br />Click any category to see available companies.
              </p>
            </div>

            {/* Categories Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {categoriesData.map((category) => {
                const realCount = companies.filter(
                  c => c.categories?.includes(category.name)
                ).length;
                return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name, realCount)}
                  className="group relative h-48 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#0B5E75]/30 border-2 border-transparent hover:border-[#0B5E75]"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-white font-bold text-base mb-1 group-hover:text-[#D4AF37] transition-colors">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300 text-sm font-medium">
                            {realCount > 0 ? `${realCount}+ suppliers` : 'Coming soon'}
                          </span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-[#0B5E75]/80 rounded-full flex items-center justify-center group-hover:bg-[#0B5E75] transition-colors">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </button>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 text-center">
              <p className="text-slate-300 mb-2">Can't find your category?</p>
              <p className="text-slate-400 text-sm mb-4">We cover 24+ FMCG industry segments</p>
              <button
                onClick={() => {
                  setActiveTab('suppliers');
                  clearFilters();
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#0B5E75] to-[#0B5E75]/80 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Browse All Suppliers →
              </button>
            </div>
          </div>
        )}


        {/* ========== TAB: CARGO AUCTION ========== */}
        {activeTab === 'cargo' && (
          <div>
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 rounded-2xl p-8 mb-8 text-white">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-3">
                <Ship className="w-5 h-5" />
                <span>DAILY CARGO AUCTION</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Reserve Cargo Before Others</h2>
              <p className="text-amber-100 max-w-2xl mb-6">
                Exclusive access to ready-to-ship containers at fixed delivered prices.
                Pay 20% deposit to secure your cargo. First come, first served.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">Escrow Protected</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">Platform Guarantee</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
                  <BadgeCheck className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">KYB Verified Sellers</span>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-6">How Cargo Auction Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: 1, icon: '🔍', title: 'Browse Cargo', desc: 'View available containers with delivered prices' },
                  { step: 2, icon: '📍', title: 'Select Port', desc: 'Choose your destination port' },
                  { step: 3, icon: '💳', title: 'Pay 20% Deposit', desc: 'Secure your reservation instantly' },
                  { step: 4, icon: '📦', title: 'Receive Cargo', desc: 'Pay balance on arrival, receive goods' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.title}
                      </div>
                      <div className="text-sm text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Cargo Listings */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Active Cargo ({cargoAuctions.filter(a => a.auction.status === 'active').length})
                </h3>
                <Link
                  to="/auction"
                  className="px-4 py-2 bg-amber-500 text-slate-900 rounded-xl font-semibold hover:bg-amber-400 transition-colors inline-flex items-center gap-2"
                >
                  View Full Page
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cargoAuctions.filter(a => a.auction.status === 'active').slice(0, 6).map((auction) => (
                <div key={auction.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all">
                  {/* Product Image */}
                  <div className="relative aspect-video bg-slate-700">
                    <img
                      src={auction.media.images[0]}
                      alt={auction.productName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                        Available
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-slate-900/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                        {auction.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-white mb-1">{auction.productName}</h4>
                    <p className="text-slate-400 text-sm mb-3">{auction.productVariant}</p>

                    {/* Supplier */}
                    <Link
                      to={`/companies/${auction.supplierId}`}
                      className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-3"
                    >
                      <span>{auction.supplierFlag}</span>
                      <span className="text-sm">{auction.supplierName}</span>
                      {auction.supplierVerified && <BadgeCheck className="w-4 h-4 text-emerald-400" />}
                    </Link>

                    {/* Container Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Package className="w-4 h-4" />
                        <span>{auction.container.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span>{auction.origin.port}</span>
                      </div>
                    </div>

                    {/* Min Price */}
                    <div className="bg-amber-50 rounded-xl p-3 mb-4 text-center">
                      <div className="text-xs text-amber-600 mb-1">From CIF</div>
                      <div className="text-xl font-bold text-slate-900">
                        ${Math.min(...auction.deliveryPrices.map(dp => dp.price)).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        to {auction.deliveryPrices[0].country}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to="/auction"
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Reserve Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA for Sellers */}
            <div className="mt-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-amber-500/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Have Cargo to Sell?</h3>
                  <p className="text-slate-300">List your containers and reach buyers across 85+ countries.</p>
                </div>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors whitespace-nowrap"
                >
                  List Your Cargo
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Virtual Booth Modal */}
      {showVirtualBooth && boothCompany && (
        <VirtualBoothModal
          company={boothCompany}
          onClose={() => setShowVirtualBooth(false)}
        />
      )}

      {/* Send Inquiry Modal */}
      {showInquiryModal && selectedCompany && (
        <ExportInquiryModal
          company={selectedCompany}
          buyerData={buyerData}
          onClose={() => setShowInquiryModal(false)}
        />
      )}

      {/* Request Quote Modal */}
      {showQuoteModal && selectedCompany && (
        <RequestQuoteModal
          company={selectedCompany}
          onClose={() => setShowQuoteModal(false)}
        />
      )}

      {/* Book Meeting Modal */}
      {showMeetingModal && selectedCompany && (
        <BookMeetingModal
          company={selectedCompany}
          onClose={() => setShowMeetingModal(false)}
        />
      )}

      {/* Freight Quote Modal */}
      {showFreightQuoteModal && selectedShippingCompany && (
        <FreightQuoteModal
          company={selectedShippingCompany}
          onClose={() => setShowFreightQuoteModal(false)}
        />
      )}

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-slate-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Sourcing Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            {/* Mobile filters content similar to desktop */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-3 border border-slate-600/50 rounded-xl text-slate-300 font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for Float Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Bridge Card Component - The Main Connection Card
const BridgeCard = ({
  company,
  buyerData,
  onSendInquiry,
  onRequestQuote,
  onBookMeeting,
  onViewCargo,
  onVirtualBooth
}: {
  company: Company;
  buyerData: { companyName: string; country: string; contactName: string; email: string };
  onSendInquiry: () => void;
  onRequestQuote: () => void;
  onBookMeeting: () => void;
  onViewCargo: () => void;
  onVirtualBooth: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const reliability = calculateAIReliability(company);
  const rating = getRatingDisplay(company);
  const hasMonthlyContainers = typeof company.monthlyContainers === 'number';
  const hasMinOrderValue = typeof company.minOrderValue === 'string' && company.minOrderValue.length > 0;
  const hasPaymentTerms = Array.isArray(company.paymentTerms) && company.paymentTerms.length > 0;
  const hasAnyQuickStat = hasMonthlyContainers || hasMinOrderValue || hasPaymentTerms;

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border transition-all duration-500 ${
        isHovered ? 'border-amber-500/50 shadow-2xl shadow-amber-500/10 scale-[1.01]' : 'border-slate-700/50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 rounded-2xl object-cover bg-white shadow-lg"
              />
              {company.verified && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-xl font-bold text-white">{company.name}</h3>
                {company.verified && (
                  <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold">
                    KYB VERIFIED
                  </span>
                )}
                <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-medium flex items-center gap-1">
                  🥽 Virtual Booth Available
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <span>{company.countryFlag}</span>
                <span>{company.city}, {company.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  company.businessType === 'Manufacturer' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  company.businessType === 'Exporter' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {company.businessType}
                </span>
                {rating.hasReviews ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-lg text-xs text-slate-400">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {rating.display}
                  </span>
                ) : (
                  <span
                    className="px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      background: 'rgba(14,165,201,0.15)',
                      color: '#0EA5C9',
                      border: '1px solid rgba(14,165,201,0.3)',
                    }}
                  >
                    New listing
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI Reliability Score */}
          <div className="text-right">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-end gap-1">
              AI Reliability
              <span title="Calculated from KYB verification, document compliance, response time, completed deals, platform tenure, and customer reviews.">
                <HelpCircle className="w-3 h-3 inline opacity-60" />
              </span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">{reliability}%</div>
            <div className="text-xs text-slate-500">Composite trust score</div>
          </div>
        </div>

        {/* Products */}
        <div className="flex flex-wrap gap-2 mb-6">
          {company.categories.slice(0, 3).map((cat, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/30 rounded-lg text-sm text-slate-300">
              {cat}
            </span>
          ))}
          {company.categories.length > 3 && (
            <span className="px-3 py-1.5 text-slate-500 text-sm">+{company.categories.length - 3} more</span>
          )}
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-2 mb-6">
          {company.certifications.slice(0, 3).map((cert, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
              {cert}
            </span>
          ))}
          {company.certifications.length > 3 && (
            <span className="px-2.5 py-1 bg-slate-700/50 rounded-lg text-xs text-slate-400">
              +{company.certifications.length - 3} more
            </span>
          )}
        </div>

        {/* 5 Direct Action Buttons - The Bridge */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Virtual Booth Button - 5th button */}
          <button
            onClick={onVirtualBooth}
            style={{
              background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
              padding: '14px 16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.3)';
            }}
          >
            <span style={{ fontSize: '18px' }}>🥽</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '13px', fontFamily: 'Inter' }}>Virtual Booth</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontFamily: 'Inter' }}>Visit virtually</div>
            </div>
          </button>
          <button
            onClick={onSendInquiry}
            className="group relative px-4 py-3.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl text-left overflow-hidden transition-all hover:from-blue-500/30 hover:to-blue-600/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Send className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Send Export Inquiry</div>
                <div className="text-slate-400 text-xs">Get response within 24h</div>
              </div>
            </div>
          </button>

          <button
            onClick={onRequestQuote}
            className="group relative px-4 py-3.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-xl text-left overflow-hidden transition-all hover:from-amber-500/30 hover:to-amber-600/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Request Quotation</div>
                <div className="text-slate-400 text-xs">RFQ with pricing</div>
              </div>
            </div>
          </button>

          <button
            onClick={onBookMeeting}
            className="group relative px-4 py-3.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl text-left overflow-hidden transition-all hover:from-purple-500/30 hover:to-purple-600/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Video className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Book Video Meeting</div>
                <div className="text-slate-400 text-xs">30-min consultation</div>
              </div>
            </div>
          </button>

          <button
            onClick={onViewCargo}
            className="group relative px-4 py-3.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl text-left overflow-hidden transition-all hover:from-emerald-500/30 hover:to-emerald-600/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Ship className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">View Active Cargo</div>
                <div className="text-slate-400 text-xs">Track shipments</div>
              </div>
            </div>
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50 text-sm">
          {hasAnyQuickStat ? (
            <div className="flex items-center gap-4 flex-wrap">
              {hasMonthlyContainers && (
                <div className="text-slate-400">
                  <span className="text-white font-medium">{company.monthlyContainers}</span> containers/month
                </div>
              )}
              {hasMinOrderValue && (
                <div className="text-slate-400">
                  <span className="text-white font-medium">{company.minOrderValue}</span> min order
                </div>
              )}
              {hasPaymentTerms && (
                <div className="text-slate-400">
                  <span className="text-white font-medium">{company.paymentTerms!.join(', ')}</span>
                </div>
              )}
            </div>
          ) : (
            <div />
          )}
          <Link
            to={`/companies/${company.slug}`}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Full Profile
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export Inquiry Modal
const ExportInquiryModal = ({
  company,
  buyerData,
  onClose
}: {
  company: Company;
  buyerData: { companyName: string; country: string; contactName: string; email: string };
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    companyName: buyerData.companyName,
    country: buyerData.country,
    contactName: buyerData.contactName,
    email: buyerData.email,
    productInterest: company.categories.slice(0, 2).join(', '),
    message: '',
    targetMarket: '',
    estimatedVolume: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Export inquiry sent successfully! The supplier will respond within 24 hours.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-blue-500/30 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Send Export Inquiry</h3>
                <p className="text-slate-400 text-sm">To: {company.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
            <div className="text-blue-400 text-sm font-medium mb-2">Auto-filled from your Procurement Hub</div>
            <div className="text-white text-sm">{buyerData.companyName} ({buyerData.country})</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Your Company *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Country *</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Products Interested In</label>
            <input
              type="text"
              value={formData.productInterest}
              onChange={(e) => setFormData({...formData, productInterest: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Target Market</label>
            <input
              type="text"
              placeholder="e.g., Saudi Arabia, UAE, Egypt"
              value={formData.targetMarket}
              onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Estimated Volume</label>
            <select
              value={formData.estimatedVolume}
              onChange={(e) => setFormData({...formData, estimatedVolume: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select volume range</option>
              <option value="1-10 containers">1-10 containers</option>
              <option value="10-50 containers">10-50 containers</option>
              <option value="50+ containers">50+ containers</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Message</label>
            <textarea
              rows={4}
              placeholder="Describe your requirements, specifications, or questions..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-xl font-medium hover:bg-slate-600/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Request Quote Modal
const RequestQuoteModal = ({ company, onClose }: { company: Company; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-amber-500/30 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Request Quotation</h3>
                <p className="text-slate-400 text-sm">RFQ for: {company.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered RFQ
            </div>
            <p className="text-slate-300 text-sm">
              Our AI will help you structure the perfect RFQ and compare quotes from multiple suppliers.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Products Required</label>
            <input
              type="text"
              placeholder="e.g., Premium Olive Oil 5L x 1000 units"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Quantity</label>
              <input
                type="text"
                placeholder="e.g., 1000 units"
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Unit</label>
              <select className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option>Units</option>
                <option>Containers (20ft)</option>
                <option>Containers (40ft)</option>
                <option>Pallets</option>
                <option>KG</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Incoterms</label>
            <select className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option>FOB - Free On Board</option>
              <option>CIF - Cost, Insurance & Freight</option>
              <option>CFR - Cost and Freight</option>
              <option>EXW - Ex Works</option>
              <option>DDP - Delivered Duty Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Target Delivery Date</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-xl font-medium hover:bg-slate-600/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { toast.success('RFQ sent! You will receive quotes within 48 hours.'); onClose(); }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Send RFQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Book Meeting Modal
const BookMeetingModal = ({ company, onClose }: { company: Company; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-purple-500/30 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Book Video Meeting</h3>
                <p className="text-slate-400 text-sm">With: {company.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-2">
              <Calendar className="w-4 h-4" />
              30-Minute Consultation
            </div>
            <p className="text-slate-300 text-sm">
              Discuss your requirements, product samples, and partnership opportunities directly with the supplier.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Select Date</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Select Time</label>
            <select className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>09:00 AM - 09:30 AM</option>
              <option>10:00 AM - 10:30 AM</option>
              <option>11:00 AM - 11:30 AM</option>
              <option>02:00 PM - 02:30 PM</option>
              <option>03:00 PM - 03:30 PM</option>
              <option>04:00 PM - 04:30 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Meeting Topic</label>
            <select className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Product Requirements Discussion</option>
              <option>Sample Review Request</option>
              <option>Business Partnership Exploration</option>
              <option>Export/Import Process Questions</option>
              <option>Custom OEM/Private Label Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Additional Notes</label>
            <textarea
              rows={3}
              placeholder="Any specific topics or questions you want to discuss..."
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-xl font-medium hover:bg-slate-600/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { toast.success('Meeting scheduled! Calendar invite sent to your email.'); onClose(); }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Freight Quote Modal
interface ShippingCompany {
  id: string;
  name: string;
  country: string;
  flag: string;
  logo: string;
  partners: string;
  reliability: number;
  vessels: number;
  containers: string;
  routes: { from: string; to: string; price: string; days: number }[];
  containerTypes: string[];
}

const FreightQuoteModal = ({ company, onClose }: { company: ShippingCompany; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    originPort: '',
    destinationPort: '',
    containerType: '',
    cargoType: '',
    weight: '',
    readyDate: '',
    specialRequirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Quote request sent! ${company.name} will respond within 2 hours.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-emerald-500/30 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Ship className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Request Freight Quote</h3>
                <p className="text-slate-400 text-sm">From: {company.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
              <Shield className="w-4 h-4" />
              Escrow Protected
            </div>
            <p className="text-slate-300 text-sm">
              All freight quotes are covered by Brands Bridge Escrow Payment Protection.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Origin Port *</label>
              <input
                type="text"
                placeholder="e.g., Istanbul"
                value={formData.originPort}
                onChange={(e) => setFormData({...formData, originPort: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Destination Port *</label>
              <input
                type="text"
                placeholder="e.g., Dubai"
                value={formData.destinationPort}
                onChange={(e) => setFormData({...formData, destinationPort: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-3">Container Type *</label>
            <div className="grid grid-cols-4 gap-2">
              {['20ft', '40ft', '40ft HC', 'Reefer'].map((type) => (
                <label
                  key={type}
                  className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.containerType === type
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:border-emerald-500/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="containerType"
                    value={type}
                    checked={formData.containerType === type}
                    onChange={(e) => setFormData({...formData, containerType: e.target.value})}
                    className="sr-only"
                  />
                  <Anchor className="w-4 h-4 mr-1" />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Cargo Type</label>
            <input
              type="text"
              placeholder="e.g., FMCG Products"
              value={formData.cargoType}
              onChange={(e) => setFormData({...formData, cargoType: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Weight (MT)</label>
            <input
              type="number"
              placeholder="e.g., 25"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Ready Date</label>
            <input
              type="date"
              value={formData.readyDate}
              onChange={(e) => setFormData({...formData, readyDate: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Special Requirements</label>
            <textarea
              rows={3}
              placeholder="Any special handling requirements, temperature control, etc..."
              value={formData.specialRequirements}
              onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-xl font-medium hover:bg-slate-600/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0B5E75] to-[#0B5E75]/80 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Quote Request →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Company Card Component (Standard views)
const CompanyCard = ({ company, viewMode }: { company: Company; viewMode: 'grid' | 'list' }) => {
  if (viewMode === 'list') {
    return (
      <Link
        to={`/companies/${company.slug}`}
        className="group bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all overflow-hidden"
      >
        <div className="flex items-center p-6 gap-6">
          <img
            src={company.logo}
            alt={company.name}
            className="w-16 h-16 rounded-xl object-cover bg-white flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                {company.name}
              </h3>
              {company.verified && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <span>{company.countryFlag}</span>
              <span>{company.city}, {company.country}</span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                {company.businessType}
              </span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-1">{company.description}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/companies/${company.slug}`}
      className="group bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={company.logo}
              alt={company.name}
              className="w-14 h-14 rounded-xl object-cover bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {company.name}
                </h3>
                {company.verified && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>{company.countryFlag}</span>
                <span>{company.city}, {company.country}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
            {company.businessType}
          </span>
          <span className="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-xs font-medium">
            {company.subscriptionPlan}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {company.categories.slice(0, 2).map((cat, idx) => (
            <span key={idx} className="text-xs text-slate-400 bg-slate-700/30 px-2 py-1 rounded">
              {cat}
            </span>
          ))}
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {company.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-1">
            {company.certifications.slice(0, 2).map((cert, idx) => (
              <span key={idx} className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {cert}
              </span>
            ))}
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
};

export default CompaniesPage;
