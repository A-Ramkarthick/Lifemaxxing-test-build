"use client";

import React, { useState } from 'react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import NokiaCard from '@/components/ui/NokiaCard';
import NokiaGoals from '@/components/ui/NokiaGoals';
import { BookOpen, Upload, Video, LineChart, Plus, ArrowLeft, Loader, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUpload } from '@/hooks/useUpload';
import { supabase } from '@/lib/supabase';

export default function StudyMaxxerPage() {
  const { uploadFile, uploading } = useUpload();
  const [analysis, setAnalysis] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    try {
        setProcessing(true);
        // 1. Upload
        const result = await uploadFile(file, 'user-data', 'documents');
        if (!result) throw new Error("Upload failed");

        // 2. Parse
        const response = await fetch('/api/studymaxxer/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileUrl: result.url })
        });

        if (!response.ok) throw new Error("Analysis failed");
        const data = await response.json();
        setAnalysis(data);

        // 3. Save Summary
        await supabase.from('documents').insert({
            name: file.name,
            type: 'study_material',
            url: result.url,
            agent_access: ['studymaxxer'],
            summary: data.summary,
            user_id: (await supabase.auth.getUser()).data.user?.id
        });

    } catch (err) {
        console.error(err);
        alert("Failed to analyze doc.");
    } finally {
        setProcessing(false);
    }
  };

  return (
    <NokiaLayout>
      <div className="flex flex-col h-full space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b-2 border-nokia-dim/30 pb-2 mb-2">
          <Link href="/dashboard">
             <button className="p-1 hover:bg-nokia-dim/20 rounded-sm">
               <ArrowLeft className="w-5 h-5" />
             </button>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-wider">StudyMaxxer</h1>
        </div>

        {/* Upload Area */}
        <label className="border-2 border-dashed border-nokia-dim p-4 flex flex-col items-center justify-center gap-2 hover:bg-nokia-dim/5 cursor-pointer transition-colors rounded-sm group relative">
            <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={uploading || processing} />
            
            {uploading || processing ? (
               <Loader className="w-8 h-8 text-nokia-primary animate-spin" />
            ) : (
               <Upload className="w-8 h-8 text-nokia-dim group-hover:text-nokia-primary transition-colors" />
            )}
            
            <span className="text-xs uppercase tracking-widest font-bold">{processing ? 'Extracting Knowledge...' : 'Upload PDF Materials'}</span>
            <span className="text-[10px] text-nokia-dim">{processing ? 'Neural Parsing Active' : 'Supported: PDF'}</span>
        </label>

        {/* Analysis Results */}
        {analysis && (
            <div className="flex-1 overflow-y-auto space-y-4">
                <NokiaCard variant="screen" className="p-3">
                    <div className="text-[10px] uppercase text-nokia-dim mb-1">Executive Summary</div>
                    <p className="text-sm leading-snug">{analysis.summary}</p>
                </NokiaCard>

                <div className="space-y-2">
                    <span className="text-xs uppercase tracking-widest text-nokia-dim">Flashcards Generated</span>
                    {analysis.flashcards.map((card: any, i: number) => (
                        <div key={i} className="border border-nokia-dim/20 p-2 rounded-sm bg-nokia-dim/5">
                            <div className="text-xs font-bold text-nokia-primary mb-1">Q: {card.front}</div>
                            <div className="text-xs text-nokia-dim">A: {card.back}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {!analysis && (
            <div className="flex-1 overflow-y-auto">
               <NokiaGoals initialGoals={["Finish Chapter 3: Algebra", "Revise History Notes"]} />
            </div>
        )}

        {/* Connect Action */}
        <Link href="/studymaxxer/agent">
           <NokiaCard variant="filled" className="p-4 flex items-center justify-center gap-2 group hover:bg-nokia-primary hover:text-nokia-bg transition-colors cursor-pointer">
              <span className="uppercase font-bold tracking-widest animate-pulse group-hover:animate-none">Launch Study Buddy</span>
           </NokiaCard>
        </Link>
      </div>
    </NokiaLayout>
  );
}
