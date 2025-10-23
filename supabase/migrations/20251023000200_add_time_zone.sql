-- Migration: Add time_zone field to suppliers table
-- This migration adds IANA time zone support for suppliers

ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS time_zone VARCHAR(100);

-- Add a comment for documentation
COMMENT ON COLUMN suppliers.time_zone IS 'IANA time zone identifier (e.g., America/New_York, Europe/London)';

-- Add an index for better query performance when filtering by time zone
CREATE INDEX IF NOT EXISTS idx_suppliers_time_zone ON suppliers(time_zone);
