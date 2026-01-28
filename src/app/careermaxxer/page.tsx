"use client";

import React, { useState } from 'react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import NokiaCard from '@/components/ui/NokiaCard';
import NokiaGoals from '@/components/ui/NokiaGoals';
import { Briefcase, TrendingUp, ArrowLeft, Upload, FileText, Loader } from 'lucide-react';
import Link from 'next/link';
import { useUpload } from '@/hooks/useUpload';
import { supabase } from '@/lib/supabase';

export default function CareerPage() {
  const { uploadFile, uploading } = useUpload();
  const [analysis, setAnalysis] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    try {
        setProcessing(true);
        // 1. Upload
        const result = await uploadFile(file, 'user-data', 'resumes');
        if (!result) throw new Error("Upload failed");

        // 2. Parse
        const response = await fetch('/api/careermaxxer/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileUrl: result.url })
        });

        if (!response.ok) throw new Error("Analysis failed");
        const data = await response.json();
        setAnalysis(data);

        // 3. Save Record
        await supabase.from('documents').insert({
            name: file.name,
            type: 'resume',
            url: result.url,
            agent_access: ['careermaxxer'],
            analysis_data: data, // Using JSONB column if exists (added in update below) or just summary
            summary: data.summary,
            user_id: (await supabase.auth.getUser()).data.user?.id
        });

    } catch (err) {
        console.error(err);
        alert("Failed to analyze resume.");
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
          <h1 className="text-xl font-bold uppercase tracking-wider">Career Arc</h1>
        </div>

        {/* Upload Resume */}
        <label className="border-2 border-nokia-dim border-dashed p-4 flex flex-col items-center justify-center gap-2 bg-nokia-dim/5 cursor-pointer hover:bg-nokia-dim/10 transition-colors rounded-sm group relative">
           <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploading || processing} />
           
           {uploading || processing ? (
             <Loader className="w-6 h-6 text-nokia-primary animate-spin" />
           ) : (
             <Upload className="w-6 h-6 mb-1 text-nokia-primary group-hover:scale-110 transition-transform" />
           )}
           
           <span className="text-xs font-bold uppercase tracking-widest">{processing ? 'Analyzing Career...' : 'Update Resume (PDF)'}</span>
           <span className="text-[10px] text-nokia-dim">{analysis ? 'Reviewing Gap Analysis' : 'Last update: None'}</span>
        </label>

        {/* Analysis Dashboard */}
        <div className="flex-1 overflow-y-auto space-y-2 mt-2">
           <span className="text-xs uppercase tracking-widest text-nokia-dim">Detected Skills</span>
           <div className="flex flex-wrap gap-2 mb-4">
              {(analysis?.skills || ['React', 'Next.js', 'TypeScript']).map((s: string) => (
                 <span key={s} className="px-2 py-1 border border-nokia-primary text-[10px] font-bold uppercase bg-nokia-primary/10">{s}</span>
              ))}
           </div>

           <span className="text-xs uppercase tracking-widest text-nokia-dim">Experience Gap (Target: Senior)</span>
           <NokiaCard variant="screen" className="p-3">
              {analysis?.missing_skills && analysis.missing_skills.length > 0 ? (
                 <p className="text-sm leading-tight mb-2">Missing <span className="font-bold underline text-red-400">{analysis.missing_skills[0]}</span> for level up.</p>
              ) : (
                 <p className="text-sm leading-tight mb-2">Upload resume to detect skill gaps.</p>
              )}
              
              <div className="w-full bg-nokia-dim/30 h-1 rounded-full overflow-hidden mt-2">
                 <div className="bg-nokia-primary h-full transition-all duration-1000" style={{ width: `${analysis?.score || 30}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-nokia-dim mt-1">
                 <span className={analysis?.seniority_level === 'Junior' ? 'text-nokia-primary font-bold' : ''}>Junior</span>
                 <span className={analysis?.seniority_level === 'Mid-Level' ? 'text-nokia-primary font-bold' : ''}>Mid-Level</span>
                 <span className={analysis?.seniority_level === 'Senior' ? 'text-nokia-primary font-bold' : ''}>Senior</span>
              </div>
              <div className="text-right text-[10px] font-bold mt-1">Score: {analysis?.score || 0}/100</div>
           </NokiaCard>
           
           <NokiaGoals title="Career Milestones" initialGoals={["Update LinkedIn", "Apply to 5 jobs"]} />
        </div>

        <Link href="/careermaxxer/agent" className="mt-4">
             <NokiaCard variant="filled" className="p-4 flex items-center justify-center gap-2 group hover:bg-nokia-primary hover:text-nokia-bg transition-colors cursor-pointer">
                <span className="uppercase font-bold tracking-widest animate-pulse group-hover:animate-none">Career Coach</span>
             </NokiaCard>
        </Link>
      </div>
    </NokiaLayout>
  );
}
