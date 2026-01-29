import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/nodemailer';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// This simple generate function is for demo; use crypto in production
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type required' }, { status: 400 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    // Store OTP in public.auth_otps (Assuming the table exists from migration 002)
    const { error: dbError } = await supabase
      .from('auth_otps')
      .insert([
        { 
          email, 
          otp_code: otp, 
          type, 
          expires_at: expiresAt 
        }
      ]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }

    // Send Email via Nodemailer
    const subject = type === 'signup' ? 'Verify your LifeMaxxing Account' : 'Reset your Password';
    const html = `
      <div style="font-family: monospace; background-color: #000; color: #78e02f; padding: 20px;">
        <h1 style="text-transform: uppercase;">LifeMaxxing OS</h1>
        <p>Your verification code is:</p>
        <h2 style="font-size: 32px; letter-spacing: 5px;">${otp}</h2>
        <p>This code expires in 10 minutes.</p>
        <hr style="border-color: #78e02f;">
        <p style="font-size: 10px;">End of transmission.</p>
      </div>
    `;

    const { success, error: mailError } = await sendEmail(email, subject, html);

    if (!success) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('OTP Handler Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
