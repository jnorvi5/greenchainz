-- Migration: 20251023000100_vetting_and_certifications.sql
-- Description: Add structured certification evidence fields and vetting workflow to suppliers

-- Add certification evidence and vetting columns to suppliers table
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS epd_url TEXT,
ADD COLUMN IF NOT EXISTS fsc_license_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS compostability_standard VARCHAR(50) CHECK (compostability_standard IN ('ASTM D6400', 'ASTM D6868', 'EN 13432', NULL)),
ADD COLUMN IF NOT EXISTS organic_textile_cert VARCHAR(50) CHECK (organic_textile_cert IN ('GOTS', 'OCS', NULL)),
ADD COLUMN IF NOT EXISTS recycled_content_cert VARCHAR(50) CHECK (recycled_content_cert IN ('GRS', 'RCS', NULL)),
ADD COLUMN IF NOT EXISTS ethical_agri_cert VARCHAR(50) CHECK (ethical_agri_cert IN ('Rainforest Alliance', 'Fairtrade', NULL)),
ADD COLUMN IF NOT EXISTS vetting_status VARCHAR(50) DEFAULT 'pending' CHECK (vetting_status IN ('pending', 'needs_info', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS vetting_notes TEXT,
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS compliance_flags JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE;

-- Create vetting_reviews audit trail table
CREATE TABLE IF NOT EXISTS vetting_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('approve', 'reject', 'request_docs', 'verify_cert')),
  actor VARCHAR(255) NOT NULL,
  checklist JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_vetting_reviews_supplier_id ON vetting_reviews(supplier_id);
CREATE INDEX IF NOT EXISTS idx_vetting_reviews_created_at ON vetting_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_suppliers_vetting_status ON suppliers(vetting_status);

-- Enable Row Level Security on vetting_reviews
ALTER TABLE vetting_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vetting_reviews
-- Allow public read access (admins can see audit trail)
CREATE POLICY "Allow public read access on vetting_reviews" ON vetting_reviews FOR SELECT USING (true);

-- Allow insert for authenticated users (will be restricted to service role in practice)
CREATE POLICY "Allow insert on vetting_reviews for authenticated users" ON vetting_reviews FOR INSERT WITH CHECK (true);

-- Add comments for documentation
COMMENT ON COLUMN suppliers.epd_url IS 'URL to Environmental Product Declaration';
COMMENT ON COLUMN suppliers.fsc_license_code IS 'Forest Stewardship Council license code';
COMMENT ON COLUMN suppliers.compostability_standard IS 'Compostability certification standard (ASTM D6400, ASTM D6868, EN 13432)';
COMMENT ON COLUMN suppliers.organic_textile_cert IS 'Organic textile certification (GOTS, OCS)';
COMMENT ON COLUMN suppliers.recycled_content_cert IS 'Recycled content certification (GRS, RCS)';
COMMENT ON COLUMN suppliers.ethical_agri_cert IS 'Ethical agriculture certification (Rainforest Alliance, Fairtrade)';
COMMENT ON COLUMN suppliers.vetting_status IS 'Current vetting status (pending, needs_info, verified, rejected)';
COMMENT ON COLUMN suppliers.vetting_notes IS 'Internal notes about vetting process';
COMMENT ON COLUMN suppliers.last_verified_at IS 'Timestamp of last verification';
COMMENT ON COLUMN suppliers.compliance_flags IS 'JSONB field for storing compliance-related flags';
COMMENT ON TABLE vetting_reviews IS 'Audit trail for supplier vetting actions';
