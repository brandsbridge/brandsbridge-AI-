import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Search, Loader2, CheckCircle2,
  Package, Globe, Zap, Target, TrendingUp, Shield,
  ChevronRight, Star, MessageSquare, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const BuyerAISourcingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const capabilities = [
    { icon: Search, title: 'Smart Matching', desc: 'AI matches your requirements with verified suppliers' },
    { icon: Globe, title: 'Global Reach', desc: 'Access suppliers from 100+ countries' },
    { icon: Zap, title: 'Instant Results', desc: 'Get supplier matches in seconds' },
    { icon: Target, title: 'Precision Search', desc: 'Filter by certifications, capacity, MOQ' },
    { icon: TrendingUp, title: 'Market Insights', desc: 'Real-time pricing and demand data' },
    { icon: Shield, title: 'Verified Suppliers', desc: 'All suppliers vetted for reliability' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    setIsSearching(true);
    setHasSearched(true);

    // Simulate AI search
    setTimeout(() => {
      setSearchResults([
        {
          id: 'sup-001',
          name: 'Golden Foods International',
          country: 'Turkey',
          flag: '🇹🇷',
          category: 'Confectionery & Snacks',
          rating: 4.8,
          verified: true,
          moq: '500 cases',
          certifications: ['ISO 22000', 'HACCP', 'FDA'],
          matchScore: 96,
          annualCapacity: '5,000 MT',
          exportsTo: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait']
        },
        {
          id: 'sup-002',
          name: 'Ankara Gida Sanayi',
          country: 'Turkey',
          flag: '🇹🇷',
          category: 'Dairy Products',
          rating: 4.6,
          verified: true,
          moq: '1,000 cartons',
          certifications: ['ISO 9001', 'ISO 14001'],
          matchScore: 89,
          annualCapacity: '12,000 MT',
          exportsTo: ['UAE', 'Oman', 'Bahrain']
        },
        {
          id: 'sup-003',
          name: 'Bosphorus Trading Co.',
          country: 'Turkey',
          flag: '🇹🇷',
          category: 'Beverages & Juices',
          rating: 4.5,
          verified: true,
          moq: '2,000 cases',
          certifications: ['ISO 22000', 'Halal'],
          matchScore: 84,
          annualCapacity: '8,000 MT',
          exportsTo: ['UAE', 'Saudi Arabia', 'Egypt']
        },
      ]);
      setIsSearching(false);
      toast.success(`Found 3 matching suppliers!`);
    }, 1500);
  };

  const handleContactSupplier = (supplier: any) => {
    toast.success(`Opening chat with ${supplier.name}...`);
  };

  const handleViewProfile = (supplierId: string) => {
    navigate(`/companies/supplier-${supplierId}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Header */}
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                AI Sourcing Assistant
              </h1>
              <p className="text-slate-400 text-sm">Find perfect suppliers with AI-powered matching</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* AI Search Box */}
        <div className="bg-gradient-to-br from-[#D4AF37]/20 via-[#111827] to-[#111827] border border-[#D4AF37]/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-medium">AI-Powered Search</span>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Describe what you're looking for... e.g., 'Premium chocolate wafer manufacturers from Turkey exporting to GCC'"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-slate-400">Try:</span>
            {['Confectionery', 'Dairy', 'Beverages', 'Snacks', 'Organic'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag + ' manufacturers from Turkey')}
                className="px-3 py-1 text-xs bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Matching Suppliers ({searchResults.length})
              </h2>
              <span className="text-sm text-slate-400">Powered by AI matching algorithm</span>
            </div>

            {isSearching ? (
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-12 text-center">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
                <p className="text-slate-400">AI is analyzing {searchResults.length > 0 ? 'refining' : 'your'} results...</p>
              </div>
            ) : (
              searchResults.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-2xl">
                        {supplier.flag}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-lg">{supplier.name}</h3>
                          {supplier.verified && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{supplier.category}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="w-4 h-4 fill-current" />
                            {supplier.rating}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">MOQ: {supplier.moq}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">Capacity: {supplier.annualCapacity}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {supplier.certifications.map((cert: string) => (
                            <span key={cert} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">
                        {supplier.matchScore}% Match
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleContactSupplier(supplier)}
                          className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Contact
                        </button>
                        <button
                          onClick={() => handleViewProfile(supplier.id)}
                          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm flex items-center gap-2"
                        >
                          View Profile
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Capabilities Grid */}
        {!hasSearched && (
          <>
            <h2 className="text-lg font-bold text-white mb-4">AI Sourcing Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.map((cap, index) => (
                <div
                  key={index}
                  className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-all"
                >
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-4">
                    <cap.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{cap.title}</h3>
                  <p className="text-slate-400 text-sm">{cap.desc}</p>
                </div>
              ))}
            </div>

            {/* Example Searches */}
            <div className="mt-8 bg-[#111827] border border-slate-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                Example AI Searches
              </h3>
              <div className="space-y-3">
                {[
                  "Find halal-certified snack exporters from Turkey to Saudi Arabia",
                  "Locate private label chocolate manufacturers with FDA approval",
                  "Search for UHT milk suppliers with cold chain logistics",
                  "Find confectionery brands looking for GCC distributors"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(example);
                      setHasSearched(true);
                      setIsSearching(true);
                      setTimeout(() => {
                        setSearchResults([
                          { id: 'ex-' + index, name: 'Sample Supplier ' + (index + 1), country: 'Turkey', flag: '🇹🇷', category: 'Snacks', rating: 4.5 + (index * 0.1), verified: true, moq: '500 cases', certifications: ['ISO 22000'], matchScore: 90 - (index * 5), annualCapacity: '3,000 MT', exportsTo: ['UAE', 'Saudi'] },
                        ]);
                        setIsSearching(false);
                        toast.success(`Found matching supplier!`);
                      }, 1500);
                    }}
                    className="w-full text-left p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
                  >
                    <p className="text-slate-300 text-sm group-hover:text-white transition-colors">{example}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerAISourcingPage;
