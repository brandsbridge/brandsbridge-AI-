import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Quote {
  supplierName: string;
  supplierFlag: string;
  price: number;
  leadTime: number;
  certifications: string[];
  match: number;
  status: 'pending' | 'negotiating' | 'accepted' | 'declined';
}

export interface RFQ {
  id: string;
  product: string;
  quantity: string;
  destination: string;
  certifications: string;
  targetPrice: string;
  status: 'draft' | 'sent' | 'quotes_received' | 'ready_to_accept' | 'in_negotiation' | 'accepted' | 'declined';
  quotes: Quote[];
  createdAt: string;
  acceptedQuoteIndex?: number;
}

export interface Order {
  id: string;
  rfqId: string;
  supplier: string;
  supplierFlag: string;
  product: string;
  quantity: string;
  value: number;
  container: string;
  origin: string;
  destination: string;
  status: 'pending' | 'confirmed' | 'at_sea' | 'customs' | 'delivered';
  eta: string;
  createdDate: string;
  timeline: { status: string; date: string; completed: boolean }[];
}

export interface Message {
  id: string;
  supplier: string;
  supplierFlag: string;
  lastMessage: string;
  time: string;
  unread: number;
}

// Initial Data
const buyerRFQs: RFQ[] = [
  {
    id: 'rfq-001',
    product: 'UHT Milk',
    quantity: '500 MT',
    destination: 'Dubai Port',
    certifications: 'Halal',
    targetPrice: '$1.40/L',
    status: 'quotes_received',
    createdAt: '2025-01-20',
    quotes: [
      { supplierName: 'Baladna Food Industries', supplierFlag: '🇶🇦', price: 1.45, leadTime: 14, certifications: ['Halal', 'ISO 22000'], match: 96, status: 'pending' },
      { supplierName: 'Almarai Company', supplierFlag: '🇸🇦', price: 1.52, leadTime: 10, certifications: ['Halal', 'FSSC 22000'], match: 94, status: 'pending' },
      { supplierName: 'Arla Foods', supplierFlag: '🇩🇰', price: 1.68, leadTime: 21, certifications: ['Organic', 'ISO'], match: 87, status: 'pending' },
    ]
  },
  {
    id: 'rfq-002',
    product: 'Chocolate Wafers',
    quantity: '1,000 cases',
    destination: 'Jeddah Port',
    certifications: 'Halal, ISO',
    targetPrice: '$2.70/case',
    status: 'ready_to_accept',
    createdAt: '2025-01-18',
    quotes: [
      { supplierName: 'OZMO Confectionery', supplierFlag: '🇹🇷', price: 2.80, leadTime: 14, certifications: ['Halal', 'ISO 22000'], match: 97, status: 'pending' },
      { supplierName: 'Almarai Company', supplierFlag: '🇸🇦', price: 2.95, leadTime: 7, certifications: ['Halal', 'FSSC'], match: 94, status: 'pending' },
      { supplierName: 'German Foods GmbH', supplierFlag: '🇩🇪', price: 3.10, leadTime: 21, certifications: ['BRC', 'ISO'], match: 89, status: 'pending' },
    ]
  },
  {
    id: 'rfq-003',
    product: 'Basmati Rice',
    quantity: '200 MT',
    destination: 'Hamad Port',
    certifications: 'Halal',
    targetPrice: '$440/MT',
    status: 'in_negotiation',
    createdAt: '2025-01-15',
    quotes: [
      { supplierName: 'Kohinoor Foods', supplierFlag: '🇵🇰', price: 450, leadTime: 18, certifications: ['Halal', 'ISO'], match: 92, status: 'negotiating' },
      { supplierName: 'Amira Foods', supplierFlag: '🇮🇳', price: 430, leadTime: 25, certifications: ['Halal'], match: 88, status: 'pending' },
    ]
  },
];

const buyerOrders: Order[] = [
  {
    id: 'shp-001',
    rfqId: 'rfq-001',
    supplier: 'Al Meera Dairy Products',
    supplierFlag: '🇶🇦',
    product: 'UHT Milk - 500 MT',
    quantity: '500 MT',
    value: 72500,
    container: '40ft Reefer',
    origin: 'Doha',
    destination: 'Dubai',
    status: 'at_sea',
    eta: 'Feb 10, 2025',
    createdDate: '2025-01-28',
    timeline: [
      { status: 'Order Confirmed', date: 'Jan 28', completed: true },
      { status: 'Payment Sent', date: 'Jan 30', completed: true },
      { status: 'Goods Ready', date: 'Feb 3', completed: true },
      { status: 'Container Loaded', date: 'Feb 5', completed: true },
      { status: 'At Sea', date: 'Feb 6-9', completed: false },
      { status: 'Port Arrival', date: 'Feb 10', completed: false },
      { status: 'Customs', date: 'Feb 11', completed: false },
      { status: 'Delivery', date: 'Feb 12', completed: false },
    ]
  },
  {
    id: 'shp-002',
    rfqId: 'rfq-002',
    supplier: 'OZMO Confectionery',
    supplierFlag: '🇹🇷',
    product: 'Chocolate Wafers - 1,000 cases',
    quantity: '1,000 cases',
    value: 2800,
    container: '40ft HC',
    origin: 'Mersin',
    destination: 'Jeddah',
    status: 'confirmed',
    eta: 'Feb 15, 2025',
    createdDate: '2025-02-01',
    timeline: [
      { status: 'Order Confirmed', date: 'Feb 1', completed: true },
      { status: 'Payment Sent', date: 'Feb 3', completed: true },
      { status: 'Goods Ready', date: 'Feb 8', completed: true },
      { status: 'Container Loading', date: 'Feb 10-12', completed: false },
      { status: 'At Sea', date: 'Feb 12-15', completed: false },
      { status: 'Port Arrival', date: 'Feb 15', completed: false },
      { status: 'Customs', date: 'Feb 16', completed: false },
      { status: 'Delivery', date: 'Feb 17', completed: false },
    ]
  },
];

const buyerMessages: Message[] = [
  { id: 'msg-001', supplier: 'OZMO Confectionery', supplierFlag: '🇹🇷', lastMessage: 'Your order has been dispatched. BL attached.', time: '2 hours ago', unread: 1 },
  { id: 'msg-002', supplier: 'Baladna Food Industries', supplierFlag: '🇶🇦', lastMessage: 'Thank you for the repeat order!', time: '1 day ago', unread: 0 },
  { id: 'msg-003', supplier: 'Almarai Company', supplierFlag: '🇸🇦', lastMessage: 'Can we discuss the pricing for next quarter?', time: '3 days ago', unread: 2 },
];

// Context
interface BuyerContextType {
  rfqs: RFQ[];
  orders: Order[];
  messages: Message[];
  acceptQuote: (rfqId: string, quoteIndex: number) => string;
  declineQuote: (rfqId: string, quoteIndex: number) => void;
  startNegotiation: (rfqId: string, quoteIndex: number) => void;
  sendNegotiationMessage: (rfqId: string, quoteIndex: number, message: string) => void;
  getRfqById: (id: string) => RFQ | undefined;
  getOrderById: (id: string) => Order | undefined;
}

const BuyerContext = createContext<BuyerContextType | null>(null);

// Provider
export const BuyerProvider = ({ children }: { children: ReactNode }) => {
  const [rfqs, setRfqs] = useState<RFQ[]>(buyerRFQs);
  const [orders, setOrders] = useState<Order[]>(buyerOrders);
  const [messages] = useState<Message[]>(buyerMessages);

  const getRfqById = (id: string) => rfqs.find(r => r.id === id);
  const getOrderById = (id: string) => orders.find(o => o.id === id);

  const acceptQuote = (rfqId: string, quoteIndex: number) => {
    const rfq = rfqs.find(r => r.id === rfqId);
    if (!rfq) return '';

    const quote = rfq.quotes[quoteIndex];

    // Update RFQ status
    setRfqs(prev => prev.map(rfq =>
      rfq.id === rfqId
        ? { ...rfq, status: 'accepted', acceptedQuoteIndex: quoteIndex }
        : rfq
    ));

    // Create new order
    const newOrder: Order = {
      id: `shp-${Date.now()}`,
      rfqId: rfqId,
      supplier: quote.supplierName,
      supplierFlag: quote.supplierFlag,
      product: `${rfq.product} - ${rfq.quantity}`,
      quantity: rfq.quantity,
      value: quote.price * (rfq.quantity.includes('MT') ? parseInt(rfq.quantity) : 1000),
      container: '40ft HC',
      origin: 'Origin Port',
      destination: rfq.destination,
      status: 'pending',
      eta: `Feb ${10 + Math.floor(Math.random() * 10)}, 2025`,
      createdDate: new Date().toISOString().split('T')[0],
      timeline: [
        { status: 'Order Confirmed', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), completed: true },
        { status: 'Payment Pending', date: 'Pending', completed: false },
        { status: 'Goods Preparing', date: 'TBD', completed: false },
        { status: 'At Sea', date: 'TBD', completed: false },
        { status: 'Port Arrival', date: 'TBD', completed: false },
        { status: 'Delivery', date: 'TBD', completed: false },
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    return newOrder.id;
  };

  const declineQuote = (rfqId: string, quoteIndex: number) => {
    setRfqs(prev => prev.map(rfq => {
      if (rfq.id !== rfqId) return rfq;
      return {
        ...rfq,
        quotes: rfq.quotes.map((q, i) =>
          i === quoteIndex ? { ...q, status: 'declined' as const } : q
        ).filter((q, i) => i !== quoteIndex || q.status !== 'declined')
      };
    }));
  };

  const startNegotiation = (rfqId: string, quoteIndex: number) => {
    setRfqs(prev => prev.map(rfq => {
      if (rfq.id !== rfqId) return rfq;
      return {
        ...rfq,
        quotes: rfq.quotes.map((q, i) =>
          i === quoteIndex ? { ...q, status: 'negotiating' as const } : q
        )
      };
    }));
  };

  const sendNegotiationMessage = (rfqId: string, quoteIndex: number, message: string) => {
    // In a real app, this would send to backend
    console.log(`Negotiation message for ${rfqId}, quote ${quoteIndex}: ${message}`);
  };

  return (
    <BuyerContext.Provider value={{
      rfqs, orders, messages,
      acceptQuote, declineQuote, startNegotiation, sendNegotiationMessage,
      getRfqById, getOrderById
    }}>
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyer = () => {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyer must be used within a BuyerProvider');
  }
  return context;
};