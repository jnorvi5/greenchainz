#!/usr/bin/env node

/**
 * Demo Data Seed Script for GreenChainz
 * 
 * This script seeds the Supabase database with demo suppliers and products.
 * 
 * Requirements:
 * - NEXT_PUBLIC_SUPABASE_URL environment variable
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable
 * 
 * Usage:
 *   npm run seed:demo
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loadJsonFile(filename) {
  const filePath = join(__dirname, '..', 'supabase', 'demo-data', filename);
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error.message);
    throw error;
  }
}

async function seedSuppliers() {
  console.log('\n📦 Loading suppliers data...');
  const suppliers = await loadJsonFile('suppliers.json');
  console.log(`   Found ${suppliers.length} suppliers to seed`);

  console.log('🌱 Inserting suppliers into database...');
  const { data, error } = await supabase
    .from('suppliers')
    .insert(suppliers)
    .select();

  if (error) {
    console.error('❌ Error inserting suppliers:', error.message);
    throw error;
  }

  console.log(`✅ Successfully inserted ${data.length} suppliers`);
  return data;
}

async function seedProducts(suppliers) {
  console.log('\n📦 Loading products data...');
  const productsTemplate = await loadJsonFile('products.json');
  console.log(`   Found ${productsTemplate.length} product templates`);

  // Assign products to random suppliers
  const products = productsTemplate.map((product, index) => {
    const supplierIndex = index % suppliers.length;
    return {
      ...product,
      supplier_id: suppliers[supplierIndex].id,
      is_active: true,
    };
  });

  console.log('🌱 Inserting products into database...');
  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select();

  if (error) {
    console.error('❌ Error inserting products:', error.message);
    throw error;
  }

  console.log(`✅ Successfully inserted ${data.length} products`);
  return data;
}

async function main() {
  console.log('🚀 GreenChainz Demo Data Seeder');
  console.log('================================');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);

  try {
    // Test connection
    console.log('\n🔌 Testing database connection...');
    const { error: connectionError } = await supabase
      .from('suppliers')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError.message);
      console.error('\nPlease ensure:');
      console.error('1. Your Supabase project is running');
      console.error('2. You have run the migrations (001_init.sql)');
      console.error('3. Your environment variables are correct');
      process.exit(1);
    }
    console.log('✅ Database connection successful');

    // Clear existing demo data (optional - comment out if you want to keep existing data)
    console.log('\n🧹 Clearing existing demo data...');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('suppliers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleared existing data');

    // Seed data
    const suppliers = await seedSuppliers();
    const products = await seedProducts(suppliers);

    console.log('\n✨ Demo data seeding complete!');
    console.log('================================');
    console.log(`📊 Summary:`);
    console.log(`   - Suppliers: ${suppliers.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log('\n🎉 You can now explore the demo data in your application!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

main();
