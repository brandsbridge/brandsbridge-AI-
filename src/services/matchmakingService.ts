// Matchmaking Service - Buyer-Supplier Compatibility Engine
// JSON-based for efficiency and fast response times

import { companies, Company } from '../data/mockData';

export interface BuyerRequirements {
  productCategory?: string;
  productKeywords?: string[];
  targetCountry?: string;
  sourceCountries?: string[];
  certifications?: string[];
  businessType?: string[];
  minOrderValue?: string;
  trustedOnly?: boolean;
}

export interface MatchResult {
  company: Company;
  score: number;
  matchDetails: {
    productMatch: number;
    locationMatch: number;
    certificationMatch: number;
    trustBonus: number;
  };
  highlights: string[];
}

// Parse natural language query into structured requirements
export function parseUserQuery(query: string): BuyerRequirements {
  const lowerQuery = query.toLowerCase();
  const requirements: BuyerRequirements = {};

  // Product categories detection
  const categoryKeywords: Record<string, string[]> = {
    'Confectionery': ['chocolate', 'candy', 'sweets', 'confection', 'wafer', 'biscuit', 'cookie'],
    'Dairy': ['dairy', 'milk', 'cheese', 'yogurt', 'butter', 'cream'],
    'Beverages': ['beverage', 'drink', 'juice', 'water', 'soda', 'energy drink'],
    'Snacks': ['snack', 'chips', 'nuts', 'crackers', 'popcorn'],
    'Oils': ['oil', 'olive oil', 'sunflower', 'cooking oil', 'vegetable oil'],
    'Grains': ['rice', 'wheat', 'flour', 'pasta', 'noodles', 'cereal'],
    'Canned Foods': ['canned', 'preserved', 'tomato paste', 'beans'],
    'Sauces': ['sauce', 'ketchup', 'mayonnaise', 'condiment', 'dressing']
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      requirements.productCategory = category;
      requirements.productKeywords = keywords.filter(kw => lowerQuery.includes(kw));
      break;
    }
  }

  // Country detection
  const countries: Record<string, string[]> = {
    'Turkey': ['turkey', 'turkish'],
    'UAE': ['uae', 'emirates', 'dubai', 'abu dhabi'],
    'Saudi Arabia': ['saudi', 'ksa', 'riyadh', 'jeddah'],
    'Egypt': ['egypt', 'egyptian', 'cairo'],
    'USA': ['usa', 'america', 'american', 'united states'],
    'Germany': ['germany', 'german'],
    'France': ['france', 'french'],
    'Italy': ['italy', 'italian'],
    'Spain': ['spain', 'spanish'],
    'China': ['china', 'chinese'],
    'India': ['india', 'indian'],
    'Brazil': ['brazil', 'brazilian'],
    'UK': ['uk', 'britain', 'british', 'england'],
    'Jordan': ['jordan', 'jordanian', 'amman'],
    'Kuwait': ['kuwait', 'kuwaiti'],
    'Qatar': ['qatar', 'qatari', 'doha'],
    'Oman': ['oman', 'omani', 'muscat'],
    'Bahrain': ['bahrain', 'bahraini'],
    'Morocco': ['morocco', 'moroccan'],
    'Algeria': ['algeria', 'algerian'],
    'Tunisia': ['tunisia', 'tunisian'],
    'Nigeria': ['nigeria', 'nigerian', 'lagos'],
    'Kenya': ['kenya', 'kenyan', 'nairobi'],
    'South Africa': ['south africa', 'johannesburg']
  };

  const sourceCountries: string[] = [];
  for (const [country, aliases] of Object.entries(countries)) {
    if (aliases.some(alias => lowerQuery.includes(alias))) {
      if (lowerQuery.includes('from') || lowerQuery.includes('in') || lowerQuery.includes('supplier')) {
        sourceCountries.push(country);
      } else if (lowerQuery.includes('to') || lowerQuery.includes('export')) {
        requirements.targetCountry = country;
      } else {
        sourceCountries.push(country);
      }
    }
  }
  if (sourceCountries.length > 0) {
    requirements.sourceCountries = sourceCountries;
  }

  // Certification detection
  const certKeywords: Record<string, string[]> = {
    'Halal': ['halal', 'halaal'],
    'Organic': ['organic', 'bio'],
    'ISO 22000': ['iso', 'iso22000', 'iso 22000'],
    'BRC': ['brc', 'british retail consortium'],
    'FDA': ['fda', 'food and drug'],
    'HACCP': ['haccp'],
    'Kosher': ['kosher'],
    'Non-GMO': ['non-gmo', 'gmo-free', 'no gmo']
  };

  const certs: string[] = [];
  for (const [cert, keywords] of Object.entries(certKeywords)) {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      certs.push(cert);
    }
  }
  if (certs.length > 0) {
    requirements.certifications = certs;
  }

  // Business type detection
  const businessTypes: string[] = [];
  if (lowerQuery.includes('manufacturer') || lowerQuery.includes('factory') || lowerQuery.includes('producer')) {
    businessTypes.push('Manufacturer');
  }
  if (lowerQuery.includes('exporter')) businessTypes.push('Exporter');
  if (lowerQuery.includes('distributor')) businessTypes.push('Distributor');
  if (lowerQuery.includes('importer')) businessTypes.push('Importer');
  if (businessTypes.length > 0) {
    requirements.businessType = businessTypes;
  }

  // Trusted/Verified filter
  if (lowerQuery.includes('trusted') || lowerQuery.includes('verified') || lowerQuery.includes('reliable')) {
    requirements.trustedOnly = true;
  }

  return requirements;
}

// Calculate compatibility score between buyer requirements and company
export function calculateCompatibility(company: Company, requirements: BuyerRequirements): MatchResult {
  let productScore = 0;
  let locationScore = 0;
  let certScore = 0;
  let trustBonus = 0;
  const highlights: string[] = [];

  // Product matching (40% weight)
  if (requirements.productCategory || requirements.productKeywords) {
    const companyCategories = company.categories.map(c => c.toLowerCase()).join(' ');
    const companyDesc = company.description.toLowerCase();

    if (requirements.productCategory) {
      if (company.categories.some(c => c.toLowerCase().includes(requirements.productCategory!.toLowerCase()))) {
        productScore += 30;
        highlights.push(`Specializes in ${requirements.productCategory}`);
      }
    }

    if (requirements.productKeywords) {
      const matchedKeywords = requirements.productKeywords.filter(kw =>
        companyCategories.includes(kw) || companyDesc.includes(kw)
      );
      productScore += Math.min(10, matchedKeywords.length * 5);
      if (matchedKeywords.length > 0) {
        highlights.push(`Products: ${matchedKeywords.join(', ')}`);
      }
    }
  } else {
    productScore = 20; // Default score if no product specified
  }

  // Location matching (30% weight)
  if (requirements.sourceCountries && requirements.sourceCountries.length > 0) {
    if (requirements.sourceCountries.includes(company.country)) {
      locationScore = 30;
      highlights.push(`Located in ${company.country}`);
    }
  } else {
    locationScore = 15; // Default
  }

  if (requirements.targetCountry) {
    if (company.exportCountries.some(c => c.toLowerCase().includes(requirements.targetCountry!.toLowerCase()))) {
      locationScore = Math.min(30, locationScore + 15);
      highlights.push(`Exports to ${requirements.targetCountry}`);
    }
  }

  // Certification matching (20% weight)
  if (requirements.certifications && requirements.certifications.length > 0) {
    const matchedCerts = requirements.certifications.filter(cert =>
      company.certifications.some(cc => cc.toLowerCase().includes(cert.toLowerCase()))
    );
    certScore = Math.min(20, matchedCerts.length * 10);
    if (matchedCerts.length > 0) {
      highlights.push(`Certified: ${matchedCerts.join(', ')}`);
    }
  } else {
    certScore = 10; // Default
  }

  // Business type matching
  if (requirements.businessType && requirements.businessType.length > 0) {
    if (requirements.businessType.includes(company.businessType)) {
      productScore += 5;
      highlights.push(`${company.businessType}`);
    }
  }

  // Trust bonus (10% weight)
  if (company.verified) {
    trustBonus += 5;
    highlights.push('Verified Company');
  }
  if (company.subscriptionPlan === 'Premium' || company.subscriptionPlan === 'Expo') {
    trustBonus += 5;
    highlights.push('Premium Partner');
  }

  // Filter by trusted only
  if (requirements.trustedOnly && !company.verified) {
    return {
      company,
      score: 0,
      matchDetails: { productMatch: 0, locationMatch: 0, certificationMatch: 0, trustBonus: 0 },
      highlights: ['Does not meet trusted filter']
    };
  }

  const totalScore = Math.min(100, productScore + locationScore + certScore + trustBonus);

  return {
    company,
    score: totalScore,
    matchDetails: {
      productMatch: productScore,
      locationMatch: locationScore,
      certificationMatch: certScore,
      trustBonus
    },
    highlights
  };
}

// Find top matching suppliers for buyer requirements
export function findMatchingSuppliers(requirements: BuyerRequirements, limit: number = 3): MatchResult[] {
  const results = companies
    .map(company => calculateCompatibility(company, requirements))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

// Main function to process buyer query and return matches
export function matchBuyerToSuppliers(query: string): { requirements: BuyerRequirements; matches: MatchResult[] } {
  const requirements = parseUserQuery(query);
  const matches = findMatchingSuppliers(requirements);
  return { requirements, matches };
}

// Format match results for chat display
export function formatMatchResults(matches: MatchResult[]): string {
  if (matches.length === 0) {
    return "I couldn't find any suppliers matching your exact criteria. Could you provide more details about what you're looking for?";
  }

  let response = `I found **${matches.length} matching suppliers** for you:\n\n`;

  matches.forEach((match, index) => {
    const company = match.company;
    const scoreEmoji = match.score >= 85 ? '🟢' : match.score >= 70 ? '🟡' : '🟠';

    response += `${scoreEmoji} **${match.score}% Match** - ${company.name}\n`;
    response += `   📍 ${company.country} | ${company.businessType}\n`;
    response += `   ✓ ${match.highlights.slice(0, 3).join(' • ')}\n`;
    if (company.verified) {
      response += `   ✅ Verified Supplier\n`;
    }
    response += `\n`;
  });

  response += `Would you like me to:\n• Schedule a meeting with any of these suppliers?\n• Send an inquiry on your behalf?\n• Show more details about a specific company?`;

  return response;
}
