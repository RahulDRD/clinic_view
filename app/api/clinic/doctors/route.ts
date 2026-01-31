import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET: Fetch all doctors for the clinic
export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and clinic info
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
        kindeId: kindeUser.id,
        expectedRole: 'clinic'
      });
      return NextResponse.json({ error: 'Forbidden - Clinic access only' }, { status: 403 });
    }

    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .select('clinic_id')
      .eq('uid', user.uid)
      .single();

    if (clinicError || !clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    // Fetch doctors for this clinic
    const { data: doctors, error: doctorsError } = await supabaseAdmin
      .from('doctors')
      .select(`
        *,
        user:users (
          uid, email, name, role, is_active, is_verified, profile_image_url, phone
        )
      `)
      .eq('clinic_id', clinic.clinic_id);

    if (doctorsError) {
      return NextResponse.json({ error: doctorsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, doctors: doctors || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// DELETE: Remove doctor from clinic (unassign, don't delete the doctor account)
export async function DELETE(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and clinic info
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('uid, role')
      .eq('auth_id', kindeUser.id)
      .single();

    if (userError || !user || user.role !== 'clinic') {
      return NextResponse.json({ error: 'Forbidden - Clinic access only' }, { status: 403 });
    }

    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .select('clinic_id')
      .eq('uid', user.uid)
      .single();

    if (clinicError || !clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    const { did } = await request.json();

    if (!did) {
      return NextResponse.json({ error: 'Doctor ID required' }, { status: 400 });
    }

    // Verify doctor belongs to this clinic
    const { data: doctor, error: doctorCheckError } = await supabaseAdmin
      .from('doctors')
      .select('did, clinic_id, uid')
      .eq('did', did)
      .single();

    if (doctorCheckError || !doctor || doctor.clinic_id !== clinic.clinic_id) {
      return NextResponse.json({ error: 'Doctor not found or access denied' }, { status: 403 });
    }

    // Unassign doctor from clinic (set clinic_id to null instead of deleting)
    const { error: updateError } = await supabaseAdmin
      .from('doctors')
      .update({
        clinic_id: null,
        clinic_name: null
      })
      .eq('did', did);

    if (updateError) {
      console.error('Error removing doctor from clinic:', updateError);
      return NextResponse.json({
        error: `Failed to remove doctor: ${updateError.message}`
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Doctor removed from clinic successfully'
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update doctor details
export async function PATCH(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and clinic info
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('uid, role')
      .eq('auth_id', kindeUser.id)
      .single();

    if (userError || !user || user.role !== 'clinic') {
      return NextResponse.json({ error: 'Forbidden - Clinic access only' }, { status: 403 });
    }

    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .select('clinic_id')
      .eq('uid', user.uid)
      .single();

    if (clinicError || !clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    const { did, uid, action, value, updates } = await request.json();

    // Verify doctor belongs to this clinic
    const { data: doctor, error: doctorCheckError } = await supabaseAdmin
      .from('doctors')
      .select('did, clinic_id, uid')
      .eq('did', did)
      .single();

    if (doctorCheckError || !doctor || doctor.clinic_id !== clinic.clinic_id) {
      return NextResponse.json({ error: 'Doctor not found or access denied' }, { status: 403 });
    }

    // Use uid from doctor record if not provided
    const doctorUid = uid || doctor.uid;

    // Handle toggle actions
    if (action === 'verify_doctor') {
      await supabaseAdmin
        .from('doctors')
        .update({ is_verified: value })
        .eq('did', did);
    } else if (action === 'activate_user') {
      await supabaseAdmin
        .from('users')
        .update({ is_active: value })
        .eq('uid', doctorUid);
    } else if (updates) {
      // Handle full profile updates
      const { user: userUpdates, doctor: doctorUpdates } = updates;

      if (userUpdates) {
        // Build update object dynamically
        const userUpdateData: any = {};

        if (userUpdates.name) userUpdateData.name = userUpdates.name;
        if (userUpdates.phone && userUpdates.phone.trim() !== '') {
          userUpdateData.phone = userUpdates.phone;
        }

        if (Object.keys(userUpdateData).length > 0) {
          await supabaseAdmin
            .from('users')
            .update(userUpdateData)
            .eq('uid', doctorUid);
        }
      }

      if (doctorUpdates) {
        await supabaseAdmin
          .from('doctors')
          .update(doctorUpdates)
          .eq('did', did);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
