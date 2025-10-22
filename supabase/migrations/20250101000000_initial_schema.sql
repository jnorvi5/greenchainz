-- Create suppliers table for GreenChainz
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
  location VARCHAR(255),
  certifications TEXT[], -- Array of certification names
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website VARCHAR(255),
  established_year INTEGER,
  employee_count INTEGER,
  annual_revenue DECIMAL(15,2),
  carbon_footprint DECIMAL(10,2), -- in tons CO2 per year
  renewable_energy_percentage DECIMAL(5,2), -- percentage of energy from renewables
  waste_recycling_rate DECIMAL(5,2), -- percentage of waste recycled
  water_usage_efficiency VARCHAR(50), -- rating: Excellent, Good, Average, Poor
  supply_chain_transparency VARCHAR(50), -- rating: High, Medium, Low
  verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers(category);
CREATE INDEX IF NOT EXISTS idx_suppliers_location ON suppliers(location);
CREATE INDEX IF NOT EXISTS idx_suppliers_sustainability_score ON suppliers(sustainability_score);
CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON suppliers(verified);

-- Enable Row Level Security (RLS)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies for suppliers table
-- Allow anyone to read verified suppliers
CREATE POLICY "Anyone can view verified suppliers" ON suppliers
  FOR SELECT USING (verified = true);

-- Allow authenticated users to read all suppliers
CREATE POLICY "Authenticated users can view all suppliers" ON suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow suppliers to manage their own records (when we add user ownership)
-- This will be updated when we implement supplier registration

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();