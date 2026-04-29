import type { Company } from '../data/mockData';

const DEFAULT_REQUIRED_DOCS = ['CR', 'Tax', 'ISO22000', 'HACCP', 'Halal'];

export interface ReliabilityFactors {
  kyb: number;
  documents: number;
  responseTime: number;
  completedDeals: number;
  tenure: number;
  reviews: number;
}

export interface RatingDisplay {
  hasReviews: boolean;
  display: string;
  badge?: 'top-rated' | 'new' | 'limited';
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const scoreKyb = (status: Company['kybStatus']): number => {
  if (status === 'verified') return 100;
  if (status === 'pending') return 50;
  return 0;
};

const scoreDocuments = (company: Company): number => {
  const required = company.documentsRequired ?? DEFAULT_REQUIRED_DOCS;
  const uploaded = company.documentsUploaded ?? [];
  if (required.length === 0) return 0;
  const matched = uploaded.filter((doc) => required.includes(doc)).length;
  const ratio = matched / required.length;
  return Math.round(clamp(ratio * 100, 0, 100));
};

const scoreResponseTime = (hours: number | undefined): number => {
  if (hours === undefined) return 40;
  if (hours < 2) return 100;
  if (hours < 6) return 85;
  if (hours < 12) return 70;
  if (hours < 24) return 55;
  return 40;
};

const scoreCompletedDeals = (deals: number | undefined): number => {
  const count = deals ?? 0;
  if (count === 0) return 50;
  if (count <= 5) return 70;
  if (count <= 20) return 85;
  return 95;
};

const monthsBetween = (fromIso: string, to: Date): number => {
  const from = new Date(fromIso);
  if (Number.isNaN(from.getTime())) return 0;
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  let total = years * 12 + months;
  if (to.getDate() < from.getDate()) total -= 1;
  return total;
};

const scoreTenure = (joinedDate: string | undefined): number => {
  if (!joinedDate) return 60;
  const months = monthsBetween(joinedDate, new Date());
  if (months < 3) return 60;
  if (months <= 5) return 75;
  if (months <= 11) return 85;
  return 95;
};

const scoreReviews = (reviews: Company['reviews']): number => {
  const list = reviews ?? [];
  if (list.length === 0) return 70;
  const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  return (avg / 5) * 100;
};

export function getReliabilityBreakdown(company: Company): ReliabilityFactors {
  return {
    kyb: scoreKyb(company.kybStatus),
    documents: scoreDocuments(company),
    responseTime: scoreResponseTime(company.avgResponseTimeHours),
    completedDeals: scoreCompletedDeals(company.completedDeals),
    tenure: scoreTenure(company.joinedDate),
    reviews: scoreReviews(company.reviews),
  };
}

export function calculateAIReliability(company: Company): number {
  const f = getReliabilityBreakdown(company);
  const score =
    f.kyb * 0.25 +
    f.documents * 0.2 +
    f.responseTime * 0.15 +
    f.completedDeals * 0.15 +
    f.tenure * 0.15 +
    f.reviews * 0.1;
  return clamp(Math.round(score), 0, 100);
}

export function getAverageRating(company: Company): number | null {
  const list = company.reviews ?? [];
  if (list.length === 0) return null;
  const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  return Math.round(avg * 10) / 10;
}

export function getReviewCount(company: Company): number {
  return company.reviews?.length ?? 0;
}

export function getRatingDisplay(company: Company): RatingDisplay {
  const count = getReviewCount(company);
  const avg = getAverageRating(company);

  if (count === 0) {
    return { hasReviews: false, display: 'New listing', badge: 'new' };
  }

  if (count <= 4) {
    return {
      hasReviews: true,
      display: `${avg!.toFixed(1)} (${count} reviews) · Limited`,
      badge: 'limited',
    };
  }

  if (avg! >= 4.5) {
    return {
      hasReviews: true,
      display: `${avg!.toFixed(1)} (${count} reviews)`,
      badge: 'top-rated',
    };
  }

  return {
    hasReviews: true,
    display: `${avg!.toFixed(1)} (${count} reviews)`,
  };
}
