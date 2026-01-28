"use client";

import React, { useState, useEffect, useRef } from 'react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import NokiaCard from '@/components/ui/NokiaCard';
import NokiaGoals from '@/components/ui/NokiaGoals';
import { ArrowLeft, UserPlus, Loader, Upload, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { useUpload } from '@/hooks/useUpload';

export default function RizzPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const { uploadFile, uploading } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('score', { ascending: false });
    
    if (data) setContacts(data);
    setLoading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    try {
      setAnalyzing(true);
      // 1. Upload
      const uploadResult = await uploadFile(file, 'user-data', 'chats'); // bucket, folder
      if (!uploadResult) throw new Error("Upload failed");

      // 2. Parse with AI
      const response = await fetch('/api/rizzmaxxer/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: uploadResult.url })
      });
      
      if (!response.ok) throw new Error("Analysis failed");
      const analysis = await response.json();

      // 3. Normalize Status
      // Map API status to one of our frontend expected values if possible, or keep as is
      // Frontend expects: talking, roster, cold mostly.
      let normalizedStatus = (analysis.status || 'talking').toLowerCase();
      if (normalizedStatus.includes('talking')) normalizedStatus = 'talking';
      else if (normalizedStatus.includes('roster')) normalizedStatus = 'roster';
      else if (normalizedStatus.includes('cold')) normalizedStatus = 'cold';
      else if (normalizedStatus.includes('friend')) normalizedStatus = 'friendzone';
      
      // 4. Save to DB
      const user = (await supabase.auth.getUser()).data.user;
      
      const { error: insertError } = await supabase.from('contacts').insert({
        user_id: user?.id,
        name: analysis.name || "Unknown",
        status: normalizedStatus,
        score: analysis.score || 50,
        notes: analysis.notes,
        last_msg: analysis.last_msg_time || new Date().toISOString(),
        photo_url: uploadResult.url // Use the screenshot as the contact photo for now? Or leave null? 
        // Using chat screenshot as contact photo is kinda funny/nokia style. Let's do it.
      });

      if (insertError) throw insertError;
      
      // 5. Refresh
      fetchContacts();
      
    } catch (error) {
      console.error("Error processing chat:", error);
      alert("Failed to analyze chat screenshot.");
    } finally {
      setAnalyzing(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isBusy = uploading || analyzing;

  return (
    <NokiaLayout>
      <div className="flex flex-col h-full space-y-4 pt-2">
        <div className="flex items-center justify-between border-b-2 border-nokia-dim/30 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <button className="p-1 hover:bg-nokia-dim/20 rounded-sm">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <h1 className="text-xl font-bold uppercase tracking-wider">Social CRM</h1>
          </div>
          <div className="flex gap-2">
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
             <button 
                onClick={handleUploadClick} 
                disabled={isBusy}
                className="p-1 border border-nokia-primary bg-nokia-primary text-nokia-bg rounded-sm flex items-center gap-1 disabled:opacity-50"
             >
                {isBusy ? <Loader className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span className="text-xs uppercase font-bold hidden sm:inline">Add Chat</span>
             </button>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="flex gap-2 text-[10px] uppercase font-bold text-nokia-dim mb-2 overflow-x-auto pb-2">
           <div className="px-2 py-1 border border-nokia-dim rounded-sm whitespace-nowrap">Talking ({contacts.filter(c => c.status === 'talking').length})</div>
           <div className="px-2 py-1 border border-nokia-dim rounded-sm whitespace-nowrap">Roster ({contacts.filter(c => c.status === 'roster').length})</div>
           <div className="px-2 py-1 border border-nokia-dim rounded-sm whitespace-nowrap">Cold ({contacts.filter(c => c.status === 'cold').length})</div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto space-y-2">
           {loading && <div className="p-4 flex justify-center"><Loader className="animate-spin text-nokia-dim" /></div>}
           {!loading && contacts.length === 0 && (
              <div className="text-center text-xs text-nokia-dim p-4">
                 No active leads. Tap + to add.
              </div>
           )}
           {contacts.map(c => (
              <NokiaCard key={c.id} variant="outline" className="p-3 flex items-center justify-between hover:bg-nokia-dim/10 cursor-pointer">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-nokia-dim/20 rounded-full flex items-center justify-center border border-nokia-dim overflow-hidden">
                       {c.photo_url ? <img src={c.photo_url} alt={c.name} className="w-full h-full object-cover"/> : <span className="font-bold">{c.name[0]}</span>}
                    </div>
                    <div>
                       <div className="font-bold uppercase tracking-wide">{c.name}</div>
                       <div className="text-[10px] text-nokia-dim uppercase">{c.status} • {c.last_msg ? formatDistanceToNow(new Date(c.last_msg), { addSuffix: true }) : 'No msgs'}</div>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <div className="text-lg font-bold">{c.score}%</div>
                    <div className="w-12 h-1 bg-nokia-dim/30 rounded-full overflow-hidden">
                       <div className="h-full bg-nokia-primary" style={{ width: `${c.score}%`}} />
                    </div>
                 </div>
              </NokiaCard>
           ))}
        </div>

        <NokiaGoals title="Social Targets" initialGoals={["Text Mom", "Reply to Sarah"]} />

        <Link href="/rizzmaxxer/agent" className="mt-2">
           <NokiaCard variant="filled" className="p-4 flex items-center justify-center gap-2 group hover:bg-nokia-primary hover:text-nokia-bg transition-colors cursor-pointer">
              <span className="uppercase font-bold tracking-widest animate-pulse group-hover:animate-none">Launch Coach</span>
           </NokiaCard>
        </Link>
      </div>
    </NokiaLayout>
  );
}
