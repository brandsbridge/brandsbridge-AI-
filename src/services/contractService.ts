/**
 * Contract Service - Portal Synchronization
 *
 * This service ensures that when a contract action occurs in the Contract Room,
 * it automatically propagates to ALL other dashboards in real-time.
 *
 * THE MASTER LINK - Critical for trust
 */

import React from 'react';

// Types
export interface ContractUpdate {
  id: string;
  orderId?: string;
  dealId?: string;
  quoteId?: string;
  status: 'draft' | 'pending_signatures' | 'active' | 'completed' | 'cancelled';
  value: number;
  parties: {
    id: string;
    company: string;
    role: 'buyer' | 'supplier' | 'logistics';
    signed: boolean;
  }[];
  product: string;
  escrowLocked?: boolean;
  containerReserved?: boolean;
  dispatchConfirmed?: boolean;
}

export interface BroadcastEvent {
  type: 'CONTRACT_CREATED' | 'CONTRACT_SIGNED' | 'CONTRACT_FINALIZED' | 'ESCROW_LOCKED' | 'CONTAINER_RESERVED' | 'DISPATCH_CONFIRMED' | 'SHIPMENT_UPDATE';
  data: ContractUpdate;
  timestamp: string;
}

// Event listeners for cross-portal updates
type PortalEventListener = (event: BroadcastEvent) => void;
const listeners: Set<PortalEventListener> = new Set();

/**
 * Subscribe to contract events from any portal
 */
export const subscribeToContractEvents = (listener: PortalEventListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Broadcast event to all portals
 */
const broadcastEvent = (event: BroadcastEvent) => {
  console.log(`[ContractService] Broadcasting: ${event.type}`, event.data);
  listeners.forEach(listener => {
    try {
      listener(event);
    } catch (e) {
      console.error('[ContractService] Listener error:', e);
    }
  });
};

/**
 * Sync contract to all portals
 * This is the MASTER FUNCTION that updates all dashboards
 */
export const syncContractToAllPortals = (contractUpdate: ContractUpdate): void => {
  console.log('[ContractService] Syncing contract to all portals:', contractUpdate.id);

  // 1. Update Buyer Dashboard
  syncToBuyerDashboard(contractUpdate);

  // 2. Update Supplier CRM
  syncToSupplierCRM(contractUpdate);

  // 3. Update Logistics Inbox
  syncToLogisticsPortal(contractUpdate);

  // 4. Update Admin Platform
  syncToAdminPlatform(contractUpdate);

  // 5. Broadcast to all subscribers
  broadcastEvent({
    type: determineEventType(contractUpdate),
    data: contractUpdate,
    timestamp: new Date().toISOString()
  });
};

/**
 * Determine the event type based on contract status
 */
const determineEventType = (update: ContractUpdate): BroadcastEvent['type'] => {
  if (update.status === 'completed') return 'CONTRACT_FINALIZED';
  if (update.dispatchConfirmed) return 'DISPATCH_CONFIRMED';
  if (update.containerReserved) return 'CONTAINER_RESERVED';
  if (update.escrowLocked) return 'ESCROW_LOCKED';
  if (update.parties.some(p => p.signed)) return 'CONTRACT_SIGNED';
  return 'CONTRACT_CREATED';
};

interface BuyerUpdate {
  orderId?: string;
  status: string;
  contractSigned: boolean;
  allSigned: boolean;
  escrowLocked: boolean;
  contractId: string;
  value: number;
  product: string;
}

interface SupplierUpdate {
  dealId?: string;
  stage: string;
  contractSigned: boolean;
  invoice: {
    status: string;
    amount: number;
    lockedAmount: number;
  };
  contractId: string;
}

interface LogisticsUpdate {
  quoteId?: string;
  status: string;
  containerReserved: boolean;
  dispatchPending: boolean;
  contractId: string;
  parties: { role: string; company: string; signed: boolean }[];
}

/**
 * Sync to Buyer Dashboard
 */
const syncToBuyerDashboard = (update: ContractUpdate): void => {
  const buyerUpdate: BuyerUpdate = {
    orderId: update.orderId,
    status: update.status === 'active' ? 'in_transit' : update.status,
    contractSigned: update.parties.filter(p => p.role === 'buyer')[0]?.signed || false,
    allSigned: update.parties.every(p => p.signed),
    escrowLocked: update.escrowLocked || false,
    contractId: update.id,
    value: update.value,
    product: update.product
  };

  console.log('[ContractService] → Buyer Dashboard:', buyerUpdate);

  // Dispatch custom event for Buyer Dashboard to listen
  window.dispatchEvent(new CustomEvent('contract-sync-buyer', { detail: buyerUpdate }));
};

/**
 * Sync to Supplier CRM
 */
const syncToSupplierCRM = (update: ContractUpdate): void => {
  const supplierUpdate: SupplierUpdate = {
    dealId: update.dealId,
    stage: update.status === 'active' ? 'in_execution' : update.status,
    contractSigned: update.parties.filter(p => p.role === 'supplier')[0]?.signed || false,
    invoice: {
      status: update.escrowLocked ? 'locked_in_escrow' : 'pending',
      amount: update.value,
      lockedAmount: update.escrowLocked ? update.value : 0
    },
    contractId: update.id
  };

  console.log('[ContractService] → Supplier CRM:', supplierUpdate);

  // Dispatch custom event for Supplier CRM to listen
  window.dispatchEvent(new CustomEvent('contract-sync-supplier', { detail: supplierUpdate }));
};

/**
 * Sync to Logistics Portal
 */
const syncToLogisticsPortal = (update: ContractUpdate): void => {
  const logisticsUpdate: LogisticsUpdate = {
    quoteId: update.quoteId,
    status: update.containerReserved ? 'confirmed' : update.status,
    containerReserved: update.containerReserved || false,
    dispatchPending: update.containerReserved && !update.dispatchConfirmed,
    contractId: update.id,
    parties: update.parties.filter(p => p.role === 'logistics')
  };

  console.log('[ContractService] → Logistics Portal:', logisticsUpdate);

  // Dispatch custom event for Logistics Portal to listen
  window.dispatchEvent(new CustomEvent('contract-sync-logistics', { detail: logisticsUpdate }));
};

/**
 * Sync to Admin Platform
 */
const syncToAdminPlatform = (update: ContractUpdate): void => {
  const adminUpdate = {
    type: determineEventType(update).replace('CONTRACT_', '').toLowerCase(),
    contractId: update.id,
    value: update.value,
    parties: update.parties.map(p => ({
      role: p.role,
      company: p.company,
      signed: p.signed
    })),
    timestamp: new Date().toISOString()
  };

  console.log('[ContractService] → Admin Platform:', adminUpdate);

  // Dispatch custom event for Admin Platform to listen
  window.dispatchEvent(new CustomEvent('contract-sync-admin', { detail: adminUpdate }));
};

/**
 * Hook for Buyer Dashboard to listen to contract events
 */
export const useBuyerContractSync = (callback: (update: BuyerUpdate) => void) => {
  React.useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<BuyerUpdate>;
      callback(customEvent.detail);
    };
    window.addEventListener('contract-sync-buyer', handler);
    return () => window.removeEventListener('contract-sync-buyer', handler);
  }, [callback]);
};

/**
 * Hook for Supplier CRM to listen to contract events
 */
export const useSupplierContractSync = (callback: (update: SupplierUpdate) => void) => {
  React.useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<SupplierUpdate>;
      callback(customEvent.detail);
    };
    window.addEventListener('contract-sync-supplier', handler);
    return () => window.removeEventListener('contract-sync-supplier', handler);
  }, [callback]);
};

/**
 * Hook for Logistics Portal to listen to contract events
 */
export const useLogisticsContractSync = (callback: (update: LogisticsUpdate) => void) => {
  React.useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<LogisticsUpdate>;
      callback(customEvent.detail);
    };
    window.addEventListener('contract-sync-logistics', handler);
    return () => window.removeEventListener('contract-sync-logistics', handler);
  }, [callback]);
};
