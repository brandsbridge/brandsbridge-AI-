import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, RefreshCw, Clock, BarChart3, Wheat, Droplets, Milk, Candy, Bell, ArrowRight } from 'lucide-react';
import { getLiveCommodityPrices, generateMarketInsights, CommodityData, MarketInsight } from '../services/marketDataService';

const MarketIndexPage = () => {
  const [prices, setPrices] = useState<CommodityData[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'QAR'>('USD');
  const USD_TO_QAR = 3.64; // Fixed exchange rate for demo

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPrices(getLiveCommodityPrices());
      setInsights(generateMarketInsights());
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  const filteredPrices = activeCategory === 'all'
    ? prices
    : prices.filter(p => p.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Commodities', icon: BarChart3, color: 'bg-slate-600' },
    { id: 'grains', name: 'Grains', icon: Wheat, color: 'bg-amber-600' },
    { id: 'sugar', name: 'Sugar', icon: Candy, color: 'bg-pink-600' },
    { id: 'oils', name: 'Oils', icon: Droplets, color: 'bg-emerald-600' },
    { id: 'dairy', name: 'Dairy', icon: Milk, color: 'bg-blue-600' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grains': return Wheat;
      case 'sugar': return Candy;
      case 'oils': return Droplets;
      case 'dairy': return Milk;
      default: return BarChart3;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grains': return 'bg-amber-100 text-amber-600';
      case 'sugar': return 'bg-pink-100 text-pink-600';
      case 'oils': return 'bg-emerald-100 text-emerald-600';
      case 'dairy': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  // Format price based on selected currency
  const formatPrice = (priceUSD: number) => {
    if (currency === 'QAR') {
      const priceQAR = priceUSD * USD_TO_QAR;
      return `ر.ق ${priceQAR.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `$${priceUSD.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
            <BarChart3 className="w-4 h-4" />
            BRANDS BRIDGE MARKET INDEX
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Live Commodity Prices
              </h1>
              <p className="text-slate-300 max-w-2xl">
                Strong demand for dairy products in Qatar following food security initiatives. GCC FMCG market projected to grow 8.2% in 2025.
              </p>
            </div>
            {/* Currency Selector */}
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  currency === 'USD' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('QAR')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  currency === 'QAR' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                QAR (ر.ق)
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className={`ml-4 flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors ${isRefreshing ? 'opacity-50' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Insights */}
        {insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Market Insights
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {insights.slice(0, 3).map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-xl border ${
                    insight.impact === 'positive' ? 'bg-emerald-50 border-emerald-200' :
                    insight.impact === 'negative' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <h3 className={`font-semibold text-sm mb-2 ${
                    insight.impact === 'positive' ? 'text-emerald-800' :
                    insight.impact === 'negative' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {insight.title}
                  </h3>
                  <p className={`text-xs ${
                    insight.impact === 'positive' ? 'text-emerald-700' :
                    insight.impact === 'negative' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    {insight.summary}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">{insight.source}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeCategory === cat.id
                  ? `${cat.color} text-white shadow-lg`
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Price Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Commodity</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Price (USD)</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Change</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">% Change</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">24h Range</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Exchange</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.map((price, idx) => {
                  const CategoryIcon = getCategoryIcon(price.category);
                  return (
                    <tr key={price.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(price.category)}`}>
                            <CategoryIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{price.name}</div>
                            <div className="text-xs text-slate-500">per {price.unit} • {price.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-slate-900">
                          {formatPrice(price.currentPrice)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end gap-1 font-medium ${
                          price.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {price.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {price.change >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                          price.changePercent >= 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600">
                        {formatPrice(price.low24h)} - {formatPrice(price.high24h)}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{price.exchange}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Alert CTA */}
        <div className="mt-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Set Price Alerts</h3>
                <p className="text-amber-100">Get notified when commodities hit your target prices</p>
              </div>
            </div>
            <Link
              to="/agents"
              className="flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-colors whitespace-nowrap"
            >
              Open Market Watch Agent
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Disclaimer:</strong> Prices shown are simulated for demonstration purposes and sourced from historical market data.
          Actual transaction prices may vary. Brands Bridge AI does not guarantee accuracy.
          Always verify prices with your trading partners before making business decisions.
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Need to Source These Commodities?</h3>
              <p className="text-slate-300">Find verified suppliers and manufacturers on our platform.</p>
            </div>
            <Link
              to="/companies"
              className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors whitespace-nowrap"
            >
              Browse Suppliers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIndexPage;
