"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
          
          <h1 className="text-3xl font-bold mb-8 uppercase tracking-tighter mt-4 text-center">Login</h1>

          <form onSubmit={handleSignIn} className="space-y-4">
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

            {error && <div className="text-red-500 text-xs border border-red-500 p-2">{error}</div>}

            <div className="flex justify-end">
               <Link href="/auth/forgot-password" className="text-[10px] uppercase underline text-nokia-dim hover:text-nokia-primary">Forgot Passkey?</Link>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-nokia-primary text-nokia-bg font-bold uppercase py-3 hover:bg-nokia-dim hover:text-nokia-primary transition-colors disabled:opacity-50"
            >
                {loading ? 'Authenticating...' : 'Enter System'}
            </button>

            <p className="text-center text-xs text-nokia-dim mt-4">
              New recruit? <a href="/auth/signup" className="underline hover:text-nokia-primary">Initialize here</a>
            </p>
          </form>
       </div>
    </div>
  );
}
