import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Ship,
  DollarSign,
  Camera,
  FileText,
  X,
  Upload,
  Plus,
  Info,
  Flame,
  Thermometer,
  Calendar,
  Weight,
  Box
} from 'lucide-react';
import toast from 'react-hot-toast';
import SupplierSidebar from '../../components/SupplierSidebar';

// Port options for pricing
const PORTS = [
  { name: 'Jeddah', country: 'Saudi Arabia', code: 'SA' },
  { name: 'Dubai', country: 'UAE', code: 'AE' },
  { name: 'Kuwait City', country: 'Kuwait', code: 'KW' },
  { name: 'Doha', country: 'Qatar', code: 'QA' },
  { name: 'Manama', country: 'Bahrain', code: 'BH' },
  { name: 'Muscat', country: 'Oman', code: 'OM' },
  { name: 'Casablanca', country: 'Morocco', code: 'MA' },
  { name: 'Tunis', country: 'Tunisia', code: 'TN' },
  { name: 'Algiers', country: 'Algeria', code: 'DZ' },
  { name: 'Mombasa', country: 'Kenya', code: 'KE' },
  { name: 'Lagos', country: 'Nigeria', code: 'NG' },
  { name: 'Accra', country: 'Ghana', code: 'GH' },
  { name: 'Port Said', country: 'Egypt', code: 'EG' },
  { name: 'Jebel Ali', country: 'UAE', code: 'AE' },
  { name: 'Salalah', country: 'Oman', code: 'OM' },
  { name: 'Aqaba', country: 'Jordan', code: 'JO' },
  { name: 'Colombo', country: 'Sri Lanka', code: 'LK' },
  { name: 'Chennai', country: 'India', code: 'IN' },
  { name: 'Karachi', country: 'Pakistan', code: 'PK' },
  { name: 'Singapore', country: 'Singapore', code: 'SG' },
  { name: 'Port Klang', country: 'Malaysia', code: 'MY' },
  { name: 'Jakarta', country: 'Indonesia', code: 'ID' },
  { name: 'Ho Chi Minh', country: 'Vietnam', code: 'VN' },
  { name: 'Bangkok', country: 'Thailand', code: 'TH' },
  { name: 'Manila', country: 'Philippines', code: 'PH' },
  { name: 'Shanghai', country: 'China', code: 'CN' },
  { name: 'Ningbo', country: 'China', code: 'CN' },
  { name: 'Guangzhou', country: 'China', code: 'CN' },
  { name: 'Shenzhen', country: 'China', code: 'CN' },
  { name: 'Felixstowe', country: 'UK', code: 'GB' },
  { name: 'Rotterdam', country: 'Netherlands', code: 'NL' },
  { name: 'Hamburg', country: 'Germany', code: 'DE' },
  { name: 'Antwerp', country: 'Belgium', code: 'BE' },
  { name: 'Barcelona', country: 'Spain', code: 'ES' },
  { name: 'Valencia', country: 'Spain', code: 'ES' },
  { name: 'Piraeus', country: 'Greece', code: 'GR' },
  { name: 'Istanbul', country: 'Turkey', code: 'TR' },
  { name: 'Mersin', country: 'Turkey', code: 'TR' },
  { name: 'New York', country: 'USA', code: 'US' },
  { name: 'Los Angeles', country: 'USA', code: 'US' },
  { name: 'Santos', country: 'Brazil', code: 'BR' },
  { name: 'Buenos Aires', country: 'Argentina', code: 'AR' },
  { name: 'Callao', country: 'Peru', code: 'PE' },
  { name: 'Valparaiso', country: 'Chile', code: 'CL' },
  { name: 'Sydney', country: 'Australia', code: 'AU' },
  { name: 'Melbourne', country: 'Australia', code: 'AU' },
  { name: 'Auckland', country: 'New Zealand', code: 'NZ' },
];

// Product categories
const CATEGORIES = [
  'Confectionery',
  'Dairy',
  'Beverages',
  'Grains & Cereals',
  'Oils & Fats',
  'Snacks & Savory',
  'Canned Foods',
  'Frozen Foods',
  'Personal Care',
  'Household',
  'Baby Care',
  'Pet Food',
];

// Subcategories by category
const SUBCATEGORIES: Record<string, string[]> = {
  'Confectionery': ['Chocolate', 'Biscuits & Wafers', 'Candy & Gum', 'Baklava & Sweets', 'Ice Cream'],
  'Dairy': ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'UHT Products'],
  'Beverages': ['Juices', 'Soft Drinks', 'Energy Drinks', 'Tea & Coffee', 'Water'],
  'Grains & Cereals': ['Rice', 'Wheat', 'Flour', 'Pasta', 'Breakfast Cereals'],
  'Oils & Fats': ['Vegetable Oil', 'Olive Oil', 'Palm Oil', 'Margarine', 'Ghee'],
  'Snacks & Savory': ['Chips', 'Nuts', 'Crackers', 'Popcorn', 'Pretzels'],
  'Canned Foods': ['Tomato Products', 'Fish', 'Vegetables', 'Fruits', 'Beans'],
  'Frozen Foods': ['Ice Cream', 'Frozen Vegetables', 'Frozen Meat', 'Frozen Fish', 'Pizza'],
  'Personal Care': ['Shampoo', 'Soap', 'Toothpaste', 'Deodorant', 'Skincare'],
  'Household': ['Detergents', 'Cleaners', 'Paper Products', 'Plastic Items'],
  'Baby Care': ['Formula', 'Pampers', 'Baby Food', 'Baby Skincare'],
  'Pet Food': ['Dog Food', 'Cat Food', 'Bird Food', 'Fish Food'],
};

// Storage options
const STORAGE_OPTIONS = ['Ambient', 'Chilled (2-8°C)', 'Frozen (-18°C)', 'Controlled (15-25°C)'];

// Certifications
const CERTIFICATIONS = [
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'organic', label: 'Organic' },
  { id: 'non-gmo', label: 'Non-GMO' },
  { id: 'iso22000', label: 'ISO 22000' },
  { id: 'haccp', label: 'HACCP' },
  { id: 'brc', label: 'BRC' },
  { id: 'ifs', label: 'IFS' },
];

// Container types
const CONTAINER_TYPES = [
  { id: '20ft', label: '20ft Standard', capacity: '33 CBM, 28 MT' },
  { id: '40ft', label: '40ft Standard', capacity: '67 CBM, 28 MT' },
  { id: '40ft-hc', label: '40ft High Cube', capacity: '76 CBM, 28 MT' },
  { id: '40ft-reefer', label: '40ft Reefer', capacity: '60 CBM, 29 MT' },
  { id: '20ft-reefer', label: '20ft Reefer', capacity: '28 CBM, 27 MT' },
];

interface PortPrice {
  port: string;
  country: string;
  code: string;
  price: number;
  transitDays: number;
}

interface FormData {
  // Step 1: Product Details
  readyCargoConfirmed: boolean;
  productName: string;
  productVariant: string;
  category: string;
  subcategory: string;
  description: string;
  shelfLife: number;
  shelfLifeUnit: 'months' | 'years';
  storage: string;
  temperatureMin: number;
  temperatureMax: number;
  certifications: string[];
  hsCode: string;

  // Step 2: Container Details
  originPort: string;
  readyDate: string;
  containerType: string;
  containerCount: number;
  totalCases: number;
  grossWeight: number;
  volumeCBM: number;
  packingDetails: string;
  loadingPort: string;

  // Step 3: Delivered Prices
  portPrices: PortPrice[];

  // Step 4: Media
  mainImage: string;
  packagingImage: string;
  loadingImage: string;
  additionalImages: string[];
  videoUrl: string;
  videoType: string[];

  // Step 5: Terms
  auctionDuration: 12 | 24 | 48;
  autoRenew: boolean;
  confirmReady: boolean;
  confirmShip48h: boolean;
  confirmPenalty: boolean;
  agreeTerms: boolean;
  confirmAccuracy: boolean;
}

const CreateCargoListing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    readyCargoConfirmed: false,
    productName: '',
    productVariant: '',
    category: '',
    subcategory: '',
    description: '',
    shelfLife: 0,
    shelfLifeUnit: 'months',
    storage: '',
    temperatureMin: 0,
    temperatureMax: 0,
    certifications: [],
    hsCode: '',
    originPort: '',
    readyDate: '',
    containerType: '',
    containerCount: 1,
    totalCases: 0,
    grossWeight: 0,
    volumeCBM: 0,
    packingDetails: '',
    loadingPort: '',
    portPrices: [],
    mainImage: '',
    packagingImage: '',
    loadingImage: '',
    additionalImages: [],
    videoUrl: '',
    videoType: [],
    auctionDuration: 24,
    autoRenew: false,
    confirmReady: false,
    confirmShip48h: false,
    confirmPenalty: false,
    agreeTerms: false,
    confirmAccuracy: false,
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCertification = (id: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(id)
        ? prev.certifications.filter(c => c !== id)
        : [...prev.certifications, id]
    }));
  };

  const toggleVideoType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      videoType: prev.videoType.includes(type)
        ? prev.videoType.filter(t => t !== type)
        : [...prev.videoType, type]
    }));
  };

  const addPortPrice = () => {
    setFormData(prev => ({
      ...prev,
      portPrices: [...prev.portPrices, { port: '', country: '', code: '', price: 0, transitDays: 0 }]
    }));
  };

  const updatePortPrice = (index: number, field: keyof PortPrice, value: any) => {
    const updated = [...formData.portPrices];
    if (field === 'port') {
      const port = PORTS.find(p => p.name === value);
      if (port) {
        updated[index] = { ...updated[index], port: value, country: port.country, code: port.code };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setFormData(prev => ({ ...prev, portPrices: updated }));
  };

  const removePortPrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portPrices: prev.portPrices.filter((_, i) => i !== index)
    }));
  };

  const simulateImageUpload = (field: 'mainImage' | 'packagingImage' | 'loadingImage') => {
    const placeholderImages = [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-158、色自如CTO@unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop',
    ];
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    updateField(field, randomImage);
    toast.success('Image uploaded successfully');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.readyCargoConfirmed && formData.productName && formData.productVariant &&
               formData.category && formData.subcategory && formData.description &&
               formData.shelfLife > 0 && formData.storage && formData.hsCode;
      case 2:
        return formData.originPort && formData.readyDate && formData.containerType &&
               formData.containerCount > 0 && formData.totalCases > 0 &&
               formData.grossWeight > 0 && formData.volumeCBM > 0;
      case 3:
        return formData.portPrices.length >= 1 && formData.portPrices.every(p => p.port && p.price > 0);
      case 4:
        return formData.mainImage && formData.packagingImage && formData.loadingImage;
      case 5:
        return formData.confirmReady && formData.confirmShip48h && formData.confirmPenalty &&
               formData.agreeTerms && formData.confirmAccuracy;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    toast.success('Listing published successfully! Appears in /cargo-auction');
    navigate('/supplier/cargo-auction');
  };

  const steps = [
    { num: 1, label: 'Product Details', icon: Package },
    { num: 2, label: 'Container Details', icon: Ship },
    { num: 3, label: 'Delivered Prices', icon: DollarSign },
    { num: 4, label: 'Media & Docs', icon: Camera },
    { num: 5, label: 'Terms & Launch', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900">
      <SupplierSidebar activePage="cargo-create" />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
            <Flame className="w-5 h-5" />
            <span>CARGO AUCTION</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create New Listing</h1>
          <p className="text-slate-400 mt-1">List your ready-to-ship cargo for auction</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step.num
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-3 text-sm font-medium hidden md:block ${
                    currentStep >= step.num ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-16 md:w-32 h-1 mx-4 rounded ${
                    currentStep > step.num ? 'bg-amber-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">

          {/* STEP 1: Product Details */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Product Details</h2>

              {/* Ready Cargo Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">IMPORTANT — READY CARGO ONLY</h3>
                    <p className="text-amber-800 text-sm mb-4">
                      This listing is for cargo that is <strong>PHYSICALLY READY TO SHIP</strong> within 48 hours.
                      Not for on-demand production or future orders.
                    </p>
                    <p className="text-amber-800 text-sm mb-4">
                      By listing, you commit to ship within 48h of reservation. Failed shipment = penalty or ban.
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer mt-4">
                      <input
                        type="checkbox"
                        checked={formData.readyCargoConfirmed}
                        onChange={(e) => updateField('readyCargoConfirmed', e.target.checked)}
                        className="w-5 h-5 rounded border-amber-400 text-amber-500 focus:ring-amber-400"
                      />
                      <span className="text-amber-900 font-medium">
                        I confirm this cargo is ready and packed in my warehouse right now
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => updateField('productName', e.target.value)}
                    placeholder="e.g., Chocolate Wafer Bars"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Product Variant *</label>
                  <input
                    type="text"
                    value={formData.productVariant}
                    onChange={(e) => updateField('productVariant', e.target.value)}
                    placeholder="e.g., 750g Family Pack"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Subcategory *</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => updateField('subcategory', e.target.value)}
                    disabled={!formData.category}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  >
                    <option value="">Select subcategory</option>
                    {formData.category && SUBCATEGORIES[formData.category]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Description * (max 500 chars)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value.slice(0, 500))}
                    placeholder="Describe the product in detail..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                  <span className="text-xs text-slate-500">{formData.description.length}/500</span>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Shelf Life *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.shelfLife}
                      onChange={(e) => updateField('shelfLife', parseInt(e.target.value) || 0)}
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                    <select
                      value={formData.shelfLifeUnit}
                      onChange={(e) => updateField('shelfLifeUnit', e.target.value)}
                      className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Storage Requirements *</label>
                  <select
                    value={formData.storage}
                    onChange={(e) => updateField('storage', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select storage</option>
                    {STORAGE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                {formData.storage !== 'Ambient' && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Min Temp (°C)</label>
                      <input
                        type="number"
                        value={formData.temperatureMin}
                        onChange={(e) => updateField('temperatureMin', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Max Temp (°C)</label>
                      <input
                        type="number"
                        value={formData.temperatureMax}
                        onChange={(e) => updateField('temperatureMax', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Certifications</label>
                  <div className="flex flex-wrap gap-3">
                    {CERTIFICATIONS.map(cert => (
                      <label key={cert.id} className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(cert.id)}
                          onChange={() => toggleCertification(cert.id)}
                          className="w-4 h-4 rounded border-slate-500 text-amber-500 focus:ring-amber-400"
                        />
                        <span className="text-white text-sm">{cert.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">HS Code *</label>
                  <input
                    type="text"
                    value={formData.hsCode}
                    onChange={(e) => updateField('hsCode', e.target.value)}
                    placeholder="e.g., 1806.90"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Container Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Container Details</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Origin Port *</label>
                  <select
                    value={formData.originPort}
                    onChange={(e) => updateField('originPort', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select origin port</option>
                    {PORTS.map(port => (
                      <option key={port.code + port.name} value={port.name}>{port.name}, {port.country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Ready Date * (within 48h of listing)
                  </label>
                  <input
                    type="date"
                    value={formData.readyDate}
                    onChange={(e) => updateField('readyDate', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Container Type *</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {CONTAINER_TYPES.map(type => (
                      <label
                        key={type.id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                          formData.containerType === type.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="containerType"
                          value={type.id}
                          checked={formData.containerType === type.id}
                          onChange={(e) => updateField('containerType', e.target.value)}
                          className="sr-only"
                        />
                        <div className="font-semibold text-white text-sm">{type.label}</div>
                        <div className="text-xs text-slate-400 mt-1">{type.capacity}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Number of Containers *</label>
                  <input
                    type="number"
                    value={formData.containerCount}
                    onChange={(e) => updateField('containerCount', parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Total Cases/Units *</label>
                  <input
                    type="number"
                    value={formData.totalCases}
                    onChange={(e) => updateField('totalCases', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 25000"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Gross Weight (MT) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.grossWeight}
                    onChange={(e) => updateField('grossWeight', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 25.5"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Volume (CBM) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.volumeCBM}
                    onChange={(e) => updateField('volumeCBM', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 58.5"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Packing Details</label>
                  <textarea
                    value={formData.packingDetails}
                    onChange={(e) => updateField('packingDetails', e.target.value)}
                    placeholder="e.g., 24 units per carton, 100 cartons per pallet, 20 pallets per container"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Loading Port (Auto-filled from origin)</label>
                  <input
                    type="text"
                    value={formData.loadingPort || formData.originPort}
                    disabled
                    className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-xl text-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Delivered Prices */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Set CIF Prices to Destination Ports</h2>
              <p className="text-slate-400 mb-6">You are responsible for shipping the cargo to the buyer's chosen port. Prices must include all costs until port arrival.</p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">CIF Price includes:</p>
                    <p>Product cost + Freight + Insurance + Export documentation + All fees until port arrival</p>
                  </div>
                </div>
              </div>

              {/* Port Pricing Table */}
              <div className="space-y-4 mb-6">
                {formData.portPrices.map((portPrice, index) => (
                  <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Port City *</label>
                        <select
                          value={portPrice.port}
                          onChange={(e) => updatePortPrice(index, 'port', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                        >
                          <option value="">Select port</option>
                          {PORTS.map(p => (
                            <option key={p.code + p.name} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Country</label>
                        <input
                          type="text"
                          value={portPrice.country}
                          disabled
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">CIF Price (USD) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="number"
                            value={portPrice.price || ''}
                            onChange={(e) => updatePortPrice(index, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="28,500"
                            className="w-full pl-7 pr-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Transit (days)</label>
                        <input
                          type="number"
                          value={portPrice.transitDays || ''}
                          onChange={(e) => updatePortPrice(index, 'transitDays', parseInt(e.target.value) || 0)}
                          placeholder="5"
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removePortPrice(index)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addPortPrice}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Destination Port
              </button>

              {formData.portPrices.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Price Summary</h3>
                  <div className="bg-slate-700/50 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-slate-400 text-sm">Port</th>
                          <th className="text-left p-3 text-slate-400 text-sm">Country</th>
                          <th className="text-right p-3 text-slate-400 text-sm">CIF Price</th>
                          <th className="text-right p-3 text-slate-400 text-sm">Transit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.portPrices.map((pp, idx) => (
                          <tr key={idx} className="border-b border-slate-600/50">
                            <td className="p-3 text-white">{pp.port}</td>
                            <td className="p-3 text-slate-300">{pp.country}</td>
                            <td className="p-3 text-emerald-400 font-semibold text-right">${pp.price.toLocaleString()}</td>
                            <td className="p-3 text-slate-300 text-right">{pp.transitDays} days</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Platform Fee Preview */}
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">Platform Fee Preview</h4>
                    <p className="text-amber-800 text-sm">
                      Platform fee: <strong>2%</strong> of final sale
                      {formData.portPrices[0] && (
                        <> — For <strong>${formData.portPrices[0].price.toLocaleString()}</strong> sale, you receive: <strong>${Math.floor(formData.portPrices[0].price * 0.98).toLocaleString()}</strong> (after fees)</>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Media & Documentation */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Media & Documentation</h2>
              <p className="text-slate-400 mb-8">Upload photos and video (required for approval)</p>

              {/* Photos Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Photos (3-8 required)</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { field: 'mainImage', label: 'Main Product Image', required: true },
                    { field: 'packagingImage', label: 'Product Packaging', required: true },
                    { field: 'loadingImage', label: 'Container Loading', required: true },
                  ].map((photo, idx) => (
                    <div key={photo.field}>
                      <label className="block text-sm text-slate-400 mb-2">
                        {photo.label} {photo.required && <span className="text-red-400">*</span>}
                      </label>
                      {formData[photo.field as keyof FormData] ? (
                        <div className="relative aspect-video bg-slate-700 rounded-xl overflow-hidden">
                          <img
                            src={formData[photo.field as keyof FormData] as string}
                            alt={photo.label}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => updateField(photo.field as keyof FormData, '')}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => simulateImageUpload(photo.field as any)}
                          className="w-full aspect-video border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-amber-500 hover:bg-slate-700/50 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-slate-500" />
                          <span className="text-slate-400 text-sm">Click to upload</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Video (Optional but recommended)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">YouTube Embed URL</label>
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => updateField('videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Video Type</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'showcase', label: 'Product Showcase' },
                        { id: 'tour', label: 'Factory Tour' },
                        { id: 'loading', label: 'Container Loading' },
                        { id: 'inspection', label: 'Quality Inspection' },
                      ].map(type => (
                        <label key={type.id} className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.videoType.includes(type.id)}
                            onChange={() => toggleVideoType(type.id)}
                            className="w-4 h-4 rounded border-slate-500 text-amber-500"
                          />
                          <span className="text-white text-sm">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Supporting Documents (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Product Specification Sheet', 'Certificate Copies', 'Quality Test Reports', 'Export License'].map((doc, idx) => (
                    <button
                      key={doc}
                      className="p-4 border border-slate-600 rounded-xl text-left hover:border-amber-500 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-white font-medium">{doc}</p>
                          <p className="text-slate-500 text-sm">PDF format</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Terms & Launch */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Listing Summary & Launch</h2>

              {/* Summary Preview */}
              <div className="bg-slate-700/50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Listing Preview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Product</p>
                    <p className="text-white font-medium">{formData.productName} {formData.productVariant}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Category</p>
                    <p className="text-white font-medium">{formData.category} / {formData.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Container</p>
                    <p className="text-white font-medium">{formData.containerCount} × {formData.containerType}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Origin</p>
                    <p className="text-white font-medium">{formData.originPort}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400">Destination Ports</p>
                    <p className="text-white font-medium">
                      {formData.portPrices.length > 0
                        ? formData.portPrices.map(p => `${p.port} ($${p.price.toLocaleString()})`).join(', ')
                        : 'No ports added'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Auction Duration */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Auction Duration</h3>
                <div className="space-y-3">
                  {[
                    { value: 24, label: '24 hours', note: 'Recommended', recommended: true },
                    { value: 48, label: '48 hours', note: 'Low visibility', recommended: false },
                    { value: 12, label: '12 hours', note: 'Urgent only', recommended: false },
                  ].map(option => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.auctionDuration === option.value
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={option.value}
                        checked={formData.auctionDuration === option.value}
                        onChange={(e) => updateField('auctionDuration', parseInt(e.target.value) as 12 | 24 | 48)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.auctionDuration === option.value ? 'border-amber-500' : 'border-slate-500'
                      }`}>
                        {formData.auctionDuration === option.value && (
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{option.label}</span>
                          {option.recommended && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                              {option.note}
                            </span>
                          )}
                        </div>
                        {!option.recommended && (
                          <span className="text-sm text-slate-400">{option.note}</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <label className="flex items-center gap-3 mt-4 p-4 bg-slate-700 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={(e) => updateField('autoRenew', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-500 text-amber-500"
                  />
                  <div>
                    <span className="text-white font-medium">Auto-renew if no reservation</span>
                    <p className="text-slate-400 text-sm">Automatically relist once (×1 only)</p>
                  </div>
                </label>
              </div>

              {/* Supplier Commitments */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Supplier Commitments</h3>
                <p className="text-slate-400 mb-4">All checkboxes are required to publish:</p>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 bg-slate-700 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmReady}
                      onChange={(e) => updateField('confirmReady', e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-slate-500 text-amber-500"
                    />
                    <span className="text-white">I confirm cargo is physically ready and packed</span>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-slate-700 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmShip48h}
                      onChange={(e) => updateField('confirmShip48h', e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-slate-500 text-amber-500"
                    />
                    <span className="text-white">I commit to ship within 48 hours of confirmed reservation</span>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-slate-700 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmPenalty}
                      onChange={(e) => updateField('confirmPenalty', e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-slate-500 text-amber-500"
                    />
                    <div>
                      <span className="text-white">I understand canceling a confirmed reservation incurs a penalty:</span>
                      <ul className="text-slate-400 text-sm mt-2 space-y-1">
                        <li>• 1st offense: 20% of deposit as penalty fee</li>
                        <li>• 2nd offense: 6-month listing ban from cargo auction</li>
                        <li>• 3rd offense: Permanent account suspension</li>
                      </ul>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-slate-700 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField('agreeTerms', e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-slate-500 text-amber-500"
                    />
                    <span className="text-white">I agree to Brands Bridge Auction Terms</span>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-slate-700 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmAccuracy}
                      onChange={(e) => updateField('confirmAccuracy', e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-slate-500 text-amber-500"
                    />
                    <span className="text-white">I confirm all information is accurate</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t border-slate-700">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: {steps[currentStep].label}
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Flame className="w-5 h-5" />
                Publish Listing
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateCargoListing;
