import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import toast from 'react-hot-toast';

// Types
export interface ContractParty {
  id: string;
  name: string;
  company: string;
  role: 'buyer' | 'supplier' | 'logistics';
  signed: boolean;
  signedAt?: string;
  signedIP?: string;
  email: string;
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  required: boolean;
}

export interface ContractEvent {
  id: string;
  type: 'created' | 'viewed' | 'edited' | 'signed' | 'status_change' | 'message' | 'finalized';
  party: string;
  message: string;
  timestamp: string;
}

export interface Contract {
  id: string;
  dealId: string;
  title: string;
  product: string;
  quantity: string;
  totalValue: number;
  currency: string;
  incoterm: string;
  paymentTerms: string;
  deliveryDate: string;
  status: 'draft' | 'pending_signatures' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  parties: ContractParty[];
  clauses: ContractClause[];
  events: ContractEvent[];
  isFinalized?: boolean;
}

// Event listener type for live state sync
type ContractChangeListener = (contract: Contract, action: 'created' | 'updated' | 'signed' | 'finalized') => void;

interface ContractContextType {
  contracts: Contract[];
  currentContract: Contract | null;
  setCurrentContract: (contract: Contract | null) => void;
  getContractById: (id: string) => Contract | undefined;
  signContract: (contractId: string, partyId: string, signatureName?: string) => { success: boolean; allSigned: boolean };
  updateContractStatus: (contractId: string, status: Contract['status']) => void;
  addContractEvent: (contractId: string, event: Omit<ContractEvent, 'id' | 'timestamp'>) => void;
  getContractsByParty: (partyId: string) => Contract[];
  finalizeContract: (contractId: string) => void;
  getSignatureStatus: (contract: Contract) => { buyer: boolean; supplier: boolean; logistics: boolean; allSigned: boolean };
  subscribeToChanges: (listener: ContractChangeListener) => () => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

// Mock contracts data - Comprehensive OZMO contract with full event history
const initialContracts: Contract[] = [
  {
    id: 'BB-CT-2025-0892',
    dealId: 'deal-0892',
    title: 'OZMO Confectionery Industries → Al Meera Consumer',
    product: 'Premium Chocolate Wafers 750g',
    quantity: '1,000 cases (12,000 units)',
    totalValue: 186000,
    currency: 'USD',
    incoterm: 'CIF Hamad Port, Qatar',
    paymentTerms: '30% Advance, 70% upon BL Copy',
    deliveryDate: '2025-02-15',
    status: 'pending_signatures',
    createdAt: '2025-01-28T09:00:00',
    updatedAt: '2025-01-30T14:15:00',
    parties: [
      {
        id: 'buyer-001',
        name: 'Ahmed Al Rashid',
        company: 'Al Meera Consumer Goods Co.',
        role: 'buyer',
        signed: false,
        email: 'a.rashid@almeera.com.qa'
      },
      {
        id: 'supplier-001',
        name: 'Mehmet Yilmaz',
        company: 'OZMO Confectionery Industries',
        role: 'supplier',
        signed: false,
        email: 'mehmet@ozmo.com.tr'
      },
      {
        id: 'logistics-001',
        name: 'Sarah Khan',
        company: 'Gulf Global Logistics',
        role: 'logistics',
        signed: false,
        email: 'sarah@gulfglobal.ae'
      }
    ],
    events: [
      {
        id: 'evt-001',
        type: 'created',
        party: 'System',
        message: 'Contract created from deal BB-DEAL-2025-0892',
        timestamp: '2025-01-28T09:00:00'
      },
      {
        id: 'evt-002',
        type: 'viewed',
        party: 'buyer-001',
        message: 'Ahmed Al Rashid opened contract room',
        timestamp: '2025-01-30T14:15:00'
      },
      {
        id: 'evt-003',
        type: 'viewed',
        party: 'supplier-001',
        message: 'Mehmet Yilmaz opened contract room',
        timestamp: '2025-01-30T14:16:00'
      },
      {
        id: 'evt-004',
        type: 'edited',
        party: 'supplier-001',
        message: 'Mehmet Yilmaz modified "Payment Terms" from "50/50" to "30/70"',
        timestamp: '2025-01-30T14:18:00'
      },
      {
        id: 'evt-005',
        type: 'edited',
        party: 'buyer-001',
        message: 'Ahmed Al Rashid modified "Delivery Date" from "Feb 15" to "Feb 22"',
        timestamp: '2025-01-30T14:20:00'
      },
      {
        id: 'evt-006',
        type: 'message',
        party: 'buyer-001',
        message: 'Amendment requested: Can we add quality inspection clause?',
        timestamp: '2025-01-30T14:22:00'
      },
      {
        id: 'evt-007',
        type: 'status_change',
        party: 'System',
        message: 'Contract reopened for amendments',
        timestamp: '2025-01-30T14:22:30'
      },
      {
        id: 'evt-008',
        type: 'viewed',
        party: 'logistics-001',
        message: 'Sarah Khan opened contract room',
        timestamp: '2025-01-30T14:25:00'
      }
    ],
    clauses: [
      {
        id: 'clause-1',
        title: 'Product Specification',
        content: 'Premium Chocolate Wafers 750g, HS Code 1905.32, moisture content max 25%, HALAL certified.',
        required: true
      },
      {
        id: 'clause-2',
        title: 'Quantity & Packaging',
        content: '1,000 cases (12,000 units). Quantity tolerance +/- 5%.',
        required: true
      },
      {
        id: 'clause-3',
        title: 'Payment Terms',
        content: '30% advance payment upon contract signing. 70% balance payable against original Bill of Lading.',
        required: true
      },
      {
        id: 'clause-4',
        title: 'Delivery Terms',
        content: 'CIF Hamad Port, Qatar. Lead time 14 days from payment. Transit time 14 days.',
        required: true
      },
      {
        id: 'clause-5',
        title: 'Quality Standards',
        content: 'Pre-shipment inspection by SGS. Required certifications: Halal, ISO 22000, HACCP.',
        required: true
      },
      {
        id: 'clause-6',
        title: 'Force Majeure',
        content: 'Neither party shall be liable for delays caused by circumstances beyond reasonable control.',
        required: true
      }
    ]
  },
  {
    id: 'contract-002',
    dealId: 'deal-002',
    title: 'Organic Rice Supply Agreement',
    product: 'Organic Jasmine Rice',
    quantity: '200 MT',
    totalValue: 125000,
    currency: 'USD',
    incoterm: 'CIF Singapore',
    paymentTerms: '100% LC at Sight',
    deliveryDate: '2024-04-01',
    status: 'pending_signatures',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-17',
    parties: [
      {
        id: 'buyer-001',
        name: 'Sarah Chen',
        company: 'Pacific Rim Foods',
        role: 'buyer',
        signed: true,
        signedAt: '2024-01-15T10:30:00',
        signedIP: '192.168.1.45',
        email: 'sarah.chen@pacificrim.sg'
      },
      {
        id: 'supplier-001',
        name: 'Lin Wei',
        company: 'Thai Organic Rice Ltd.',
        role: 'supplier',
        signed: true,
        signedAt: '2024-01-16T14:15:00',
        signedIP: '10.0.0.123',
        email: 'lin.wei@thaiorganicrice.com'
      },
      {
        id: 'logistics-001',
        name: 'David Wong',
        company: 'Pacific Shipping Co.',
        role: 'logistics',
        signed: false,
        email: 'david@pacificshipping.com'
      }
    ],
    clauses: [
      {
        id: 'clause-1',
        title: 'Product Specification',
        content: 'Organic Jasmine Rice, Grade 1, broken max 5%, moisture max 14%. USDA Organic certified.',
        required: true
      },
      {
        id: 'clause-2',
        title: 'Packaging',
        content: '25kg PP bags, 4 bags per pallet. Buyer packaging required.',
        required: true
      },
      {
        id: 'clause-3',
        title: 'Payment Terms',
        content: '100% Letter of Credit at Sight, issued within 7 days of contract signing.',
        required: true
      }
    ],
    events: [
      {
        id: 'event-1',
        type: 'created',
        party: 'System',
        message: 'Contract draft created',
        timestamp: '2024-01-10T08:00:00'
      },
      {
        id: 'event-2',
        type: 'signed',
        party: 'buyer-001',
        message: 'Sarah Chen signed the contract',
        timestamp: '2024-01-15T10:30:00'
      },
      {
        id: 'event-3',
        type: 'signed',
        party: 'supplier-001',
        message: 'Lin Wei signed the contract',
        timestamp: '2024-01-16T14:15:00'
      }
    ]
  }
];

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);

  // Subscribers for live state sync
  const listenersRef = useRef<Set<ContractChangeListener>>(new Set());

  // Subscribe to contract changes
  const subscribeToChanges = useCallback((listener: ContractChangeListener) => {
    listenersRef.current.add(listener);
    // Return unsubscribe function
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  // Notify all subscribers of changes
  const notifyListeners = useCallback((contract: Contract, action: 'created' | 'updated' | 'signed' | 'finalized') => {
    listenersRef.current.forEach(listener => {
      try {
        listener(contract, action);
      } catch (e) {
        console.error('Error in contract listener:', e);
      }
    });
  }, []);

  const getContractById = useCallback((id: string) => {
    return contracts.find(c => c.id === id);
  }, [contracts]);

  // Get signature status for a contract
  const getSignatureStatus = useCallback((contract: Contract) => {
    return {
      buyer: contract.parties.find(p => p.role === 'buyer')?.signed || false,
      supplier: contract.parties.find(p => p.role === 'supplier')?.signed || false,
      logistics: contract.parties.find(p => p.role === 'logistics')?.signed || false,
      allSigned: contract.parties.every(p => p.signed)
    };
  }, []);

  // Sign contract with signature name
  const signContract = useCallback((contractId: string, partyId: string, signatureName?: string): { success: boolean; allSigned: boolean } => {
    let result = { success: false, allSigned: false };
    let contractToCheck: Contract | null = null;

    setContracts(prev => {
      return prev.map(contract => {
        if (contract.id !== contractId) return contract;
        contractToCheck = contract;

        const party = contract.parties.find(p => p.id === partyId);
        const signatoryName = signatureName || party?.name || 'Unknown';

        const updatedParties = contract.parties.map(p =>
          p.id === partyId
            ? {
                ...p,
                signed: true,
                signedAt: new Date().toISOString(),
                signedIP: `192.168.1.${Math.floor(Math.random() * 255)}`
              }
            : p
        );

        // Check if all parties have signed
        const allSigned = updatedParties.every(p => p.signed);
        const newStatus = allSigned && !contract.isFinalized ? 'active' : 'pending_signatures';

        result = { success: true, allSigned };

        const newEvent: ContractEvent = {
          id: `event-${Date.now()}`,
          type: 'signed',
          party: partyId,
          message: `${signatoryName} signed the contract`,
          timestamp: new Date().toISOString()
        };

        return {
          ...contract,
          parties: updatedParties,
          status: newStatus,
          updatedAt: new Date().toISOString().split('T')[0],
          events: [...contract.events, newEvent]
        };
      });
    });

    // Update current contract if it matches
    if (currentContract?.id === contractId) {
      setTimeout(() => {
        const updated = contracts.find(c => c.id === contractId);
        if (updated) setCurrentContract(updated);
      }, 0);
    }

    return result;
  }, [contracts, currentContract]);

  // Finalize contract when all parties have signed
  const finalizeContract = useCallback((contractId: string) => {
    setContracts(prev => prev.map(contract => {
      if (contract.id !== contractId) return contract;

      const newEvent: ContractEvent = {
        id: `event-${Date.now()}`,
        type: 'finalized',
        party: 'System',
        message: 'Contract fully executed — all parties signed',
        timestamp: new Date().toISOString()
      };

      return {
        ...contract,
        status: 'active',
        isFinalized: true,
        updatedAt: new Date().toISOString().split('T')[0],
        events: [...contract.events, newEvent]
      };
    }));

    // Show success toast
    toast.success('🎉 Contract Finalized! All parties have signed.', {
      duration: 5000,
      style: {
        background: '#0C1628',
        color: '#D4AF37',
        border: '1px solid #D4AF37',
      },
    });
  }, []);

  // Watch for all signed contracts and finalize them
  useEffect(() => {
    contracts.forEach(contract => {
      const allSigned = contract.parties.every(p => p.signed);
      if (allSigned && contract.status === 'active' && !contract.isFinalized) {
        finalizeContract(contract.id);
      }
    });
  }, [contracts, finalizeContract]);

  const updateContractStatus = useCallback((contractId: string, status: Contract['status']) => {
    setContracts(prev => prev.map(contract => {
      if (contract.id !== contractId) return contract;

      const newEvent: ContractEvent = {
        id: `event-${Date.now()}`,
        type: 'status_change',
        party: 'System',
        message: `Contract status changed to ${status.replace('_', ' ')}`,
        timestamp: new Date().toISOString()
      };

      return {
        ...contract,
        status,
        updatedAt: new Date().toISOString().split('T')[0],
        events: [...contract.events, newEvent]
      };
    }));
  }, []);

  const addContractEvent = useCallback((contractId: string, event: Omit<ContractEvent, 'id' | 'timestamp'>) => {
    setContracts(prev => prev.map(contract => {
      if (contract.id !== contractId) return contract;

      const newEvent: ContractEvent = {
        ...event,
        id: `event-${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      return {
        ...contract,
        updatedAt: new Date().toISOString().split('T')[0],
        events: [...contract.events, newEvent]
      };
    }));
  }, []);

  const getContractsByParty = useCallback((partyId: string) => {
    return contracts.filter(c => c.parties.some(p => p.id === partyId));
  }, [contracts]);

  const value: ContractContextType = {
    contracts,
    currentContract,
    setCurrentContract,
    getContractById,
    signContract,
    updateContractStatus,
    addContractEvent,
    getContractsByParty,
    finalizeContract,
    getSignatureStatus,
    subscribeToChanges
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within ContractProvider');
  }
  return context;
};
