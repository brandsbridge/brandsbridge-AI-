import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Eye,
  Clock,
  Edit,
  TrendingUp,
  X,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Flame
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  supplierCargoListings,
  supplierCargoReservations,
  supplierCargoStats
} from '../../data/mockData';
import SupplierSidebar from '../../components/SupplierSidebar';

// Define local types to match existing interface
interface ListingType {
  id: string;
  productName: string;
  productVariant: string;
  container: {
    type: string;
    quantity: number;
    cases: number;
    grossWeight: string;
    volume?: string;
  };
  deliveryPrices: {
    port: string;
    country: string;
    price: number;
    flag: string;
  }[];
  auction: {
    createdAt: string;
    expiresAt: string;
    status: 'active' | 'reserved' | 'sold' | 'expired';
    duration: number;
    autoRenew: boolean;
  };
  stats: {
    views: number;
    reservations: number;
  };
  media: {
    images: string[];
  };
}

// Countdown Timer Component
const CountdownTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, expired: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const getStatusColor = () => {
    const totalHours = timeLeft.hours + timeLeft.minutes / 60 + timeLeft.seconds / 3600;
    if (timeLeft.expired) return 'text-slate-500';
    if (totalHours < 1) return 'text-red-500 animate-pulse';
    if (totalHours < 6) return 'text-red-500';
    if (totalHours < 12) return 'text-amber-500';
    return 'text-emerald-500';
  };

  if (timeLeft.expired) {
    return (
      <span className="text-slate-500 flex items-center gap-1">
        <X className="w-4 h-4" />
        Expired
      </span>
    );
  }

  return (
    <span className={`font-mono font-semibold ${getStatusColor()}`}>
      {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m
      {timeLeft.hours < 1 && <span className="ml-2 text-red-500 font-bold animate-pulse">🔥 URGENT</span>}
    </span>
  );
};

// Boost Confirmation Modal
const BoostModal = ({ isOpen, onClose, listing, onBoost }: {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingType | null;
  onBoost: () => void;
}) => {
  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-amber-500/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Boost Listing</h3>
          <p className="text-slate-400">Feature "{listing.productName}" at the top for 6 hours</p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl font-bold text-amber-900">$49</div>
          <div className="text-sm text-amber-600">boost fee</div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Appears first in /cargo-auction</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Premium badge on listing card</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>6 hours of increased visibility</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onBoost();
              onClose();
              toast.success('Listing boosted for 6 hours!');
            }}
            className="flex-1 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors"
          >
            Pay $49 & Boost
          </button>
        </div>
      </div>
    </div>
  );
};

// Cancel Confirmation Modal
const CancelModal = ({ isOpen, onClose, listing, onCancel }: {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingType | null;
  onCancel: () => void;
}) => {
  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-red-500/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cancel Listing</h3>
          <p className="text-slate-400">Are you sure you want to cancel "{listing.productName}"?</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2 text-sm text-red-700">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Warning</p>
              <p>Canceling a listing before expiry may affect your supplier rating. Repeated cancellations may result in auction access restrictions.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
          >
            Keep Listing
          </button>
          <button
            onClick={() => {
              onCancel();
              onClose();
              toast.error('Listing cancelled');
            }}
            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const CargoAuctionDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'expired' | 'cancelled'>('active');
  const [boostModal, setBoostModal] = useState<ListingType | null>(null);
  const [cancelModal, setCancelModal] = useState<ListingType | null>(null);

  // Mock stats for demo
  const stats = {
    activeListings: supplierCargoListings.filter(l => l.auction.status === 'active').length,
    totalReservations: supplierCargoReservations.length,
    revenue30d: 184300,
    onTimeRate: 100
  };

  const filteredListings = supplierCargoListings.filter(listing => {
    switch (activeTab) {
      case 'active': return listing.auction.status === 'active';
      case 'sold': return listing.auction.status === 'sold';
      case 'expired': return listing.auction.status === 'expired';
      case 'cancelled': return listing.auction.status === 'reserved';
      default: return true;
    }
  });

  const getPriceRange = (listing: ListingType) => {
    const prices = listing.deliveryPrices.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <SupplierSidebar activePage="cargo-listings" />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
              <Flame className="w-5 h-5" />
              <span>CARGO AUCTION</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Cargo Auction Listings</h1>
            <p className="text-slate-400 mt-1">Sell ready-to-ship containers on Brands Bridge auction</p>
          </div>
          <Link
            to="/supplier/cargo-auction/new"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/30"
          >
            + Create New Listing
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">Active Listings</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.activeListings}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-400 text-sm">Reservations (30d)</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalReservations}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-400 text-sm">Revenue (30d)</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">${(stats.revenue30d / 1000).toFixed(0)}K</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">On-Time Dispatch</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">{stats.onTimeRate}%</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {[
            { key: 'active', label: 'Active', count: 2 },
            { key: 'sold', label: 'Sold', count: 12 },
            { key: 'expired', label: 'Expired', count: 3 },
            { key: 'cancelled', label: 'Cancelled', count: 1 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Listings Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Listing</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Container</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Price Range</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Time Left</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Views</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map(listing => {
                const priceRange = getPriceRange(listing);
                return (
                  <tr key={listing.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.media.images[0]}
                          alt={listing.productName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">{listing.productName}</p>
                          <p className="text-sm text-slate-400">{listing.productVariant}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300">{listing.container.quantity} × {listing.container.type}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-emerald-400">
                        ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <CountdownTimer expiresAt={listing.auction.expiresAt} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Eye className="w-4 h-4" />
                        <span>{listing.stats.views}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/supplier/cargo-auction/edit/${listing.id}`)}
                          className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        {listing.auction.status === 'active' && (
                          <>
                            <button
                              onClick={() => setBoostModal(listing)}
                              className="px-3 py-1.5 text-sm bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                            >
                              <TrendingUp className="w-4 h-4" />
                              Boost
                            </button>
                            <button
                              onClick={() => setCancelModal(listing)}
                              className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No listings in this category</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-slate-500">
            Showing {filteredListings.length} of {supplierCargoListings.length} listings
          </div>
          <div className="flex gap-4">
            <Link
              to="/supplier/cargo-auction/reservations"
              className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Active Reservations
              {supplierCargoReservations.filter(r => r.status === 'awaiting_dispatch').length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {supplierCargoReservations.filter(r => r.status === 'awaiting_dispatch').length}
                </span>
              )}
            </Link>
            <Link
              to="/supplier/cargo-auction/stats"
              className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              Performance Stats
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Modals */}
      <BoostModal
        isOpen={!!boostModal}
        onClose={() => setBoostModal(null)}
        listing={boostModal}
        onBoost={() => {}}
      />
      <CancelModal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        listing={cancelModal}
        onCancel={() => {}}
      />
    </div>
  );
};

export default CargoAuctionDashboard;