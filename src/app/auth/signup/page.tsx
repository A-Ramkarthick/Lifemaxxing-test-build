"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password !== confirmPassword){
        setError("Passwords do not match");
        return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Request OTP via our API (Bypassing Supabase Auto-Mail)
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'signup' }),
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Verify OTP
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type: 'signup' }),
      });

      if (!res.ok) throw new Error('Invalid code');

      // 2. Register user in Supabase
      const { error: sbError } = await supabase.auth.signUp({
        email,
        password,
        options: {
           data: { 
             email_verified: true,
             full_name: name
           }
        }
      });

      if (sbError) throw sbError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nokia-bg flex items-center justify-center p-4 font-mono text-nokia-primary">
       <div className="w-full max-w-md border-2 border-nokia-primary p-8 bg-nokia-bg relative shadow-[0_0_50px_rgba(120,224,47,0.1)]">
          <div className="absolute top-0 left-0 bg-nokia-primary text-nokia-bg px-2 py-1 text-xs font-bold uppercase">System Access</div>
          
          <h1 className="text-3xl font-bold mb-8 uppercase tracking-tighter mt-4 text-center">New Identity</h1>

          {step === 1 ? (
             <form onSubmit={handleSignUp} className="space-y-4">
                <div className="flex flex-col gap-1">
                   <label className="text-xs uppercase font-bold text-nokia-dim">Codename</label>
                   <div className="flex items-center border-b-2 border-nokia-dim focus-within:border-nokia-primary transition-colors py-1">
                      <User className="w-4 h-4 mr-2" />
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent outline-none flex-1 placeholder:text-nokia-dim/30"
                        placeholder="AGENT 47"
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <label className="text-xs uppercase font-bold text-nokia-dim">Email Channel</label>
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

                <div className="flex flex-col gap-1">
                   <label className="text-xs uppercase font-bold text-nokia-dim">Passkey</label>
                   <div className="flex items-center border-b-2 border-nokia-dim focus-within:border-nokia-primary transition-colors py-1">
                      <Lock className="w-4 h-4 mr-2" />
                      <input 
                        required
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent outline-none flex-1 placeholder:text-nokia-dim/30"
                        placeholder="••••••••"
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <label className="text-xs uppercase font-bold text-nokia-dim">Confirm Passkey</label>
                   <div className="flex items-center border-b-2 border-nokia-dim focus-within:border-nokia-primary transition-colors py-1">
                      <Lock className="w-4 h-4 mr-2" />
                      <input 
                        required
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-transparent outline-none flex-1 placeholder:text-nokia-dim/30"
                        placeholder="••••••••"
                      />
                   </div>
                </div>

                {error && <div className="text-red-500 text-xs border border-red-500 p-2">{error}</div>}

                <button 
                  disabled={loading}
                  className="w-full bg-nokia-primary text-nokia-bg font-bold uppercase py-3 hover:bg-nokia-dim hover:text-nokia-primary transition-colors disabled:opacity-50"
                  type="submit"
                >
                   {loading ? 'Processing...' : 'Initiate Registration'}
                </button>

                <p className="text-center text-xs text-nokia-dim mt-4">
                  Already an agent? <Link href="/auth/signin" className="underline hover:text-nokia-primary">Login here</Link>
                </p>
             </form>
          ) : (
             <form onSubmit={handleVerify} className="space-y-4">
                <p className="text-sm text-nokia-dim mb-4 text-center">Verify identity. Code sent to {email}.</p>
                
                <div className="flex flex-col gap-1">
                   <label className="text-xs uppercase font-bold text-nokia-dim">Verification Code</label>
                   <div className="flex items-center border-b-2 border-nokia-dim focus-within:border-nokia-primary transition-colors py-1">
                      <input 
                        required
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="bg-transparent outline-none flex-1 placeholder:text-nokia-dim/30 text-center text-2xl tracking-[0.5em]"
                        placeholder="000000"
                        maxLength={6}
                      />
                   </div>
                </div>

                {error && <div className="text-red-500 text-xs border border-red-500 p-2">{error}</div>}

                <button 
                  disabled={loading}
                  className="w-full bg-nokia-primary text-nokia-bg font-bold uppercase py-3 hover:bg-nokia-dim hover:text-nokia-primary transition-colors disabled:opacity-50"
                  type="submit"
                >
                   {loading ? 'Verifying...' : 'Establish Connection'}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-xs text-nokia-dim uppercase hover:text-nokia-primary mt-2"
                >
                   Abort / Back
                </button>
             </form>
          )}

       </div>
    </div>
  );
}
