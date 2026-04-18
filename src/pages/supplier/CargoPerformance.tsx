import {
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  Flame,
  Award,
  AlertTriangle
} from 'lucide-react';
import { supplierCargoStats } from '../../data/mockData';
import SupplierSidebar from '../../components/SupplierSidebar';

const CargoPerformance = () => {
  const stats = supplierCargoStats;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total revenue
  const totalRevenue = stats.revenueHistory.reduce((sum, month) => sum + month.revenue, 0);
  const avgRevenue = totalRevenue / stats.revenueHistory.length;

  return (
    <div className="flex min-h-screen bg-slate-900">
      <SupplierSidebar activePage="cargo-performance" />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
            <Flame className="w-5 h-5" />
            <span>CARGO AUCTION</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Performance Dashboard</h1>
          <p className="text-slate-400 mt-1">Track your cargo auction success metrics</p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Listings</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalListings}</div>
            <div className="text-slate-400 text-sm">all-time</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">Sold Listings</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.soldListings}</div>
            <div className="text-slate-400 text-sm">{stats.conversionRate}% conversion</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-400 text-sm">Avg Time to Sell</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.avgTimeToSell}h</div>
            <div className="text-slate-400 text-sm">average</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">On-Time Dispatch</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.onTimeRate}%</div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500 text-sm">Perfect record</span>
            </div>
          </div>
        </div>

        {/* Second Row KPIs */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Supplier Rating */}
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-300 text-sm">Supplier Rating</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-white">{stats.supplierRating}</span>
              <span className="text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(stats.supplierRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                />
              ))}
              <span className="ml-2 text-amber-400 text-sm font-medium">Verified</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Revenue</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-slate-400 text-sm">6-month total</div>
          </div>

          {/* Ranking */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-300 text-sm">Seller Ranking</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-white">Top 10%</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-400 text-sm">Top performer</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Revenue (6 Months)</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-400">Monthly Revenue</span>
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4">
            {stats.revenueHistory.map((month, idx) => {
              const maxRevenue = Math.max(...stats.revenueHistory.map(m => m.revenue));
              const heightPercent = (month.revenue / maxRevenue) * 100;
              const isAboveAvg = month.revenue > avgRevenue;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative" style={{ height: '200px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                        isAboveAvg ? 'bg-gradient-to-t from-amber-500 to-amber-400' : 'bg-slate-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-center">
                        <div className={`text-sm font-bold ${isAboveAvg ? 'text-amber-400' : 'text-slate-400'}`}>
                          ${(month.revenue / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">{month.month}</span>
                </div>
              );
            })}
          </div>

          {/* Average line indicator */}
          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
            <div className="text-slate-400 text-sm">
              <span>Average: </span>
              <span className="text-white font-semibold">{formatCurrency(avgRevenue)}</span>
              <span> / month</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-400 text-sm">
                +{Math.round(((stats.revenueHistory[stats.revenueHistory.length - 1]?.revenue || 0) / (stats.revenueHistory[0]?.revenue || 1) - 1) * 100)}% growth
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top Destinations */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Top Destinations</h2>
            <div className="space-y-4">
              {stats.topDestinations.map((dest, idx) => (
                <div key={dest.port} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    idx === 0 ? 'bg-amber-500 text-slate-900' :
                    idx === 1 ? 'bg-slate-400 text-slate-900' :
                    idx === 2 ? 'bg-amber-700 text-white' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-white font-semibold">{dest.port}</span>
                      <span className="text-slate-500 text-sm">{dest.country}</span>
                    </div>
                    <div className="mt-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                        style={{ width: `${(dest.shipments / stats.topDestinations[0].shipments) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{dest.shipments}</div>
                    <div className="text-slate-500 text-sm">shipments</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reliability Badge */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Auction Reliability</h2>

            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <div>
                    <div className="text-white font-bold text-lg">100% Reliable</div>
                    <div className="text-emerald-400 text-sm">No violations recorded</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">On-Time Shipments</span>
                  <span className="text-emerald-400 font-semibold">18/18 (100%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Late Shipments</span>
                  <span className="text-slate-300">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Cancelled</span>
                  <span className="text-slate-300">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Penalties Applied</span>
                  <span className="text-slate-300">$0</span>
                </div>
              </div>
            </div>

            {/* Penalty Warning (if any) */}
            {stats.cancellationPenalty > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-red-400 font-semibold">Attention Required</div>
                    <div className="text-slate-300 text-sm">
                      {stats.cancellationPenalty} cancellation(s) recorded. This affects your seller ranking.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Badge */}
            <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="text-white font-semibold">Verified Seller Badge</div>
                  <div className="text-slate-400 text-sm">Displayed on your cargo listings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CargoPerformance;
