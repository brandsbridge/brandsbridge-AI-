import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor, Clock, Shield, CreditCard, MapPin, Package,
  ChevronDown, Lock, AlertTriangle, CheckCircle, Ship
} from 'lucide-react';
import { cargoAuctions } from '../data/mockData';

const CargoAuctionPage = () => {
  const [selectedPort, setSelectedPort] = useState<{ [key: string]: string }>({});

  const activeAuctions = cargoAuctions.filter(a => a.status === 'active');

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
            <Ship className="w-4 h-4" />
            DAILY CARGO AUCTION
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Reserve Cargo Before Others
          </h1>
          <p className="text-amber-100 max-w-2xl mb-6">
            Exclusive access to ready-to-ship containers at fixed delivered prices.
            Pay 20% deposit to secure your cargo. First come, first served.
          </p>

          {/* Access Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm">Premium Member Feature</span>
            <Link to="/pricing" className="text-amber-400 font-semibold hover:text-amber-300 ml-2">
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">How Cargo Auction Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-slate-900">Browse Cargo</div>
                <div className="text-sm text-slate-500">View available containers with delivered prices</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-slate-900">Select Port</div>
                <div className="text-sm text-slate-500">Choose your destination port</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-slate-900">Pay 20% Deposit</div>
                <div className="text-sm text-slate-500">Secure your reservation instantly</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-slate-900">Receive Cargo</div>
                <div className="text-sm text-slate-500">Pay balance on arrival, receive goods</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Auctions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Active Cargo ({activeAuctions.length})</h2>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Auctions expire in real-time
            </div>
          </div>

          {activeAuctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-6 p-6">
                {/* Product Info */}
                <div className="lg:col-span-2">
                  <div className="flex gap-4">
                    <img
                      src={auction.productImage}
                      alt={auction.productName}
                      className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{auction.productName}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          auction.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          auction.status === 'reserved' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {auction.status === 'active' ? 'Available' : auction.status}
                        </div>
                      </div>
                      <div className="text-slate-600 mb-3">{auction.sellerName}</div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Package className="w-4 h-4 text-slate-400" />
                          {auction.quantity}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Anchor className="w-4 h-4 text-slate-400" />
                          From: {auction.originPort}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {auction.certifications.map((cert, idx) => (
                          <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                            {cert}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                        {auction.specifications}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Action */}
                <div className="lg:border-l lg:border-slate-200 lg:pl-6">
                  <div className="mb-4">
                    <div className="text-sm text-slate-500 mb-2">Select Destination Port</div>
                    <div className="relative">
                      <select
                        value={selectedPort[auction.id] || auction.destinationPorts[0].port}
                        onChange={(e) => setSelectedPort({ ...selectedPort, [auction.id]: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {auction.destinationPorts.map((dp) => (
                          <option key={dp.port} value={dp.port}>
                            {dp.port} - ${dp.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 mb-4">
                    <div className="text-sm text-amber-600 mb-1">Delivered Price</div>
                    <div className="text-3xl font-bold text-slate-900">
                      ${(auction.destinationPorts.find(
                        dp => dp.port === (selectedPort[auction.id] || auction.destinationPorts[0].port)
                      )?.price || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Deposit: ${auction.minDeposit.toLocaleString()} ({auction.depositPercent}%)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-amber-600 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{getTimeRemaining(auction.expiresAt)}</span>
                  </div>

                  <button className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Reserve Now
                  </button>

                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <Shield className="w-4 h-4" />
                    Secure payment via escrow
                  </div>
                </div>
              </div>

              {/* Target Markets */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">Target Markets:</span>
                  {auction.targetMarkets.map((market, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600 text-xs">
                      {market}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Important:</strong> By reserving cargo, you agree to pay the remaining balance within 48 hours of cargo arrival.
            Deposits are non-refundable if you cancel after reservation. Brands Bridge AI facilitates the transaction but does not own any products listed.
          </div>
        </div>

        {/* Seller CTA */}
        <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Have Cargo to Sell?</h3>
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
    </div>
  );
};

export default CargoAuctionPage;
