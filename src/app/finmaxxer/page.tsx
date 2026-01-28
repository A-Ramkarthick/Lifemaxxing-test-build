"use client";

import React, { useEffect, useState } from 'react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import NokiaCard from '@/components/ui/NokiaCard';
import NokiaGoals from '@/components/ui/NokiaGoals';
import { DollarSign, TrendingUp, ArrowLeft, Upload, Loader } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useUpload } from '@/hooks/useUpload';
import { cn } from '@/lib/utils';

export default function FinancePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { uploadFile, uploading } = useUpload();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    // Fetch real data from 'transactions' table
    const { data: txs, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false }); // Fetch all for calc, mock limit removal or better pagination later
    
    if (txs) setData(txs);
    setLoading(false);
  };

  const totalExpense = data.reduce((acc, curr) => curr.amount < 0 ? acc + Number(curr.amount) : acc, 0);
  const totalIncome = data.reduce((acc, curr) => curr.amount > 0 ? acc + Number(curr.amount) : acc, 0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    try {
      // 1. Upload to Supabase Storage
      // bucket 'user-data' must exist and be public
      const uploadResult = await uploadFile(file, 'user-data', 'receipts'); 
      if (!uploadResult) throw new Error("Upload failed");
      
      // 2. AI Analysis via API
      const response = await fetch('/api/finmaxxer/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: uploadResult.url })
      });

      if (!response.ok) throw new Error("Analysis failed");
      const analysis = await response.json();

      // 3. Insert Real Parsed Data
      const { error: dbError } = await supabase.from('transactions').insert({
          description: analysis.description || `Receipt: ${file.name}`,
          amount: analysis.amount || 0,
          type: analysis.type || 'expense',
          category: analysis.category || 'Other',
          date: analysis.date || new Date().toISOString(),
          receipt_url: uploadResult.url,
          user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (dbError) throw dbError;
      
      // 4. Refresh
      fetchTransactions();

    } catch (err) {
      console.error("Pipeline Error:", err);
      alert("Failed to process receipt. Check console.");
    }
  };

  return (
    <NokiaLayout>
      <div className="flex flex-col h-full space-y-4 pt-2">
        {/* Header */}
        <div className="flex items-center gap-2 border-b-2 border-nokia-dim/30 pb-2 mb-2">
          <Link href="/dashboard">
            <button className="p-1 hover:bg-nokia-dim/20 rounded-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-wider">Net Worth</h1>
        </div>

        {/* Scanner / Upload */}
        <label className="border-2 border-nokia-dim border-dashed p-4 flex flex-col items-center justify-center gap-2 bg-nokia-dim/5 cursor-pointer hover:bg-nokia-dim/10 transition-colors rounded-sm relative">
           <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} disabled={uploading} />
           {uploading ? <Loader className="w-6 h-6 animate-spin text-nokia-primary" /> : <DollarSign className="w-6 h-6 mb-1 text-nokia-primary" />}
           <span className="text-xs font-bold uppercase tracking-widest">{uploading ? 'Analyzing...' : 'Scan Receipt / Invoice'}</span>
           <span className="text-[10px] text-nokia-dim">{uploading ? 'Neural Net Active' : 'Tap to Upload'}</span>
        </label>

        {/* Main Display */}
        <div className="grid grid-cols-2 gap-2">
            <NokiaCard variant="screen" className="p-2 flex flex-col items-center justify-center py-4">
              <span className="text-[10px] uppercase tracking-widest text-nokia-dim mb-1">Net Flow</span>
              <div className={cn("text-xl font-bold tracking-tighter flex items-start", (totalIncome + totalExpense) >= 0 ? "text-nokia-primary" : "text-nokia-dim")}>
                  <span className="text-sm mt-1">$</span>
                  <span>{(totalIncome + totalExpense).toFixed(2)}</span>
              </div>
            </NokiaCard>
            <NokiaCard variant="screen" className="p-2 flex flex-col items-center justify-center py-4">
              <span className="text-[10px] uppercase tracking-widest text-nokia-dim mb-1">Burn Rate</span>
              <div className="text-xl font-bold tracking-tighter text-red-400">
                  ${Math.abs(totalExpense).toFixed(2)}
              </div>
            </NokiaCard>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-2 mt-2 flex-1 overflow-y-auto">
           <span className="text-xs uppercase tracking-widest text-nokia-dim">Recent Transactions</span>
           {loading && <div className="text-xs text-nokia-dim animate-pulse">Fetching Data...</div>}
           {!loading && data.length === 0 && <div className="text-xs text-nokia-dim">No digital trail found.</div>}
           
           {data.map((item, i) => (
             <div key={i} className="flex justify-between items-center p-2 border-b border-nokia-dim/20 font-mono text-sm">
                <span className="truncate max-w-[120px]">{item.description}</span>
                <span className={item.type === 'income' ? 'text-nokia-primary' : 'text-nokia-dim'}>
                  {item.type === 'income' ? '+' : ''}{item.amount}
                </span>
             </div>
           ))}

           <NokiaGoals initialGoals={["Save $500 for Emergency Fund", "Limit Eating Out"]} />

           {/* Agent Connect Button */}
           <Link href="/finmaxxer/agent" className="mt-4">
             <NokiaCard variant="filled" className="p-4 flex items-center justify-center gap-2 group hover:bg-nokia-primary hover:text-nokia-bg transition-colors cursor-pointer">
                <span className="uppercase font-bold tracking-widest animate-pulse group-hover:animate-none">Connect to Agent</span>
             </NokiaCard>
           </Link>
        </div>
      </div>
    </NokiaLayout>
  );
}
