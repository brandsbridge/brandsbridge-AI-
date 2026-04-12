/**
 * Company Search Utility for Brands Bridge AI
 * Intelligent JSON-based search for 100+ suppliers
 * Supports natural language queries
 */

import { Company, companies } from '../data/mockData';

// Search query interface
export interface SearchQuery {
  products?: string[];
  categories?: string[];
  countries?: string[];
  businessTypes?: string[];
  certifications?: string[];
  keywords?: string[];
  exportTo?: string[];
  minRating?: number;
  verified?: boolean;
}

// Search result with relevance score
export interface SearchResult {
  company: Company;
  score: number;
  matchedFields: string[];
}

// Country aliases for natural language parsing
const countryAliases: Record<string, string[]> = {
  'turkey': ['turkey', 'turkish', 'turkiye', 'tr'],
  'uae': ['uae', 'emirates', 'dubai', 'abu dhabi', 'united arab emirates'],
  'saudi arabia': ['saudi', 'saudi arabia', 'ksa', 'kingdom of saudi arabia'],
  'spain': ['spain', 'spanish', 'espana'],
  'italy': ['italy', 'italian', 'italia'],
  'germany': ['germany', 'german', 'deutschland'],
  'france': ['france', 'french'],
  'netherlands': ['netherlands', 'dutch', 'holland'],
  'belgium': ['belgium', 'belgian'],
  'poland': ['poland', 'polish'],
  'egypt': ['egypt', 'egyptian'],
  'morocco': ['morocco', 'moroccan'],
  'tunisia': ['tunisia', 'tunisian'],
  'jordan': ['jordan', 'jordanian'],
  'lebanon': ['lebanon', 'lebanese'],
  'syria': ['syria', 'syrian'],
  'iraq': ['iraq', 'iraqi'],
  'iran': ['iran', 'iranian', 'persia'],
  'india': ['india', 'indian'],
  'china': ['china', 'chinese'],
  'usa': ['usa', 'america', 'american', 'united states', 'us'],
  'uk': ['uk', 'britain', 'british', 'england', 'united kingdom'],
  'brazil': ['brazil', 'brazilian'],
  'argentina': ['argentina', 'argentinian'],
  'kenya': ['kenya', 'kenyan'],
  'south africa': ['south africa', 'south african'],
  'nigeria': ['nigeria', 'nigerian'],
  'ghana': ['ghana', 'ghanaian'],
};

// Product category keywords
const productKeywords: Record<string, string[]> = {
  'chocolate': ['chocolate', 'cocoa', 'cacao', 'praline', 'truffle', 'bonbon'],
  'confectionery': ['confectionery', 'candy', 'sweets', 'sugar', 'gummy', 'jelly', 'lollipop', 'hard candy'],
  'biscuits': ['biscuit', 'cookie', 'wafer', 'cracker', 'shortbread'],
  'dairy': ['dairy', 'milk', 'cheese', 'yogurt', 'butter', 'cream', 'uht', 'laban'],
  'beverages': ['beverage', 'drink', 'juice', 'water', 'soda', 'tea', 'coffee', 'energy drink'],
  'olive oil': ['olive', 'olive oil', 'extra virgin', 'evoo'],
  'oils': ['oil', 'sunflower', 'vegetable oil', 'cooking oil', 'palm oil', 'canola'],
  'snacks': ['snack', 'chips', 'crisps', 'nuts', 'popcorn', 'pretzel'],
  'pasta': ['pasta', 'spaghetti', 'noodle', 'macaroni', 'penne'],
  'rice': ['rice', 'basmati', 'jasmine', 'grain'],
  'sugar': ['sugar', 'sweetener', 'glucose', 'fructose'],
  'honey': ['honey', 'bee', 'natural sweetener'],
  'spices': ['spice', 'seasoning', 'herb', 'pepper', 'cumin', 'turmeric'],
  'canned': ['canned', 'preserved', 'tinned', 'jarred'],
  'frozen': ['frozen', 'ice cream', 'frozen food'],
  'meat': ['meat', 'beef', 'chicken', 'lamb', 'poultry', 'halal meat'],
  'seafood': ['seafood', 'fish', 'tuna', 'salmon', 'shrimp', 'prawns'],
  'coffee': ['coffee', 'instant coffee', 'ground coffee', 'espresso', 'arabica', 'robusta'],
  'tea': ['tea', 'black tea', 'green tea', 'herbal tea'],
  'baby food': ['baby', 'infant', 'baby food', 'formula', 'cereal'],
  'pet food': ['pet', 'dog food', 'cat food', 'animal feed'],
  'organic': ['organic', 'bio', 'natural', 'chemical-free'],
  'halal': ['halal', 'islamic', 'muslim-friendly'],
  'private label': ['private label', 'white label', 'oem', 'contract manufacturing'],
};

// Business type keywords
const businessTypeKeywords: Record<string, string[]> = {
  'manufacturer': ['manufacturer', 'producer', 'factory', 'make', 'production'],
  'exporter': ['exporter', 'export', 'trade', 'international'],
  'distributor': ['distributor', 'distribution', 'wholesale', 'supply'],
  'importer': ['importer', 'import', 'buying'],
};

// Certification keywords
const certificationKeywords: Record<string, string[]> = {
  'halal': ['halal', 'islamic', 'muslim'],
  'iso': ['iso', 'iso 22000', 'iso 9001'],
  'brc': ['brc', 'british retail'],
  'haccp': ['haccp', 'food safety'],
  'organic': ['organic', 'usda organic', 'eu organic'],
  'kosher': ['kosher', 'jewish'],
  'fda': ['fda', 'food and drug'],
  'gmp': ['gmp', 'good manufacturing'],
};

/**
 * Parse natural language query into structured search
 */
export function parseNaturalQuery(query: string): SearchQuery {
  const lowerQuery = query.toLowerCase();
  const result: SearchQuery = {
    products: [],
    categories: [],
    countries: [],
    businessTypes: [],
    certifications: [],
    keywords: [],
    exportTo: [],
  };

  // Extract countries
  for (const [country, aliases] of Object.entries(countryAliases)) {
    for (const alias of aliases) {
      if (lowerQuery.includes(alias)) {
        if (!result.countries!.includes(country)) {
          result.countries!.push(country);
        }
        break;
      }
    }
  }

  // Check for "export to" pattern
  const exportToMatch = lowerQuery.match(/export(?:s|ing)?\s+to\s+(\w+)/i);
  if (exportToMatch) {
    const targetCountry = exportToMatch[1].toLowerCase();
    for (const [country, aliases] of Object.entries(countryAliases)) {
      if (aliases.includes(targetCountry)) {
        result.exportTo!.push(country);
        break;
      }
    }
  }

  // Extract product categories
  for (const [category, keywords] of Object.entries(productKeywords)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        if (!result.categories!.includes(category)) {
          result.categories!.push(category);
        }
        result.keywords!.push(keyword);
        break;
      }
    }
  }

  // Extract business types
  for (const [type, keywords] of Object.entries(businessTypeKeywords)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        if (!result.businessTypes!.includes(type)) {
          result.businessTypes!.push(type);
        }
        break;
      }
    }
  }

  // Extract certifications
  for (const [cert, keywords] of Object.entries(certificationKeywords)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        if (!result.certifications!.includes(cert)) {
          result.certifications!.push(cert);
        }
        break;
      }
    }
  }

  // Check for verified companies
  if (lowerQuery.includes('verified') || lowerQuery.includes('trusted')) {
    result.verified = true;
  }

  return result;
}

/**
 * Calculate match score for a company
 */
function calculateScore(company: Company, query: SearchQuery): { score: number; matchedFields: string[] } {
  let score = 0;
  const matchedFields: string[] = [];

  // Country match (high weight)
  if (query.countries && query.countries.length > 0) {
    const companyCountry = company.country.toLowerCase();
    for (const country of query.countries) {
      const aliases = countryAliases[country] || [country];
      if (aliases.some(alias => companyCountry.includes(alias))) {
        score += 30;
        matchedFields.push(`Country: ${company.country}`);
        break;
      }
    }
  }

  // Category/product match (high weight)
  if (query.categories && query.categories.length > 0) {
    const companyCategories = company.categories.map(c => c.toLowerCase()).join(' ');
    const companyDesc = company.description.toLowerCase();

    for (const category of query.categories) {
      const keywords = productKeywords[category] || [category];
      for (const keyword of keywords) {
        if (companyCategories.includes(keyword) || companyDesc.includes(keyword)) {
          score += 25;
          matchedFields.push(`Product: ${category}`);
          break;
        }
      }
    }
  }

  // Business type match (medium weight)
  if (query.businessTypes && query.businessTypes.length > 0) {
    const companyType = company.businessType.toLowerCase();
    for (const type of query.businessTypes) {
      if (companyType.includes(type) || companyType.includes(type.replace('er', ''))) {
        score += 15;
        matchedFields.push(`Type: ${company.businessType}`);
        break;
      }
    }
  }

  // Certification match (medium weight)
  if (query.certifications && query.certifications.length > 0) {
    const companyCerts = company.certifications.map(c => c.toLowerCase()).join(' ');
    for (const cert of query.certifications) {
      const keywords = certificationKeywords[cert] || [cert];
      for (const keyword of keywords) {
        if (companyCerts.includes(keyword)) {
          score += 15;
          matchedFields.push(`Certification: ${cert.toUpperCase()}`);
          break;
        }
      }
    }
  }

  // Export markets match
  if (query.exportTo && query.exportTo.length > 0) {
    const exportCountries = company.exportCountries.map(c => c.toLowerCase()).join(' ');
    for (const target of query.exportTo) {
      const aliases = countryAliases[target] || [target];
      if (aliases.some(alias => exportCountries.includes(alias))) {
        score += 10;
        matchedFields.push(`Exports to: ${target}`);
        break;
      }
    }
  }

  // Verified bonus
  if (query.verified && company.verified) {
    score += 10;
    matchedFields.push('Verified Company');
  }

  // Keyword match in description
  if (query.keywords && query.keywords.length > 0) {
    const desc = company.description.toLowerCase();
    for (const keyword of query.keywords) {
      if (desc.includes(keyword)) {
        score += 5;
      }
    }
  }

  // Premium subscription bonus
  if (company.subscriptionPlan === 'Premium') {
    score += 5;
  }

  return { score, matchedFields };
}

/**
 * Main search function
 */
export function searchCompanies(query: string | SearchQuery, limit: number = 10): SearchResult[] {
  // Parse query if it's a string
  const searchQuery = typeof query === 'string' ? parseNaturalQuery(query) : query;

  // Score all companies
  const results: SearchResult[] = companies.map(company => {
    const { score, matchedFields } = calculateScore(company, searchQuery);
    return { company, score, matchedFields };
  });

  // Filter and sort by score
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get companies by category
 */
export function getCompaniesByCategory(categoryName: string): Company[] {
  const lower = categoryName.toLowerCase();
  return companies.filter(c =>
    c.categories.some(cat => cat.toLowerCase().includes(lower))
  );
}

/**
 * Get companies by country
 */
export function getCompaniesByCountry(country: string): Company[] {
  const lower = country.toLowerCase();
  const aliases = countryAliases[lower] || [lower];
  return companies.filter(c =>
    aliases.some(alias => c.country.toLowerCase().includes(alias))
  );
}

/**
 * Format search results for chat display
 */
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return "I couldn't find any suppliers matching your criteria. Try broadening your search or asking about different products.";
  }

  let response = `I found **${results.length} supplier${results.length > 1 ? 's** that match' : '** that matches'} your requirements:\n\n`;

  results.slice(0, 5).forEach((result, index) => {
    const company = result.company;
    const verified = company.verified ? ' ✓ Verified' : '';
    const premium = company.subscriptionPlan === 'Premium' ? ' ⭐ Premium' : '';

    response += `**${index + 1}. ${company.name}** (${company.country})${verified}${premium}\n`;
    response += `   ${company.businessType} | ${company.categories.slice(0, 2).join(', ')}\n`;

    if (result.matchedFields.length > 0) {
      response += `   _Matches: ${result.matchedFields.slice(0, 3).join(', ')}_\n`;
    }

    if (company.certifications.length > 0) {
      response += `   Certifications: ${company.certifications.slice(0, 3).join(', ')}\n`;
    }

    response += '\n';
  });

  if (results.length > 5) {
    response += `\n_...and ${results.length - 5} more suppliers available_\n`;
  }

  response += '\nWould you like me to:\n';
  response += '• Show more details about any company?\n';
  response += '• Schedule a video meeting with a supplier?\n';
  response += '• Send an inquiry on your behalf?';

  return response;
}

/**
 * Get search suggestions based on available data
 */
export function getSearchSuggestions(): string[] {
  return [
    'Find chocolate manufacturers in Turkey',
    'Show me olive oil exporters from Spain',
    'Looking for halal dairy suppliers',
    'Find confectionery distributors in UAE',
    'I need organic food suppliers from Germany',
    'Show verified beverage exporters',
    'Find private label snack manufacturers',
  ];
}

/**
 * Get statistics about the company database
 */
export function getDatabaseStats(): {
  totalCompanies: number;
  byCountry: Record<string, number>;
  byType: Record<string, number>;
  verifiedCount: number;
} {
  const byCountry: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let verifiedCount = 0;

  companies.forEach(company => {
    // Count by country
    byCountry[company.country] = (byCountry[company.country] || 0) + 1;

    // Count by type
    byType[company.businessType] = (byType[company.businessType] || 0) + 1;

    // Count verified
    if (company.verified) verifiedCount++;
  });

  return {
    totalCompanies: companies.length,
    byCountry,
    byType,
    verifiedCount,
  };
}
