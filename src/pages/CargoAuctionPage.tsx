import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  CreditCard,
  MapPin,
  Package,
  ChevronDown,
  Lock,
  AlertTriangle,
  CheckCircle,
  Ship,
  Clock,
  Eye,
  FileText,
  Play,
  X,
  ArrowRight,
  Globe,
  Thermometer,
  Calendar,
  Anchor
} from 'lucide-react';
import { cargoAuctions, CargoAuctionItem } from '../data/mockData';

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
      <div className="flex items-center gap-2 text-slate-500">
        <X className="w-5 h-5" />
        <span className="font-semibold">Auction Expired</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${getStatusColor()}`}>
      <Clock className="w-5 h-5" />
      <span className="font-mono font-bold">
        {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
      {timeLeft.hours < 1 && (
        <span className="text-red-500 font-bold">🔥 LAST HOUR</span>
      )}
    </div>
  );
};

// Media Gallery Modal
const MediaGallery = ({
  isOpen,
  onClose,
  images,
  productName
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-amber-400 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Main Image */}
        <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-4 justify-center">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === currentIndex ? 'border-amber-500' : 'border-transparent'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-center text-white mt-4">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

// Reservation Modal
const ReservationModal = ({
  isOpen,
  onClose,
  auction
}: {
  isOpen: boolean;
  onClose: () => void;
  auction: CargoAuctionItem | null;
}) => {
  const [step, setStep] = useState(1);
  const [selectedPort, setSelectedPort] = useState<typeof auction.deliveryPrices[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState('');

  useEffect(() => {
    if (isOpen && auction) {
      setSelectedPort(auction.deliveryPrices[0]);
      setStep(1);
      setIsConfirmed(false);
    }
  }, [isOpen, auction]);

  if (!isOpen || !auction) return null;

  const calculateFees = () => {
    if (!selectedPort) return { platformFee: 0, escrowFee: 0, total: 0, deposit: 0, balance: 0 };
    const platformFee = selectedPort.price * (auction.platformFees.platformFeePercent / 100);
    const total = selectedPort.price + platformFee + auction.platformFees.escrowFee;
    const deposit = total * (auction.platformFees.depositPercent / 100);
    const balance = total - deposit;
    return { platformFee, escrowFee: auction.platformFees.escrowFee, total, deposit, balance };
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsConfirmed(true);
    setReservationId(`CR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  };

  const fees = calculateFees();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            {isConfirmed ? '🎉 Reservation Confirmed!' : 'Reserve Cargo'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isConfirmed ? (
            // Confirmation Step
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </div>

              <h4 className="text-2xl font-bold text-slate-900 mb-4">Reservation Confirmed!</h4>

              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Reservation ID:</span>
                    <p className="font-bold text-slate-900">{reservationId}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Product:</span>
                    <p className="font-bold text-slate-900">{auction.productName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Destination:</span>
                    <p className="font-bold text-slate-900">{selectedPort?.port}, {selectedPort?.country}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Deposit Paid:</span>
                    <p className="font-bold text-emerald-600">${fees.deposit.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <h5 className="font-semibold text-amber-800 mb-2">Next Steps:</h5>
                <ol className="text-sm text-amber-700 space-y-1">
                  <li>1. Supplier notified — will ship within 48h</li>
                  <li>2. You'll receive tracking when cargo ships</li>
                  <li>3. Pay balance (${fees.balance.toLocaleString()}) upon arrival</li>
                  <li>4. Clear customs and receive goods</li>
                </ol>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
              >
                Back to Auctions
              </button>
            </div>
          ) : step === 1 ? (
            // Step 1: Review Order
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Review Your Order</h4>

              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={auction.media.images[0]}
                    alt={auction.productName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900">{auction.productName}</h5>
                    <p className="text-sm text-slate-500">{auction.productVariant}</p>
                    <p className="text-sm text-slate-500">{auction.supplierFlag} {auction.supplierName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Container:</span>
                    <p className="font-semibold">{auction.container.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Origin:</span>
                    <p className="font-semibold">{auction.origin.port}, {auction.origin.country}</p>
                  </div>
                </div>
              </div>

              {/* Destination Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Destination Port
                </label>
                <div className="space-y-2">
                  {auction.deliveryPrices.map((dp) => (
                    <label
                      key={dp.port}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedPort?.port === dp.port
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="port"
                          checked={selectedPort?.port === dp.port}
                          onChange={() => setSelectedPort(dp)}
                          className="sr-only"
                        />
                        <span className="text-lg">{dp.flag}</span>
                        <div>
                          <p className="font-semibold">{dp.port}, {dp.country}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">${dp.price.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h5 className="font-semibold text-slate-900 mb-3">Pricing Breakdown</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Product (CIF to {selectedPort?.port}):</span>
                    <span>${selectedPort?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee ({auction.platformFees.platformFeePercent}%):</span>
                    <span>${fees.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Escrow Fee:</span>
                    <span>${fees.escrowFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-200 pt-2 mt-2">
                    <span>Total Order Value:</span>
                    <span>${fees.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>TO PAY NOW ({auction.platformFees.depositPercent}%):</span>
                    <span>${fees.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-600">
                    <span>Balance on Arrival:</span>
                    <span>${fees.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Important Notices */}
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800">Supplier Commitment</p>
                      <p className="text-amber-700">
                        By reserving, {auction.supplierName} commits to ship this cargo within 48 hours.
                        If the supplier cancels, you receive full refund + platform credit.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Buyer Commitment</p>
                      <p className="text-red-700">
                        By paying the deposit, you commit to the purchase.
                        If you cancel after deposit, 50% becomes non-refundable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Payment
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Select Payment Method</h4>

              <div className="space-y-3 mb-6">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="sr-only"
                  />
                  <CreditCard className="w-6 h-6 text-slate-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Credit/Debit Card</p>
                    <p className="text-sm text-slate-500">Visa, Mastercard, Amex</p>
                  </div>
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    {paymentMethod === 'card' && <CheckCircle className="w-5 h-5 text-amber-500" />}
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'bank'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="sr-only"
                  />
                  <Globe className="w-6 h-6 text-slate-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Bank Transfer (SWIFT)</p>
                    <p className="text-sm text-slate-500">International wire transfer</p>
                  </div>
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    {paymentMethod === 'bank' && <CheckCircle className="w-5 h-5 text-amber-500" />}
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Smith"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <h5 className="font-semibold text-slate-900 mb-3">Bank Transfer Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bank:</span>
                      <span className="font-medium">Qatar National Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Name:</span>
                      <span className="font-medium">BRANDS BRIDGE TRADING WLL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">IBAN:</span>
                      <span className="font-medium">QA55XXXXXXXXXXXXXX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reference:</span>
                      <span className="font-medium font-mono">CARGO-{auction.id}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount to Pay */}
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-amber-800">Amount to Pay Now:</span>
                  <span className="text-2xl font-bold text-amber-900">${fees.deposit.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Process Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const CargoAuctionPage = () => {
  const [selectedPort, setSelectedPort] = useState<{ [key: string]: string }>({});
  const [showGallery, setShowGallery] = useState(false);
  const [galleryAuction, setGalleryAuction] = useState<CargoAuctionItem | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [reservationAuction, setReservationAuction] = useState<CargoAuctionItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('expiring');

  const activeAuctions = cargoAuctions.filter(a => a.auction.status === 'active');

  const categories = ['All', ...new Set(activeAuctions.map(a => a.category))];

  const filteredAuctions = activeAuctions
    .filter(a => categoryFilter === 'All' || a.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'expiring') {
        return new Date(a.auction.expiresAt).getTime() - new Date(b.auction.expiresAt).getTime();
      }
      if (sortBy === 'price-low') {
        const aPrice = Math.min(...a.deliveryPrices.map(dp => dp.price));
        const bPrice = Math.min(...b.deliveryPrices.map(dp => dp.price));
        return aPrice - bPrice;
      }
      if (sortBy === 'price-high') {
        const aPrice = Math.min(...a.deliveryPrices.map(dp => dp.price));
        const bPrice = Math.min(...b.deliveryPrices.map(dp => dp.price));
        return bPrice - aPrice;
      }
      return 0;
    });

  const getSelectedPrice = (auction: CargoAuctionItem) => {
    const portId = selectedPort[auction.id] || auction.deliveryPrices[0].port;
    return auction.deliveryPrices.find(dp => dp.port === portId)?.price || 0;
  };

  const getSelectedPort = (auction: CargoAuctionItem) => {
    const portId = selectedPort[auction.id] || auction.deliveryPrices[0].port;
    return auction.deliveryPrices.find(dp => dp.port === portId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-3">
            <Ship className="w-5 h-5" />
            <span>DAILY CARGO AUCTION</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Reserve Cargo Before Others
          </h1>

          <p className="text-amber-100 max-w-2xl mb-6 text-lg">
            Exclusive access to ready-to-ship containers at fixed delivered prices.
            Pay 20% deposit to secure your cargo. First come, first served.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">Escrow Protected</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium">Platform Guarantee</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">KYB Verified Sellers</span>
            </div>
          </div>

          {/* Premium Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
            <span className="text-amber-400">Premium Member Feature</span>
            <Link to="/pricing" className="text-amber-400 font-semibold hover:text-amber-300 ml-2">
              Upgrade Now →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">How Cargo Auction Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, icon: <Search className="w-6 h-6" />, title: 'Browse Cargo', desc: 'View available containers with delivered prices' },
              { step: 2, icon: <MapPin className="w-6 h-6" />, title: 'Select Port', desc: 'Choose your destination port' },
              { step: 3, icon: <CreditCard className="w-6 h-6" />, title: 'Pay 20% Deposit', desc: 'Secure your reservation instantly' },
              { step: 4, icon: <Package className="w-6 h-6" />, title: 'Receive Cargo', desc: 'Pay balance on arrival, receive goods' }
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </div>
                  <div className="text-sm text-slate-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Auctions Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Active Cargo ({filteredAuctions.length})</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4" />
              Auctions expire in real-time
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="expiring">Expiring Soonest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Cargo Listings */}
        <div className="space-y-6">
          {filteredAuctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* LEFT - Product Image */}
                <div className="relative bg-slate-100 p-4">
                  <div
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group"
                    onClick={() => {
                      setGalleryAuction(auction);
                      setShowGallery(true);
                    }}
                  >
                    <img
                      src={auction.media.images[0]}
                      alt={auction.productName}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3">
                    {auction.auction.status === 'active' && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Available
                      </div>
                    )}
                  </div>

                  {/* View Count */}
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <Eye className="w-4 h-4" />
                    {auction.auction.views} views
                  </div>

                  {/* View All Photos Link */}
                  {auction.media.images.length > 1 && (
                    <button
                      onClick={() => {
                        setGalleryAuction(auction);
                        setShowGallery(true);
                      }}
                      className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      View All Photos ({auction.media.images.length})
                    </button>
                  )}
                </div>

                {/* CENTER - Product Details */}
                <div className="p-6 lg:border-l lg:border-slate-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{auction.productName}</h3>
                      <p className="text-slate-500">{auction.productVariant}</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                      {auction.category}
                    </span>
                  </div>

                  {/* Supplier */}
                  <Link
                    to={`/companies/${auction.supplierId}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors mb-4"
                  >
                    <span className="text-lg">{auction.supplierFlag}</span>
                    <span className="font-medium">{auction.supplierName}</span>
                    {auction.supplierVerified && (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                  </Link>

                  {/* Container Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>{auction.container.type} ({auction.container.cases} cases)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Anchor className="w-4 h-4 text-slate-400" />
                      <span>From: {auction.origin.port}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Ready to ship: Today</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span>{auction.container.grossWeight}</span>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {auction.certifications.map((cert, idx) => (
                      <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                        {cert}
                      </span>
                    ))}
                  </div>

                  {/* Product Details Card */}
                  <div className="bg-slate-50 rounded-xl p-3 text-sm mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500">Shelf life:</span>
                        <p className="font-medium text-slate-700">{auction.productDetails.shelfLife}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Storage:</span>
                        <p className="font-medium text-slate-700">{auction.productDetails.storage}</p>
                      </div>
                      {auction.productDetails.minTemp !== undefined && (
                        <div className="col-span-2 flex items-center gap-1">
                          <Thermometer className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Temp:</span>
                          <span className="font-medium text-slate-700">
                            {auction.productDetails.minTemp}°C - {auction.productDetails.maxTemp}°C
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Target Markets */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Target:</span>
                    {auction.targetMarkets.map((market, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 text-xs">
                        {market}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RIGHT - Pricing Panel */}
                <div className="bg-slate-50 p-6 flex flex-col">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Select Destination Port</h4>

                  {/* Port Dropdown */}
                  <div className="relative mb-4">
                    <select
                      value={selectedPort[auction.id] || auction.deliveryPrices[0].port}
                      onChange={(e) => setSelectedPort({ ...selectedPort, [auction.id]: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    >
                      {auction.deliveryPrices.map((dp) => (
                        <option key={dp.port} value={dp.port}>
                          {dp.flag} {dp.port}, {dp.country} - ${dp.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Price Display */}
                  <div className="bg-amber-50 rounded-xl p-4 mb-4 text-center">
                    <div className="text-sm text-amber-600 mb-1">Delivered CIF Price</div>
                    <div className="text-3xl font-bold text-slate-900">
                      ${getSelectedPrice(auction).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {getSelectedPort(auction)?.flag} to {getSelectedPort(auction)?.port}
                    </div>
                  </div>

                  {/* Deposit Info */}
                  <div className="text-center mb-4">
                    <div className="text-sm text-slate-500">Deposit Required (20%)</div>
                    <div className="text-xl font-bold text-emerald-600">
                      ${(getSelectedPrice(auction) * 0.2).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500">
                      Balance on arrival: ${(getSelectedPrice(auction) * 0.8).toLocaleString()}
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="mb-4 text-center">
                    <div className="text-sm text-slate-500 mb-2">Auction Ends In</div>
                    <CountdownTimer expiresAt={auction.auction.expiresAt} />
                  </div>

                  {/* Reserve Button */}
                  <button
                    onClick={() => {
                      setReservationAuction(auction);
                      setShowReservation(true);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 mb-3"
                  >
                    <CreditCard className="w-5 h-5" />
                    RESERVE NOW
                  </button>

                  {/* Secure Payment */}
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Lock className="w-4 h-4" />
                    Secure payment via escrow
                  </div>

                  {/* Platform Guarantee */}
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                    <div className="font-semibold mb-1">🛡️ Brands Bridge Guarantee:</div>
                    Full refund if supplier fails to ship within 48h
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Auctions</h3>
            <p className="text-slate-500 mb-4">Check back soon for new cargo listings!</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
            >
              List Your Cargo
            </Link>
          </div>
        )}

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

      {/* Modals */}
      {galleryAuction && (
        <MediaGallery
          isOpen={showGallery}
          onClose={() => setShowGallery(false)}
          images={galleryAuction.media.images}
          productName={galleryAuction.productName}
        />
      )}

      <ReservationModal
        isOpen={showReservation}
        onClose={() => {
          setShowReservation(false);
          setReservationAuction(null);
        }}
        auction={reservationAuction}
      />
    </div>
  );
};

// Helper component for How It Works
const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default CargoAuctionPage;
