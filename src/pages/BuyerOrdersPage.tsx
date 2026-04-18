import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ChevronRight, ArrowLeft, Truck, Clock,
  CheckCircle2, AlertCircle, MapPin, DollarSign
} from 'lucide-react';
import { useBuyer } from '../context/BuyerContext';
import toast from 'react-hot-toast';

const BuyerOrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useBuyer();
  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'delivered' | 'pending'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'at_sea': return 'bg-cyan-500/20 text-cyan-400';
      case 'customs': return 'bg-purple-500/20 text-purple-400';
      case 'delivered': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle2;
      case 'at_sea': return Truck;
      case 'customs': return AlertCircle;
      case 'delivered': return Package;
      default: return Package;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in_transit') return ['confirmed', 'at_sea', 'customs'].includes(order.status);
    if (activeTab === 'delivered') return order.status === 'delivered';
    if (activeTab === 'pending') return order.status === 'pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Header */}
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">My Orders</h1>
              <p className="text-slate-400 text-sm">Track your shipments and deliveries</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('in_transit')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'in_transit' ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              In Transit ({orders.filter(o => ['confirmed', 'at_sea', 'customs'].includes(o.status)).length})
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'delivered' ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Delivered ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 text-center">
            <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No orders found</h3>
            <p className="text-slate-400 text-sm">Start by creating an RFQ and accepting a quote</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/buyer/orders/${order.id}`)}
                  className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        order.status === 'delivered' ? 'bg-emerald-500/20' : 'bg-cyan-500/20'
                      }`}>
                        <StatusIcon className={`w-6 h-6 ${
                          order.status === 'delivered' ? 'text-emerald-400' : 'text-cyan-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">{order.product}</h3>
                          <span className="text-lg">{order.supplierFlag}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{order.supplier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-300">{order.origin} → {order.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-300">{order.container}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-300">ETA: {order.eta}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-lg">${order.value.toLocaleString()}</div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOrdersPage;