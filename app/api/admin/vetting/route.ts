import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { VettingAction } from '@/types/vetting';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { supplier_id, action, actor, notes, checklist } = body;

    // Validate required fields
    if (!supplier_id || !action || !actor) {
      return NextResponse.json(
        { error: 'Missing required fields: supplier_id, action, and actor are required' },
        { status: 400 }
      );
    }

    // Validate action
    const validActions: VettingAction[] = ['approve', 'reject', 'request_docs', 'verify_cert'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be one of: approve, reject, request_docs, verify_cert' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine update data based on action
    let updateData: any = {};
    const now = new Date().toISOString();

    switch (action) {
      case 'approve':
        updateData = {
          verified: true,
          vetting_status: 'verified',
          verification_date: now,
          last_verified_at: now,
        };
        break;
      case 'reject':
        updateData = {
          verified: false,
          vetting_status: 'rejected',
        };
        break;
      case 'request_docs':
        updateData = {
          vetting_status: 'needs_info',
        };
        if (notes) {
          updateData.vetting_notes = notes;
        }
        break;
      case 'verify_cert':
        updateData = {
          last_verified_at: now,
        };
        // Optionally update specific compliance flags based on checklist
        if (checklist) {
          updateData.compliance_flags = checklist;
        }
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update supplier record
    const { data: supplier, error: updateError } = await supabase
      .from('suppliers')
      .update(updateData)
      .eq('id', supplier_id)
      .select()
      .single();

    if (updateError) {
      console.error('Supplier update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update supplier: ' + updateError.message },
        { status: 500 }
      );
    }

    // Create audit trail record in vetting_reviews
    const { error: reviewError } = await supabase
      .from('vetting_reviews')
      .insert({
        supplier_id,
        action,
        actor,
        checklist: checklist || null,
        notes: notes || null,
      });

    if (reviewError) {
      console.error('Vetting review insert error:', reviewError);
      // Continue anyway - the supplier update was successful
    }

    return NextResponse.json({
      success: true,
      supplier,
      message: `Supplier ${action} completed successfully`,
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve vetting reviews for a supplier
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supplier_id = searchParams.get('supplier_id');

    if (!supplier_id) {
      return NextResponse.json(
        { error: 'supplier_id query parameter is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get vetting reviews for the supplier
    const { data: reviews, error } = await supabase
      .from('vetting_reviews')
      .select('*')
      .eq('supplier_id', supplier_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Vetting reviews fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vetting reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reviews: reviews || [] });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
