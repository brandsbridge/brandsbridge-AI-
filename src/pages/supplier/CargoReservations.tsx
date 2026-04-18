import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Ship,
  FileText,
  Upload,
  X,
  MapPin,
  User,
  Building2,
  Flame,
  ArrowRight,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supplierCargoReservations } from '../../data/mockData';
import SupplierSidebar from '../../components/SupplierSidebar';

// Define local type to match existing interface
interface ReservationType {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  buyerFlag: string;
  contactPerson: string;
  productName: string;
  containerType: string;
  destination: {
    port: string;
    country: string;
    flag: string;
  };
  totalPrice: number;
  depositPaid: number;
  balanceOnArrival: number;
  status: 'awaiting_dispatch' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shipByDate: string;
  trackingInfo?: string;
  blNumber?: string;
  isUrgent: boolean;
  timeRemaining: string;
}

// Countdown Timer Component
const ShipCountdown = ({ shipByDate }: { shipByDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(shipByDate);
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
  }, [shipByDate]);

  const isUrgent = timeLeft.hours < 24;

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-bold">OVERDUE</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-500' : 'text-emerald-400'}`}>
      <Clock className="w-5 h-5" />
      <span className={`font-mono font-bold ${isUrgent ? 'text-red-500 animate-pulse' : ''}`}>
        {timeLeft.hours}h {String(timeLeft.minutes).padStart(2, '0')}m remaining
      </span>
      {isUrgent && (
        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
          URGENT
        </span>
      )}
    </div>
  );
};

// Cancel Modal
const CancelModal = ({ isOpen, onClose, reservation, onCancel }: {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationType | null;
  onCancel: () => void;
}) => {
  if (!isOpen || !reservation) return null;

  const penaltyAmount = Math.floor(reservation.depositPaid * 0.2);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-red-500/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cancel Reservation</h3>
          <p className="text-slate-400">Are you sure you cannot fulfill this order?</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <h4 className="font-bold text-red-900 mb-2">Canceling triggers:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            <li>• Penalty fee: <strong>${penaltyAmount.toLocaleString()}</strong> ({Math.floor(reservation.depositPaid * 0.2)}% of deposit)</li>
            <li>• Rating decrease</li>
            <li>• Possible account ban after 3 offenses</li>
          </ul>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <div className="text-sm text-slate-400 mb-1">Reservation ID</div>
          <div className="text-white font-mono">{reservation.id}</div>
          <div className="text-sm text-slate-400 mt-2 mb-1">Buyer</div>
          <div className="text-white">{reservation.buyerCompany}</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
          >
            Keep Reservation
          </button>
          <button
            onClick={() => {
              onCancel();
              onClose();
              toast.error('Reservation cancelled. Penalty fee applied.');
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

// Export Docs Modal
const ExportDocsModal = ({ isOpen, onClose, reservation }: {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationType | null;
}) => {
  if (!isOpen || !reservation) return null;

  const docs = [
    { name: 'Commercial Invoice', desc: 'Auto-filled with buyer/seller details' },
    { name: 'Packing List', desc: 'Auto-filled with container contents' },
    { name: 'Certificate of Origin', desc: 'Export declaration document' },
    { name: 'Bill of Lading', desc: 'To be uploaded after loading' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Generate Export Documents</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {docs.map((doc, idx) => (
            <button
              key={idx}
              onClick={() => toast.success(`${doc.name} generated!`)}
              className="w-full p-4 bg-slate-700 rounded-xl flex items-center gap-4 hover:bg-slate-600 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{doc.name}</p>
                <p className="text-sm text-slate-400">{doc.desc}</p>
              </div>
              <Download className="w-5 h-5 text-slate-400" />
            </button>
          ))}
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <p className="text-emerald-400 text-sm">
            All documents are auto-filled with reservation details and ready for download as PDF.
          </p>
        </div>
      </div>
    </div>
  );
};

// Book Freight Modal
const BookFreightModal = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Book Freight</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Route</div>
            <div className="text-white font-semibold">Istanbul → Jeddah</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Container</div>
            <div className="text-white font-semibold">40ft High Cube</div>
          </div>
        </div>

        <p className="text-slate-400 mb-6">
          This would connect to our logistics partner network for freight booking.
        </p>

        <button
          onClick={() => {
            toast.success('Freight booking opened in new tab');
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          Open Freight Marketplace
        </button>
      </div>
    </div>
  );
};

// Upload BL Modal
const UploadBLModal = ({ isOpen, onClose, onUpload }: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: string) => void;
}) => {
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Upload Bill of Lading</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            onUpload('mock-bl-document.pdf');
            toast.success('Bill of Lading uploaded successfully');
            onClose();
          }}
        >
          <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">Drag and drop your BL document</p>
          <p className="text-slate-400 text-sm mb-4">or click to browse</p>
          <button
            onClick={() => {
              onUpload('mock-bl-document.pdf');
              toast.success('Bill of Lading uploaded successfully');
              onClose();
            }}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Browse Files
          </button>
          <p className="text-slate-500 text-xs mt-4">Accepted: PDF, JPG, PNG (max 10MB)</p>
        </div>
      </div>
    </div>
  );
};

const CargoReservations = () => {
  const [cancelModal, setCancelModal] = useState<ReservationType | null>(null);
  const [docsModal, setDocsModal] = useState<ReservationType | null>(null);
  const [freightModal, setFreightModal] = useState(false);
  const [uploadBLModal, setUploadBLModal] = useState(false);

  const activeReservations = supplierCargoReservations.filter(r =>
    r.status === 'awaiting_dispatch'
  );
  const completedReservations = supplierCargoReservations.filter(r =>
    r.status === 'shipped' || r.status === 'delivered' || r.status === 'cancelled'
  );

  const stats = {
    activeCount: activeReservations.length,
    shippedCount: completedReservations.filter(r => r.status === 'shipped').length,
    deliveredCount: completedReservations.filter(r => r.status === 'delivered').length,
    cancelledCount: completedReservations.filter(r => r.status === 'cancelled').length,
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      awaiting_dispatch: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Awaiting Dispatch' },
      preparing: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Preparing' },
      shipped: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Shipped' },
      delivered: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Delivered' },
      cancelled: { bg: 'bg-slate-500/20', text: 'text-slate-400', label: 'Cancelled' },
    };
    const badge = badges[status] || badges.awaiting_dispatch;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <SupplierSidebar activePage="cargo-reservations" />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
            <Flame className="w-5 h-5" />
            <span>CARGO AUCTION</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Active Reservations</h1>
          <p className="text-slate-400 mt-1">Ship these orders within 48h of confirmation</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-slate-400 text-sm">Active</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.activeCount}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Ship className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-400 text-sm">Shipped</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.shippedCount}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">Delivered</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.deliveredCount}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-500/20 rounded-xl flex items-center justify-center">
                <X className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-slate-400 text-sm">Cancelled</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.cancelledCount}</div>
          </div>
        </div>

        {/* Active Reservations */}
        <div className="space-y-6">
          {activeReservations.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No active reservations</p>
              <p className="text-slate-500 text-sm mt-2">Reservations will appear here when buyers reserve your cargo</p>
            </div>
          ) : (
            activeReservations.map(reservation => (
              <div key={reservation.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                {/* Card Header */}
                <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-red-400 font-bold text-sm animate-pulse">
                          URGENT — Ship by {new Date(reservation.shipByDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <ShipCountdown shipByDate={reservation.shipByDate} />
                      </div>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs text-slate-500 uppercase mb-1">Reservation ID</div>
                        <div className="text-white font-mono font-semibold">{reservation.id}</div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Buyer</div>
                          <div className="text-white font-semibold">{reservation.buyerCompany}</div>
                          <div className="text-slate-400 text-sm flex items-center gap-1">
                            <User className="w-3 h-3" /> {reservation.buyerName}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 uppercase mb-2">Product</div>
                        <div className="bg-slate-700/50 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                              <Package className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{reservation.productName}</p>
                              <p className="text-slate-400 text-sm">{reservation.containerType}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Destination</div>
                          <div className="text-white font-semibold">{reservation.destination.port}, {reservation.destination.country}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 uppercase mb-2">Pricing</div>
                        <div className="bg-slate-700/50 rounded-xl p-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total</span>
                            <span className="text-white font-semibold">${reservation.totalPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-400">Deposit (paid)</span>
                            <span className="text-emerald-400 font-semibold">${reservation.depositPaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">On arrival</span>
                            <span className="text-white">${reservation.balanceOnArrival.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {reservation.trackingInfo && (
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Tracking</div>
                          <div className="text-slate-400 text-sm">
                            {reservation.trackingInfo}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-6 border-t border-slate-700">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setDocsModal(reservation)}
                        className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Generate Export Docs
                      </button>
                      <button
                        onClick={() => setFreightModal(true)}
                        className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors flex items-center gap-2"
                      >
                        <Ship className="w-4 h-4" />
                        Book Freight
                      </button>
                      <button
                        onClick={() => setUploadBLModal(true)}
                        className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload BL
                      </button>
                      <button
                        onClick={() => toast.success('Dispatch confirmed! 30% of deposit released.')}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm Dispatch
                      </button>
                      <button
                        onClick={() => setCancelModal(reservation)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors flex items-center gap-2 ml-auto"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            to="/supplier/cargo-auction"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Package className="w-4 h-4" />
            View All Listings
          </Link>
          <Link
            to="/supplier/cargo-auction/stats"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors items-center gap-2"
          >
            Performance Stats
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Modals */}
      <CancelModal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        reservation={cancelModal}
        onCancel={() => {}}
      />
      <ExportDocsModal
        isOpen={!!docsModal}
        onClose={() => setDocsModal(null)}
        reservation={docsModal}
      />
      <BookFreightModal
        isOpen={freightModal}
        onClose={() => setFreightModal(false)}
      />
      <UploadBLModal
        isOpen={uploadBLModal}
        onClose={() => setUploadBLModal(false)}
        onUpload={(file) => console.log('Uploaded:', file)}
      />
    </div>
  );
};

export default CargoReservations;
