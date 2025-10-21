import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      category,
      location,
      website,
      certifications,
      employee_count,
      contact_email,
      contact_phone,
      sustainability_score,
      carbon_footprint,
      water_usage,
      waste_recycled,
      renewable_energy
    } = body;

    // Validate required fields
    if (!name || !description || !category || !location || !contact_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for admin operations

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate sustainability score if not provided
    let finalScore = sustainability_score;
    if (!finalScore) {
      // Simple scoring algorithm based on provided metrics
      let score = 50; // Base score

      if (certifications && certifications.length > 0) score += 15;
      if (renewable_energy) score += 10;
      if (waste_recycled && waste_recycled > 50) score += 10;
      if (carbon_footprint && carbon_footprint < 100) score += 10;
      if (water_usage && water_usage < 1000) score += 5;

      finalScore = Math.min(100, Math.max(0, score));
    }

    // Insert supplier
    const { data, error } = await supabase
      .from('suppliers')
      .insert({
        name,
        description,
        category,
        location,
        website,
        certifications: certifications || [],
        employee_count: employee_count || null,
        contact_email,
        contact_phone: contact_phone || null,
        sustainability_score: finalScore,
        carbon_footprint: carbon_footprint || null,
        water_usage: water_usage || null,
        waste_recycled: waste_recycled || null,
        renewable_energy: renewable_energy || false,
        verified: false, // New suppliers need admin approval
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: 'Failed to register supplier' },
        { status: 500 }
      );
    }

    // Send notification email to admins (placeholder)
    console.log('New supplier registered:', {
      id: data.id,
      name: data.name,
      email: data.contact_email,
      score: data.sustainability_score
    });

    return NextResponse.json({
      success: true,
      supplier: data,
      message: 'Supplier registered successfully. Pending admin approval.'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}