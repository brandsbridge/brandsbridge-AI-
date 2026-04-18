/**
 * Penalty Service for Cargo Auction
 *
 * Tracks and manages supplier violations for the cargo auction system.
 * Implements a tiered penalty system for cancellations, late shipments, and false listings.
 */

import toast from 'react-hot-toast';

// Penalty offense types
export type PenaltyOffense = 'cancellation' | 'late_ship' | 'false_listing';

// Penalty status types
export type PenaltyStatus = 'active' | 'resolved' | 'appealed';

// Penalty tier levels
export type PenaltyTier = 1 | 2 | 3;

// Interface for penalty records
export interface PenaltyRecord {
  id: string;
  supplierId: string;
  offense: PenaltyOffense;
  tier: PenaltyTier;
  date: Date;
  reservationId?: string;
  depositAmount: number;
  penaltyAmount: number;
  penaltyPercentage: number;
  status: PenaltyStatus;
  resolvedAt?: Date;
  notes?: string;
}

// Interface for supplier penalty summary
export interface SupplierPenaltySummary {
  supplierId: string;
  totalOffenses: number;
  activePenalties: number;
  currentTier: PenaltyTier;
  isBanned: boolean;
  banExpiresAt?: Date;
  totalPenaltiesPaid: number;
  reliabilityScore: number;
}

// Penalty tier configuration
const PENALTY_TIERS = {
  1: {
    name: 'Warning',
    penaltyPercentage: 20,
    penaltyAmount: (deposit: number) => Math.floor(deposit * 0.2),
    actions: ['Email warning', 'Rating decrease by 0.5'],
    banDuration: null,
  },
  2: {
    name: 'Suspension',
    penaltyPercentage: 50,
    penaltyAmount: (deposit: number) => Math.floor(deposit * 0.5),
    actions: ['50% deposit penalty', '6-month cargo auction ban'],
    banDuration: 180, // days
  },
  3: {
    name: 'Permanent',
    penaltyPercentage: 100,
    penaltyAmount: (deposit: number) => deposit,
    actions: ['Full deposit forfeit', 'Permanent cargo auction ban', 'Trust badge removed'],
    banDuration: null, // permanent
  },
};

// Offense type labels
export const OFFENSE_LABELS: Record<PenaltyOffense, string> = {
  cancellation: 'Reservation Cancellation',
  late_ship: 'Late Shipment',
  false_listing: 'False Listing Information',
};

// Status type labels
export const STATUS_LABELS: Record<PenaltyStatus, string> = {
  active: 'Active',
  resolved: 'Resolved',
  appealed: 'Under Appeal',
};

/**
 * Generate a unique penalty record ID
 */
const generatePenaltyId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `PEN-${timestamp}-${random}`.toUpperCase();
};

/**
 * Get current penalty tier based on offense count
 */
export const getPenaltyTier = (offenseCount: number): PenaltyTier => {
  if (offenseCount === 0) return 1; // First offense
  if (offenseCount === 1) return 2; // Second offense
  return 3; // Third or more offenses
};

/**
 * Get tier configuration
 */
export const getTierConfig = (tier: PenaltyTier) => {
  return PENALTY_TIERS[tier];
};

/**
 * Calculate penalty amount for a given tier and deposit
 */
export const calculatePenaltyAmount = (tier: PenaltyTier, depositAmount: number): number => {
  const config = PENALTY_TIERS[tier];
  return config.penaltyAmount(depositAmount);
};

/**
 * Check if supplier should be banned
 */
export const isSupplierBanned = (summary: SupplierPenaltySummary): boolean => {
  if (summary.isBanned) {
    if (summary.banExpiresAt) {
      return new Date() < summary.banExpiresAt;
    }
    return true; // Permanent ban
  }
  return false;
};

/**
 * Calculate reliability score based on penalties
 */
export const calculateReliabilityScore = (totalListings: number, penalties: PenaltyRecord[]): number => {
  if (totalListings === 0) return 100;

  const activePenalties = penalties.filter(p => p.status === 'active').length;
  const penaltyImpact = activePenalties * 15; // 15% deduction per active penalty

  return Math.max(0, 100 - penaltyImpact);
};

/**
 * Apply a penalty to a supplier
 */
export const applyPenalty = async (
  supplierId: string,
  offense: PenaltyOffense,
  depositAmount: number,
  reservationId?: string,
  notes?: string
): Promise<PenaltyRecord> => {
  // Get current penalties for this supplier (mock: in real app, fetch from backend)
  const currentOffenseCount = 0; // Mock: would fetch from database

  const tier = getPenaltyTier(currentOffenseCount);
  const penaltyAmount = calculatePenaltyAmount(tier, depositAmount);

  const penalty: PenaltyRecord = {
    id: generatePenaltyId(),
    supplierId,
    offense,
    tier,
    date: new Date(),
    reservationId,
    depositAmount,
    penaltyAmount,
    penaltyPercentage: PENALTY_TIERS[tier].penaltyPercentage,
    status: 'active',
    notes,
  };

  // Log penalty (in real app, save to database)
  console.log('Penalty applied:', penalty);

  // Show appropriate toast based on tier
  switch (tier) {
    case 1:
      toast.error(
        `⚠️ First offense: ${penaltyAmount} penalty applied. Rating decreased.`,
        { duration: 5000 }
      );
      break;
    case 2:
      toast.error(
        `🚫 Second offense: ${penaltyAmount} penalty + 6-month ban from cargo auction!`,
        { duration: 7000 }
      );
      break;
    case 3:
      toast.error(
        `⛔ Third offense: Account suspended from cargo auction permanently!`,
        { duration: 10000 }
      );
      break;
  }

  return penalty;
};

/**
 * Resolve a penalty (e.g., after payment)
 */
export const resolvePenalty = async (
  penaltyId: string,
  notes?: string
): Promise<PenaltyRecord | null> => {
  // Mock: in real app, update in database
  console.log('Penalty resolved:', penaltyId, notes);

  toast.success('Penalty resolved successfully');

  return null; // Would return updated penalty
};

/**
 * Appeal a penalty
 */
export const appealPenalty = async (
  penaltyId: string,
  reason: string
): Promise<boolean> => {
  // Mock: in real app, create appeal in database
  console.log('Penalty appealed:', penaltyId, reason);

  toast.success('Penalty appeal submitted for review');

  return true;
};

/**
 * Get supplier penalty summary
 */
export const getSupplierPenaltySummary = (
  supplierId: string,
  penalties: PenaltyRecord[]
): SupplierPenaltySummary => {
  const supplierPenalties = penalties.filter(p => p.supplierId === supplierId);
  const activePenalties = supplierPenalties.filter(p => p.status === 'active');

  // Calculate current tier based on offense count
  const offenseCount = supplierPenalties.length;
  const currentTier = getPenaltyTier(offenseCount - 1);

  // Check for ban
  const banPenalty = activePenalties.find(p => p.tier >= 2);
  const isBanned = !!banPenalty;
  const banExpiresAt = banPenalty?.tier === 2
    ? new Date(banPenalty.date.getTime() + (PENALTY_TIERS[2].banDuration || 0) * 24 * 60 * 60 * 1000)
    : undefined;

  // Calculate total penalties paid
  const totalPenaltiesPaid = supplierPenalties
    .filter(p => p.status === 'resolved')
    .reduce((sum, p) => sum + p.penaltyAmount, 0);

  // Calculate reliability score
  const reliabilityScore = calculateReliabilityScore(100, supplierPenalties); // Assuming 100 total listings

  return {
    supplierId,
    totalOffenses: offenseCount,
    activePenalties: activePenalties.length,
    currentTier,
    isBanned,
    banExpiresAt,
    totalPenaltiesPaid,
    reliabilityScore,
  };
};

/**
 * Check if supplier can list new cargo
 */
export const canSupplierListCargo = (summary: SupplierPenaltySummary): { canList: boolean; reason?: string } => {
  if (summary.isBanned) {
    if (summary.banExpiresAt) {
      const daysRemaining = Math.ceil((summary.banExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return {
        canList: false,
        reason: `Temporarily banned. ${daysRemaining} days remaining.`,
      };
    }
    return {
      canList: false,
      reason: 'Permanently banned from cargo auction.',
    };
  }
  return { canList: true };
};

/**
 * Format penalty for display
 */
export const formatPenaltyDisplay = (penalty: PenaltyRecord): string => {
  const tierConfig = PENALTY_TIERS[penalty.tier];
  return `${OFFENSE_LABELS[penalty.offense]} - Tier ${penalty.tier} (${tierConfig.name}): $${penalty.penaltyAmount.toLocaleString()} (${penalty.penaltyPercentage}%)`;
};

/**
 * Get warning message based on tier
 */
export const getTierWarningMessage = (tier: PenaltyTier): string => {
  const config = PENALTY_TIERS[tier];
  const nextTier = Math.min(tier + 1, 3) as PenaltyTier;
  const nextConfig = PENALTY_TIERS[nextTier];

  switch (tier) {
    case 1:
      return `This is your first offense. You received a ${config.penaltyPercentage}% penalty fee and your rating decreased. A second offense will result in a ${PENALTY_TIERS[2].penaltyPercentage}% penalty and a 6-month ban.`;
    case 2:
      return `This is your second offense. You received a ${config.penaltyPercentage}% penalty and are banned from cargo auction for 6 months. A third offense will result in permanent ban and full deposit forfeit.`;
    case 3:
      return `You have been permanently banned from the cargo auction. Full deposit has been forfeited and your trust badge has been removed.`;
    default:
      return '';
  }
};

// Export default service object
const penaltyService = {
  getPenaltyTier,
  getTierConfig,
  calculatePenaltyAmount,
  isSupplierBanned,
  calculateReliabilityScore,
  applyPenalty,
  resolvePenalty,
  appealPenalty,
  getSupplierPenaltySummary,
  canSupplierListCargo,
  formatPenaltyDisplay,
  getTierWarningMessage,
  OFFENSE_LABELS,
  STATUS_LABELS,
  PENALTY_TIERS,
};

export default penaltyService;
