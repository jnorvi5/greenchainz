/**
 * Supplier types and constants for GreenChainz
 */

// Verification status for scraped suppliers
export type VerificationStatus = 'verified' | 'pending' | 'unverified' | 'rejected';

// Data source for suppliers
export type DataSource = 'scrape' | 'manual' | 'api' | 'claim';

// Construction material categories
export const CONSTRUCTION_CATEGORIES = [
  'Insulation',
  'Concrete',
  'Lumber',
  'Roofing',
  'Paint',
  'Steel',
  'Glass',
  'Flooring',
  'Drywall',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Windows & Doors',
  'Masonry',
  'Siding',
  'Landscaping Materials',
] as const;

export type ConstructionCategory = typeof CONSTRUCTION_CATEGORIES[number];

// Sustainability certifications
export const SUSTAINABILITY_CERTIFICATIONS = [
  'LEED',
  'FSC',
  'Cradle to Cradle',
  'EPD',
  'Energy Star',
  'Green Seal',
  'USDA Organic',
  'Fair Trade',
  'ISO 14001',
  'B Corp',
  'Carbon Neutral',
  'GREENGUARD',
  'SCS Certified',
  'Declare',
  'Living Building Challenge',
] as const;

export type SustainabilityCertification = typeof SUSTAINABILITY_CERTIFICATIONS[number];

// Supplier interface
export interface Supplier {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  category?: string;
  sustainability_score?: number;
  location?: string;
  certifications?: string[];
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  established_year?: number;
  employee_count?: number;
  annual_revenue?: number;
  carbon_footprint?: number;
  renewable_energy_percentage?: number;
  waste_recycling_rate?: number;
  water_usage_efficiency?: string;
  supply_chain_transparency?: string;
  verified?: boolean;
  verification_date?: string;
  
  // Web scraping fields
  verification_status?: VerificationStatus;
  data_source?: DataSource;
  scraped_url?: string;
  is_claimed?: boolean;
  claim_token?: string;
  
  created_at?: string;
  updated_at?: string;
}

// Search filters interface
export interface SupplierSearchFilters {
  query?: string;
  category?: string;
  minScore?: number;
  location?: string;
  certification?: string;
  verificationStatus?: VerificationStatus;
  dataSource?: DataSource;
  includeUnverified?: boolean;
}

// Featured supplier (subset of Supplier with guaranteed fields)
export interface FeaturedSupplier {
  id: string;
  name: string;
  description: string;
  category: string;
  sustainability_score: number;
  location: string;
  certifications: string[];
  verified: boolean;
}
