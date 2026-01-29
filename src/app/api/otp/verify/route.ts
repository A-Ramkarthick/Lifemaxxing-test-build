import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, otp, type } = await req.json();

    if (!email || !otp || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify OTP from DB
    const { data, error } = await supabase
      .from('auth_otps')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .eq('type', type)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Mark OTP as used
    await supabase
      .from('auth_otps')
      .update({ used: true })
      .eq('id', data.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
