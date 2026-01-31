import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ did: string }> }) {
  try {
    const { did } = await params;

    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .select(`
        *,
        user:users(*),
        doctor_availability(*)
      `)
      .eq('did', did)
      .single();

    if (error) throw error;

    // Fetch stats
    const { count: patientsCount } = await supabaseAdmin
        .from('doctor_patient_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('did', did);

    const { count: appointmentsCount } = await supabaseAdmin
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('did', did);

    return NextResponse.json({ 
        success: true, 
        doctor,
        stats: {
            patients: patientsCount || 0,
            appointments: appointmentsCount || 0
        } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
