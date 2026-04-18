import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface Deal {
  id: string;
  buyerName: string;
  buyerCompany: string;
  product: string;
  quantity: string;
  targetPrice: string;
  status: 'pending' | 'negotiating' | 'accepted' | 'closed' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  lastActivity: string;
  messages: number;
  value: number;
  country: string;
}

export interface Invoice {
  id: string;
  dealId: string;
  supplierName: string;
  buyerName: string;
  product: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  invoiceId: string;
  status: 'pending' | 'in_transit' | ' customs' | 'delivered';
  origin: string;
  destination: string;
  eta: string;
  freightProvider: string;
  trackingNumber: string;
}

export interface Notification {
  id: string;
  type: 'deal_accepted' | 'deal_rejected' | 'invoice_created' | 'shipment_update' | 'stock_released' | 'quote_received' | 'contract_signed' | 'contract_finalized';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  relatedId?: string;
  dashboard: 'buyer' | 'supplier' | 'freight' | '3pl' | 'contract';
}

interface GlobalTradeContextType {
  // Deals
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'lastActivity'>) => void;
  updateDealStatus: (dealId: string, status: Deal['status']) => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;

  // Shipments
  shipments: Shipment[];
  addShipment: (shipment: Omit<Shipment, 'id'>) => void;
  updateShipmentStatus: (shipmentId: string, status: Shipment['status']) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  // Stats
  getBuyerStats: () => { activeDeals: number; pendingQuotes: number; totalValue: number };
  getSupplierStats: () => { pipelineValue: number; wonDeals: number; pendingInvoices: number };
}

const GlobalTradeContext = createContext<GlobalTradeContextType | undefined>(undefined);

// Mock data
const initialDeals: Deal[] = [
  {
    id: 'deal-001',
    buyerName: 'Ahmed Al-Rashid',
    buyerCompany: 'Gulf Trading Corp',
    product: 'Premium Dates (Ajwa)',
    quantity: '50 MT',
    targetPrice: '$45,000',
    status: 'negotiating',
    priority: 'high',
    createdAt: '2024-01-15',
    lastActivity: '2024-01-18',
    messages: 3,
    value: 52000,
    country: 'UAE'
  },
  {
    id: 'deal-002',
    buyerName: 'Sarah Chen',
    buyerCompany: 'Pacific Rim Foods',
    product: 'Organic Rice',
    quantity: '200 MT',
    targetPrice: '$120,000',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-10',
    lastActivity: '2024-01-17',
    messages: 1,
    value: 125000,
    country: 'Singapore'
  }
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv-001',
    dealId: 'deal-closed-001',
    supplierName: 'Al Khaleej Foods',
    buyerName: 'Emirates Retail Group',
    product: 'Premium Olive Oil',
    amount: 35000,
    status: 'sent',
    dueDate: '2024-02-15',
    createdAt: '2024-01-20'
  }
];

const initialShipments: Shipment[] = [
  {
    id: 'ship-001',
    invoiceId: 'inv-001',
    status: 'in_transit',
    origin: 'Greece',
    destination: 'Dubai, UAE',
    eta: '2024-02-10',
    freightProvider: 'Maersk Line',
    trackingNumber: 'MAEU123456789'
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'quote_received',
    title: 'New Quote Received',
    message: 'Pacific Rim Foods sent a quote for Organic Rice - $125,000',
    read: false,
    timestamp: '2024-01-18T10:30:00',
    dashboard: 'supplier'
  },
  {
    id: 'notif-002',
    type: 'shipment_update',
    title: 'Shipment Update',
    message: 'Your olive oil shipment is now in transit',
    read: true,
    timestamp: '2024-01-17T15:00:00',
    relatedId: 'ship-001',
    dashboard: 'buyer'
  }
];

export const GlobalTradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Deal functions
  const addDeal = useCallback((deal: Omit<Deal, 'id' | 'createdAt' | 'lastActivity'>) => {
    const newDeal: Deal = {
      ...deal,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0]
    };
    setDeals(prev => [newDeal, ...prev]);
  }, []);

  const updateDealStatus = useCallback((dealId: string, status: Deal['status']) => {
    setDeals(prev => prev.map(deal =>
      deal.id === dealId
        ? { ...deal, status, lastActivity: new Date().toISOString().split('T')[0] }
        : deal
    ));
  }, []);

  // Invoice functions
  const addInvoice = useCallback((invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // Notify buyer
    addNotification({
      type: 'invoice_created',
      title: 'Invoice Created',
      message: `New invoice #${newInvoice.id.slice(-6)} for ${invoice.product} - $${invoice.amount.toLocaleString()}`,
      dashboard: 'buyer',
      relatedId: newInvoice.id
    });
  }, []);

  const updateInvoiceStatus = useCallback((invoiceId: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, status } : inv
    ));
  }, []);

  // Shipment functions
  const addShipment = useCallback((shipment: Omit<Shipment, 'id'>) => {
    const newShipment: Shipment = {
      ...shipment,
      id: `ship-${Date.now()}`
    };
    setShipments(prev => [...prev, newShipment]);
  }, []);

  const updateShipmentStatus = useCallback((shipmentId: string, status: Shipment['status']) => {
    setShipments(prev => prev.map(ship =>
      ship.id === shipmentId ? { ...ship, status } : ship
    ));

    // Notify relevant parties
    const ship = shipments.find(s => s.id === shipmentId);
    if (ship) {
      addNotification({
        type: 'shipment_update',
        title: 'Shipment Update',
        message: `Shipment ${ship.trackingNumber} is now ${status.replace('_', ' ')}`,
        dashboard: 'buyer',
        relatedId: shipmentId
      });
    }
  }, [shipments]);

  // Notification functions
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  // Stats functions
  const getBuyerStats = useCallback(() => ({
    activeDeals: deals.filter(d => ['pending', 'negotiating'].includes(d.status)).length,
    pendingQuotes: deals.filter(d => d.status === 'pending').length,
    totalValue: deals.reduce((sum, d) => sum + d.value, 0)
  }), [deals]);

  const getSupplierStats = useCallback(() => ({
    pipelineValue: deals.filter(d => d.status !== 'closed' && d.status !== 'rejected').reduce((sum, d) => sum + d.value, 0),
    wonDeals: deals.filter(d => d.status === 'closed' || d.status === 'accepted').length,
    pendingInvoices: invoices.filter(i => i.status === 'sent').length
  }), [deals, invoices]);

  const value: GlobalTradeContextType = {
    deals,
    addDeal,
    updateDealStatus,
    invoices,
    addInvoice,
    updateInvoiceStatus,
    shipments,
    addShipment,
    updateShipmentStatus,
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    getBuyerStats,
    getSupplierStats
  };

  return (
    <GlobalTradeContext.Provider value={value}>
      {children}
    </GlobalTradeContext.Provider>
  );
};

export const useGlobalTrade = () => {
  const context = useContext(GlobalTradeContext);
  if (!context) {
    throw new Error('useGlobalTrade must be used within GlobalTradeProvider');
  }
  return context;
};
