import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from our database
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('uid, role')
      .eq('auth_id', kindeUser.id)
      .single();

    if (userError || !user || user.role !== 'clinic') {
      console.error('Access denied:', {
        userError: userError?.message,
        userFound: !!user,
        userRole: user?.role,
        kindeId: kindeUser.id
      });
      return NextResponse.json({ error: 'Forbidden - Clinic access only' }, { status: 403 });
    }

    // Fetch clinic profile
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .select('*')
      .eq('uid', user.uid)
      .single();

    if (clinicError) {
      return NextResponse.json({ error: clinicError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, clinic });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from our database
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('uid, role')
      .eq('auth_id', kindeUser.id)
      .single();

    if (userError || !user || user.role !== 'clinic') {
      return NextResponse.json({ error: 'Forbidden - Clinic access only' }, { status: 403 });
    }

    const updates = await request.json();

    // Update clinic profile
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .update(updates)
      .eq('uid', user.uid)
      .select()
      .single();

    if (clinicError) {
      return NextResponse.json({ error: clinicError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, clinic });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
