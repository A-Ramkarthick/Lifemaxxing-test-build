"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use our custom Nodemailer API instead of Supabase's built-in reset
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'recovery' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Verify OTP
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type: 'recovery' }),
      });

      if (!res.ok) throw new Error('Invalid code');

      // 2. Update Password (This requires a session or admin key usually)
      // Since we can't use updateUser without being logged in, we need a trick.
      // Standard Supabase doesn't let you set password by email without admin key.
      // WE MUST USE Supabase's resetPasswordForEmail for the ACTUAL mechanic,
      // but the user wants Nodemailer.
      // Workaround: We can't strictly modify the password here without Admin API.
      // So detailed implementation:
      // Realistically, we'd need to use the Admin Client in a Next.js API route to update the user.
      
      const adminRes = await fetch('/api/auth/admin-reset', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, newPassword }),
      });
      
      if (!adminRes.ok) throw new Error("Correction: System requires Admin Privileges for password override. (Missing Service Key in Env)");

      // If successful
      router.push('/auth/signin');

    } catch (err: any) {
      setError(err.message + " (Note: For this demo, password reset without magic link requires Admin Key)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nokia-bg flex items-center justify-center p-4 font-mono text-nokia-primary">
       <div className="w-full max-w-md border-2 border-nokia-primary p-8 bg-nokia-bg relative shadow-[0_0_50px_rgba(120,224,47,0.1)]">
          <Link href="/auth/signin" className="absolute top-4 right-4 text-nokia-dim hover:text-nokia-primary"><ArrowLeft className="w-5 h-5"/></Link>
          <div className="absolute top-0 left-0 bg-nokia-primary text-nokia-bg px-2 py-1 text-xs font-bold uppercase">System Recovery</div>
          
          <h1 className="text-3xl font-bold mb-8 uppercase tracking-tighter mt-4 text-center">Reset Passkey</h1>

          {step === 1 ? (
             <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-sm text-nokia-dim text-center">Enter your registered communication channel.</p>
                <div className="flex flex-col gap-1">
                   <label className="text-xs uppercase font-bold text-nokia-dim">Email Address</label>
                   <div className="flex items-center border-b-2 border-nokia-dim focus-within:border-nokia-primary transition-colors py-1">
                      <Mail className="w-4 h-4 mr-2" />
                      <input 
                        required
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent outline-none flex-1 placeholder:text-nokia-dim/30"
                        placeholder="agent@lifemaxxing.com"
                      />
                   </div>
                </div>

                {error && <div className="text-red-500 text-xs border border-red-500 p-2">{error}</div>}

                <button 
                  disabled={loading}
                  className="w-full bg-nokia-primary text-nokia-bg font-bold uppercase py-3 hover:bg-nokia-dim hover:text-nokia-primary transition-colors disabled:opacity-50"
                >
                   {loading ? 'Transmitting...' : 'Send Recovery Code'}
                </button>
             </form>
          ) : (
             <form onSubmit={handleVerifyAndReset} className="space-y-4">
                <div className="flex flex-col gap-1">
                   <label className="text-xs uppercase font-bold text-nokia-dim">Recovery Code</label>
                   <input 
                      required
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="bg-nokia-dim/10 border-b-2 border-nokia-dim p-2 text-center text-xl tracking-[0.5em] outline-none"
                      maxLength={6}
                   />
                </div>

                <div className="flex flex-col gap-1">
                   <label className="text-xs uppercase font-bold text-nokia-dim">New Passkey</label>
                   <input 
                      required
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-transparent border-b-2 border-nokia-dim p-1 outline-none"
                   />
                </div>

                {error && <div className="text-red-500 text-xs border border-red-500 p-2">{error}</div>}

                <button 
                  disabled={loading}
                  className="w-full bg-nokia-primary text-nokia-bg font-bold uppercase py-3 hover:bg-nokia-dim hover:text-nokia-primary transition-colors disabled:opacity-50"
                >
                   {loading ? 'Overwriting...' : 'Reset Access'}
                </button>
             </form>
          )}
       </div>
    </div>
  );
}
