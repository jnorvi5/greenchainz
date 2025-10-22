-- GreenChainz Database Schema
-- Migration: 001_init.sql
-- Description: Initial database schema for users, suppliers, products, RFQs, and RFQ responses

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('buyer', 'supplier', 'admin')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(255),
  phone VARCHAR(50),
  avatar TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(255),
  website TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
  certifications TEXT[],
  verified BOOLEAN DEFAULT false,
  established_year INTEGER,
  employee_count INTEGER,
  annual_revenue NUMERIC,
  carbon_footprint NUMERIC,
  renewable_energy_percentage INTEGER,
  waste_recycling_rate INTEGER,
  water_usage_efficiency VARCHAR(50),
  supply_chain_transparency VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price NUMERIC NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  minimum_order INTEGER,
  unit VARCHAR(50),
  images TEXT[],
  certifications TEXT[],
  specifications JSONB,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RFQs (Request for Quotations) table
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit VARCHAR(50),
  target_price NUMERIC,
  currency VARCHAR(10) DEFAULT 'USD',
  deadline TIMESTAMP WITH TIME ZONE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'awarded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RFQ Responses table
CREATE TABLE IF NOT EXISTS rfq_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES users(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  delivery_time INTEGER,
  description TEXT,
  attachments TEXT[],
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers(category);
CREATE INDEX IF NOT EXISTS idx_suppliers_sustainability_score ON suppliers(sustainability_score);
CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON suppliers(verified);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_rfqs_buyer_id ON rfqs(buyer_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
CREATE INDEX IF NOT EXISTS idx_rfq_responses_rfq_id ON rfq_responses(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_responses_supplier_id ON rfq_responses(supplier_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfq_responses_updated_at BEFORE UPDATE ON rfq_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic read access for all, write access for authenticated users)
CREATE POLICY "Allow public read access on suppliers" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts for buyers, suppliers, and admins';
COMMENT ON TABLE suppliers IS 'Verified sustainable suppliers directory';
COMMENT ON TABLE products IS 'Products offered by suppliers';
COMMENT ON TABLE rfqs IS 'Request for quotations from buyers';
COMMENT ON TABLE rfq_responses IS 'Supplier responses to RFQs';
