import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Sync Kinde user to our database
 * This endpoint is called after Kinde authentication to ensure
 * the user exists in our database with the correct role
 */
export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already exists in our database by auth_id
    const { data: existingUserByAuthId } = await supabaseAdmin
      .from('users')
      .select('uid, email, role')
      .eq('auth_id', kindeUser.id)
      .maybeSingle();

    if (existingUserByAuthId) {
      // User already synced with this auth_id
      // Update role to 'clinic' since they're logging in through clinic_view
      if (existingUserByAuthId.role !== 'clinic') {
        const { data: updatedUser, error: updateError } = await supabaseAdmin
          .from('users')
          .update({ role: 'clinic' })
          .eq('uid', existingUserByAuthId.uid)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user role:', updateError);
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // Create clinic profile if it doesn't exist
        const { data: existingClinic } = await supabaseAdmin
          .from('clinics')
          .select('clinic_id')
          .eq('uid', updatedUser.uid)
          .maybeSingle();

        if (!existingClinic) {
          await supabaseAdmin
            .from('clinics')
            .insert({
              uid: updatedUser.uid,
              clinic_name: `${updatedUser.name}'s Clinic`,
              city: 'Not specified',
              is_verified: false
            });
        }

        return NextResponse.json({
          success: true,
          user: updatedUser,
          message: 'User role updated to clinic'
        });
      }

      return NextResponse.json({
        success: true,
        user: existingUserByAuthId,
        message: 'User already synced'
      });
    }

    // Check if user exists by email (created by clinic/admin but not yet linked to Kinde)
    const { data: existingUserByEmail } = await supabaseAdmin
      .from('users')
      .select('uid, email, name, role, auth_id')
      .eq('email', kindeUser.email)
      .maybeSingle();

    if (existingUserByEmail) {
      // User exists with this email - link the Kinde auth_id
      if (existingUserByEmail.auth_id) {
        // Auth_id already set to different value - potential conflict
        console.warn('User exists with different auth_id:', existingUserByEmail);
        return NextResponse.json({
          error: 'This email is already linked to another authentication account'
        }, { status: 409 });
      }

      // Link the Kinde auth_id to existing user
      const { data: linkedUser, error: linkError } = await supabaseAdmin
        .from('users')
        .update({
          auth_id: kindeUser.id,
          name: existingUserByEmail.role === 'clinic'
            ? existingUserByEmail.name || `${kindeUser.given_name || ''} ${kindeUser.family_name || ''}`.trim()
            : existingUserByEmail.name // Don't overwrite doctor/patient names
        })
        .eq('uid', existingUserByEmail.uid)
        .select()
        .single();

      if (linkError) {
        console.error('Error linking auth_id:', linkError);
        return NextResponse.json({ error: linkError.message }, { status: 500 });
      }

      // If user is clinic role and no clinic profile exists, create it
      if (linkedUser.role === 'clinic') {
        const { data: existingClinic } = await supabaseAdmin
          .from('clinics')
          .select('clinic_id')
          .eq('uid', linkedUser.uid)
          .maybeSingle();

        if (!existingClinic) {
          await supabaseAdmin
            .from('clinics')
            .insert({
              uid: linkedUser.uid,
              clinic_name: `${linkedUser.name}'s Clinic`,
              city: 'Not specified',
              is_verified: false
            });
        }
      }

      return NextResponse.json({
        success: true,
        user: linkedUser,
        message: 'User account linked successfully'
      });
    }

    // No existing user - create new user with clinic role (default for clinic_view app)
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        auth_id: kindeUser.id,
        email: kindeUser.email || '',
        name: `${kindeUser.given_name || ''} ${kindeUser.family_name || ''}`.trim() || kindeUser.email || 'Clinic User',
        role: 'clinic',
        is_active: true,
        is_verified: false
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    // Create clinic profile for the user
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .insert({
        uid: newUser.uid,
        clinic_name: `${newUser.name}'s Clinic`,
        city: 'Not specified',
        is_verified: false
      })
      .select()
      .single();

    if (clinicError) {
      console.error('Error creating clinic:', clinicError);
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      clinic: clinic || null,
      message: 'User and clinic created successfully'
    });

  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
