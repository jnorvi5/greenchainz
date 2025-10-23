// Vetting-related types for supplier certification and verification

export type VettingStatus = 'pending' | 'needs_info' | 'verified' | 'rejected';

export type VettingAction = 'approve' | 'reject' | 'request_docs' | 'verify_cert';

export type CompostabilityStandard = 'ASTM D6400' | 'ASTM D6868' | 'EN 13432';

export type OrganicTextileCert = 'GOTS' | 'OCS';

export type RecycledContentCert = 'GRS' | 'RCS';

export type EthicalAgriCert = 'Rainforest Alliance' | 'Fairtrade';

export interface CertificationEvidence {
  epd_url?: string;
  fsc_license_code?: string;
  compostability_standard?: CompostabilityStandard;
  organic_textile_cert?: OrganicTextileCert;
  recycled_content_cert?: RecycledContentCert;
  ethical_agri_cert?: EthicalAgriCert;
}

export interface VettingChecklist {
  certifications_verified?: boolean;
  documentation_complete?: boolean;
  compliance_check_passed?: boolean;
  evidence_urls_validated?: boolean;
  [key: string]: boolean | undefined;
}

export interface VettingReview {
  id: string;
  supplier_id: string;
  action: VettingAction;
  actor: string;
  checklist?: VettingChecklist;
  notes?: string;
  created_at: string;
}

export interface SupplierVettingData {
  vetting_status: VettingStatus;
  vetting_notes?: string;
  last_verified_at?: string;
  compliance_flags?: Record<string, any>;
  verification_date?: string;
}

export interface VettingActionRequest {
  supplier_id: string;
  action: VettingAction;
  actor: string;
  notes?: string;
  checklist?: VettingChecklist;
}
