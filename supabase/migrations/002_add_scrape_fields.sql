-- GreenChainz Database Schema
-- Migration: 002_add_scrape_fields.sql
-- Description: Add fields to support scraped/unverified suppliers from web scraping

-- Add verification_status column
-- Tracks the verification status: verified, pending, unverified, rejected
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'pending', 'unverified', 'rejected'));

-- Add data_source column
-- Tracks where the supplier data originated: scrape, manual, api, claim
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS data_source VARCHAR(50) DEFAULT 'manual' CHECK (data_source IN ('scrape', 'manual', 'api', 'claim'));

-- Add scraped_url column
-- Stores the original URL the supplier data was scraped from
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS scraped_url TEXT;

-- Add is_claimed column
-- Indicates if a scraped supplier profile has been claimed by the actual business
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT false;

-- Add claim_token column
-- Unique token used for supplier to claim their scraped profile
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS claim_token UUID DEFAULT gen_random_uuid();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_suppliers_verification_status ON suppliers(verification_status);
CREATE INDEX IF NOT EXISTS idx_suppliers_data_source ON suppliers(data_source);
CREATE INDEX IF NOT EXISTS idx_suppliers_is_claimed ON suppliers(is_claimed);
CREATE INDEX IF NOT EXISTS idx_suppliers_claim_token ON suppliers(claim_token);

-- Update RLS policies to allow viewing unverified suppliers for admins
-- Keep existing public read for verified suppliers
-- Admins can see all suppliers including unverified ones

-- Create full-text search index on name and description for better search performance
CREATE INDEX IF NOT EXISTS idx_suppliers_name_description ON suppliers USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- Comments for documentation
COMMENT ON COLUMN suppliers.verification_status IS 'Verification status: verified, pending, unverified, rejected';
COMMENT ON COLUMN suppliers.data_source IS 'Source of supplier data: scrape, manual, api, claim';
COMMENT ON COLUMN suppliers.scraped_url IS 'Original URL the supplier was scraped from';
COMMENT ON COLUMN suppliers.is_claimed IS 'Whether a scraped supplier has been claimed by the business';
COMMENT ON COLUMN suppliers.claim_token IS 'Unique token for supplier to claim their profile';
