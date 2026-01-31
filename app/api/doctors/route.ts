import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    // Admin view: show all doctors
    // Clinic view: filtered by clinic_id (handled by /api/clinic/doctors)
    // This endpoint now primarily serves admin users

    if (kindeUser) {
      // Check user role
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('uid, role')
        .eq('auth_id', kindeUser.id)
        .single();

      // If clinic user, redirect to clinic-specific endpoint
      if (user && user.role === 'clinic') {
        return NextResponse.json({ 
          error: 'Clinic users should use /api/clinic/doctors endpoint',
          redirect: '/api/clinic/doctors'
        }, { status: 400 });
      }
    }

    // Fetch all doctors with their user profile
    const { data: doctors, error } = await supabaseAdmin
      .from('doctors')
      .select(`
        *,
        user:users(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
        console.error('Database Error:', error);
        throw error;
    }

    return NextResponse.json({ success: true, doctors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { did, uid, action, value } = await request.json();

    if (!action) {
        return NextResponse.json({ error: 'Action required' }, { status: 400 });
    }

    // Verify admin or clinic ownership
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (kindeUser) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('uid, role')
        .eq('auth_id', kindeUser.id)
        .single();

      if (user && user.role === 'clinic') {
        // Clinic should use /api/clinic/doctors endpoint
        return NextResponse.json({ 
          error: 'Clinic users should use /api/clinic/doctors endpoint' 
        }, { status: 403 });
      }
    }

    if (action === 'verify_doctor') {
      const { error } = await supabaseAdmin
        .from('doctors')
        .update({ is_verified: value })
        .eq('did', did);
      if (error) throw error;
    } 
    else if (action === 'activate_user') {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ is_active: value })
        .eq('uid', uid);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
