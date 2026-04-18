import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Deal {
  id: string;
  buyerName: string;
  buyerId: string;
  productName: string;
  productId: string;
  value: number;
  quantity: number;
  status: 'new' | 'contacted' | 'negotiation' | 'closing' | 'closed';
  lastActivity: string;
  nextStep: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  moq: number;
  stock: number;
  allocated: number;
  image?: string;
}

export interface Invoice {
  id: string;
  dealId: string;
  client: string;
  clientId: string;
  products: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
}

export interface Message {
  id: string;
  to: string;
  toId: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface LiveSession {
  isLive: boolean;
  currentBuyer: string | null;
  sessionStart: string | null;
  queuedBuyers: { id: string; name: string; company: string; joinedAt: string }[];
}

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  interest: string;
  dealSize: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified';
  createdAt: string;
}

// Initial data
const initialDeals: Deal[] = [
  { id: 'deal-1', buyerName: 'Al Meera Consumer Goods', buyerId: 'buyer-1', productName: 'Premium Wafer Collection', productId: 'prod-1', value: 45000, quantity: 2000, status: 'new', lastActivity: '2 hours ago', nextStep: 'Send catalog' },
  { id: 'deal-2', buyerName: 'Carrefour Qatar', buyerId: 'buyer-2', productName: 'Artisan Chocolate Box', productId: 'prod-2', value: 78000, quantity: 1500, status: 'contacted', lastActivity: '1 day ago', nextStep: 'Schedule call' },
  { id: 'deal-3', buyerName: 'Lulu Group International', buyerId: 'buyer-3', productName: 'Premium Wafer Collection', productId: 'prod-1', value: 125000, quantity: 5000, status: 'negotiation', lastActivity: '3 hours ago', nextStep: 'Negotiate terms' },
  { id: 'deal-4', buyerName: 'OZMO Trading', buyerId: 'buyer-4', productName: 'Hazelnut Cream Biscuits', productId: 'prod-3', value: 65000, quantity: 3000, status: 'closing', lastActivity: 'Just now', nextStep: 'Send contract' },
  { id: 'deal-5', buyerName: 'Safari Hypermarket', buyerId: 'buyer-5', productName: 'Artisan Chocolate Box', productId: 'prod-2', value: 32000, quantity: 800, status: 'closed', lastActivity: '1 week ago', nextStep: 'Completed' },
];

const initialInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Premium Wafer Collection', category: 'Confectionery', price: 22.50, moq: 500, stock: 5000, allocated: 2000 },
  { id: 'inv-2', name: 'Artisan Chocolate Box', category: 'Confectionery', price: 52.00, moq: 200, stock: 1500, allocated: 500 },
  { id: 'inv-3', name: 'Hazelnut Cream Biscuits', category: 'Biscuits', price: 21.75, moq: 600, stock: 8000, allocated: 1500 },
  { id: 'inv-4', name: 'Belgian Truffle Selection', category: 'Confectionery', price: 78.00, moq: 100, stock: 500, allocated: 100 },
];

const initialInvoices: Invoice[] = [
  { id: 'INV-2024-001', dealId: 'deal-5', client: 'Safari Hypermarket', clientId: 'buyer-5', products: [{ name: 'Artisan Chocolate Box', quantity: 800, price: 52 }], total: 41600, status: 'paid', createdAt: '2024-01-15' },
  { id: 'INV-2024-002', dealId: 'deal-3', client: 'Lulu Group International', clientId: 'buyer-3', products: [{ name: 'Premium Wafer Collection', quantity: 1000, price: 22.50 }], total: 22500, status: 'sent', createdAt: '2024-01-20' },
];

const initialLeads: Lead[] = [
  { id: 'lead-1', companyName: 'Emke Group', contactPerson: 'Ahmed Hassan', email: 'ahmed@emke.ae', phone: '+971 50 123 4567', interest: 'Confectionery', dealSize: '$50,000-$100,000', source: 'Gulfood 2024', status: 'new', createdAt: '2024-01-22' },
  { id: 'lead-2', companyName: 'Al Maya Group', contactPerson: 'Fatima Al M', email: 'fatima@almaya.ae', phone: '+971 50 987 6543', interest: 'Premium Snacks', dealSize: '$100,000+', source: 'Website Inquiry', status: 'contacted', createdAt: '2024-01-21' },
];

const initialQueuedBuyers = [
  { id: 'q-1', name: 'Mohammed Al-Rashid', company: 'Union Cooperative', joinedAt: '2 min ago' },
  { id: 'q-2', name: 'Sarah Chen', company: 'Spinneys Dubai', joinedAt: '5 min ago' },
  { id: 'q-3', name: 'Khalid Ibrahim', company: 'Abu Dhabi Co-op', joinedAt: '8 min ago' },
];

// Context
interface SupplierContextType {
  deals: Deal[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  messages: Message[];
  leads: Lead[];
  liveSession: LiveSession;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
  moveDeal: (dealId: string, newStatus: Deal['status']) => void;
  moveDealToClosing: (dealId: string, dealValue: number) => void;
  closeDeal: (dealId: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'status'>) => void;
  sendInvoice: (invoiceId: string) => void;
  goLive: () => void;
  endLiveSession: () => void;
  admitBuyer: (buyerId: string) => void;
  declineBuyer: (buyerId: string) => void;
  sendChatMessage: (message: string) => void;
  chatMessages: { from: 'supplier' | 'buyer'; text: string; time: string }[];
  startConversation: (buyerName: string, template: string) => void;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider = ({ children }: { children: ReactNode }) => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveSession, setLiveSession] = useState<LiveSession>({
    isLive: false,
    currentBuyer: null,
    sessionStart: null,
    queuedBuyers: initialQueuedBuyers,
  });
  const [chatMessages, setChatMessages] = useState<{ from: 'supplier' | 'buyer'; text: string; time: string }[]>([
    { from: 'buyer', text: 'Hello! I am interested in your premium wafer collection.', time: 'Just now' },
  ]);

  // Add new lead
  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Move deal to new status
  const moveDeal = (dealId: string, newStatus: Deal['status']) => {
    setDeals(prev => prev.map(d =>
      d.id === dealId ? { ...d, status: newStatus } : d
    ));
  };

  // Move deal to closing (special action with invoice creation)
  const moveDealToClosing = (dealId: string, dealValue: number) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    // 1. Update deal status
    setDeals(prev => prev.map(d =>
      d.id === dealId ? { ...d, status: 'closing' } : d
    ));

    // 2. Generate invoice draft
    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      dealId,
      client: deal.buyerName,
      clientId: deal.buyerId,
      products: [{ name: deal.productName, quantity: deal.quantity, price: deal.value / deal.quantity }],
      total: dealValue || deal.value,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // 3. Update inventory allocation
    setInventory(prev => prev.map(item =>
      item.id === deal.productId
        ? { ...item, allocated: item.allocated + deal.quantity }
        : item
    ));
  };

  // Close deal
  const closeDeal = (dealId: string) => {
    setDeals(prev => prev.map(d =>
      d.id === dealId ? { ...d, status: 'closed', nextStep: 'Completed' } : d
    ));
  };

  // Inventory management
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setInventory(prev => [newItem, ...prev]);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  // Invoice management
  const createInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'status'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const sendInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, status: 'sent' } : inv
    ));
  };

  // Live session management
  const goLive = () => {
    setLiveSession(prev => ({
      ...prev,
      isLive: true,
      queuedBuyers: initialQueuedBuyers,
    }));
  };

  const endLiveSession = () => {
    setLiveSession({
      isLive: false,
      currentBuyer: null,
      sessionStart: null,
      queuedBuyers: [],
    });
    setChatMessages([]);
  };

  const admitBuyer = (buyerId: string) => {
    const buyer = liveSession.queuedBuyers.find(b => b.id === buyerId);
    if (!buyer) return;

    setLiveSession(prev => ({
      ...prev,
      currentBuyer: buyer.name,
      sessionStart: new Date().toISOString(),
      queuedBuyers: prev.queuedBuyers.filter(b => b.id !== buyerId),
    }));

    setChatMessages([
      { from: 'buyer', text: `Hello! I am ${buyer.name} from ${buyer.company}. I am interested in your products.`, time: 'Just now' },
    ]);
  };

  const declineBuyer = (buyerId: string) => {
    setLiveSession(prev => ({
      ...prev,
      queuedBuyers: prev.queuedBuyers.filter(b => b.id !== buyerId),
    }));
  };

  const sendChatMessage = (message: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { from: 'supplier', text: message, time }]);

    // Simulate buyer auto-reply
    setTimeout(() => {
      const replies = [
        'That sounds great! What are the payment terms?',
        'Can you send me the specifications sheet?',
        'We would need samples before placing an order.',
        'What is your minimum order quantity?',
        'Are you able to deliver within 30 days?',
      ];
      setChatMessages(prev => [
        ...prev,
        { from: 'buyer', text: replies[Math.floor(Math.random() * replies.length)], time: 'Just now' },
      ]);
    }, 2000);
  };

  const startConversation = (buyerName: string, template: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      to: buyerName,
      toId: 'unknown',
      subject: 'Following up on your inquiry',
      body: template,
      sentAt: new Date().toISOString(),
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  return (
    <SupplierContext.Provider value={{
      deals,
      inventory,
      invoices,
      messages,
      leads,
      liveSession,
      addLead,
      moveDeal,
      moveDealToClosing,
      closeDeal,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      createInvoice,
      sendInvoice,
      goLive,
      endLiveSession,
      admitBuyer,
      declineBuyer,
      sendChatMessage,
      chatMessages,
      startConversation,
    }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplier must be used within SupplierProvider');
  }
  return context;
};
