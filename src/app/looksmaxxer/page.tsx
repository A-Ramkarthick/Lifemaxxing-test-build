"use client";

import React, { useState } from 'react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import NokiaCard from '@/components/ui/NokiaCard';
import NokiaGoals from '@/components/ui/NokiaGoals';
import { Dumbbell, ArrowLeft, Camera, Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, Loader } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useUpload } from '@/hooks/useUpload';
import { supabase } from '@/lib/supabase';

export default function LooksPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'daily' | 'gallery'>('daily');
  const [mode, setMode] = useState<'physique' | 'face'>('physique');
  const { uploadFile, uploading } = useUpload();
  const [lastUpload, setLastUpload] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Mini week calendar
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    try {
        setAnalyzing(true);
        // 1. Upload
        const result = await uploadFile(file, 'user-data', 'photos');
        if (!result) throw new Error("Upload failed");
        
        setLastUpload(result.url);

        // 2. Analyze
        const res = await fetch('/api/looksmaxxer/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileUrl: result.url, mode: mode })
        });
        
        const data = await res.json();
        setReport(data);

        // 3. Log metric
        await supabase.from('metrics').insert({
            category: mode,
            name: mode === 'face' ? 'aesthetics_rating' : 'body_fat_est',
            value: mode === 'face' ? (data.rating || 0) : (data.est_body_fat || 0),
            unit: mode === 'face' ? 'score' : 'percent',
            evidence_url: result.url,
            notes: mode === 'face' ? JSON.stringify(data.suggestions) : JSON.stringify(data.focus_areas),
            user_id: (await supabase.auth.getUser()).data.user?.id
        });

    } catch (err: any) {
        console.error(err);
        alert("Analysis failed, but photo saved.");
    } finally {
        setAnalyzing(false);
    }
  };

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
            <h1 className="text-xl font-bold uppercase tracking-wider">Aesthetics</h1>
           </div>
           <button onClick={() => setView(view === 'daily' ? 'gallery' : 'daily')} className="p-1 border border-nokia-dim"><CalendarIcon className="w-4 h-4" /></button>
        </div>

        {/* Date Selector */}
        <div className="flex justify-between items-center mb-2">
            <button onClick={() => setSelectedDate(addDays(selectedDate, -7))}><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex gap-1">
               {weekDays.map(day => (
                 <div 
                   key={day.toString()} 
                   onClick={() => setSelectedDate(day)}
                   className={cn(
                     "w-8 h-10 flex flex-col items-center justify-center border rounded-sm text-[10px] cursor-pointer",
                     isSameDay(day, selectedDate) ? "bg-nokia-primary text-nokia-bg border-nokia-primary" : "border-nokia-dim/50 text-nokia-dim"
                   )}
                 >
                    <span>{format(day, 'EEE')[0]}</span>
                    <span className="font-bold">{format(day, 'd')}</span>
                 </div>
               ))}
            </div>
            <button onClick={() => setSelectedDate(addDays(selectedDate, 7))}><ChevronRight className="w-4 h-4" /></button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b-2 border-nokia-primary mb-4">
           <button 
             onClick={() => setMode('physique')}
             className={cn("flex-1 pb-1 text-center text-xs uppercase font-bold tracking-widest transition-colors", mode === 'physique' ? "bg-nokia-primary text-nokia-bg" : "text-nokia-dim")}
           >
              Physique
           </button>
           <button 
             onClick={() => setMode('face')}
             className={cn("flex-1 pb-1 text-center text-xs uppercase font-bold tracking-widest transition-colors", mode === 'face' ? "bg-nokia-primary text-nokia-bg" : "text-nokia-dim")}
           >
              Facial
           </button>
        </div>

        {/* Daily View: Photo Log */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
           {/* Photo Slot */}
           <label className="border-2 border-dashed border-nokia-dim/50 rounded-sm relative flex flex-col items-center justify-center group cursor-pointer hover:bg-nokia-dim/10 transition-colors p-8 overflow-hidden min-h-[160px]">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading || analyzing} />
              
              {uploading || analyzing ? (
                 <div className="relative z-10 flex flex-col items-center">
                    <Loader className="w-8 h-8 text-nokia-primary animate-spin mb-2" />
                    <span className="text-xs uppercase tracking-widest font-bold">Scanning Biometrics...</span>
                 </div>
              ) : lastUpload ? (
                 <img src={lastUpload} alt="Logged Check-in" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              ) : (
                 <>
                    {mode === 'physique' ? <Camera className="w-12 h-12 text-nokia-dim mb-2 group-hover:scale-110 transition-transform" /> : <User className="w-12 h-12 text-nokia-dim mb-2 group-hover:scale-110 transition-transform" />}
                 </>
              )}
              
              {!uploading && !analyzing && <span className="text-xs uppercase tracking-widest font-bold z-10 relative">{lastUpload ? 'Update Photo' : `Log ${mode==='physique'?'Physique':'Face'}`}</span>}
              {!uploading && !analyzing && <span className="text-[10px] text-nokia-dim mt-1 z-10 relative">{format(selectedDate, 'MMM dd, yyyy')}</span>}
           </label>

           {report && (
              <NokiaCard variant="outline" className="p-3 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center mb-2 border-b border-nokia-dim/20 pb-1">
                    <span className="text-xs uppercase font-bold">AI Analysis Protocol</span>
                    <span className="text-[10px] text-nokia-dim">{mode === 'face' ? `Rating: ${report.rating}/10` : `Est. BF: ${report.est_body_fat}%`}</span>
                 </div>
                 <ul className="text-[10px] space-y-1 list-disc pl-3 text-nokia-dim/80">
                    {(mode === 'face' ? report.suggestions : report.focus_areas)?.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                    ))}
                    {report.notes && <li className="italic mt-1 text-nokia-primary/80">"{report.notes}"</li>}
                 </ul>
              </NokiaCard>
           )}

           {/* Goals */}
           <NokiaGoals initialGoals={mode === 'physique' ? ["Hit 12% Body Fat", "Bench 225lbs"] : ["Clear Skin Routine", "Mewing 30m/day"]} title={mode === 'physique' ? "Physique Targets" : "Facial Harmonization"} />

           {/* Metrics */}
           {mode === 'physique' && (
            <div className="grid grid-cols-2 gap-2 mt-2">
                <NokiaCard variant="outline" className="p-2">
                    <span className="text-[10px] text-nokia-dim uppercase">Weight</span>
                    <div className="text-xl font-bold">78.4 <span className="text-sm font-normal">kg</span></div>
                </NokiaCard>
                <NokiaCard variant="outline" className="p-2">
                    <span className="text-[10px] text-nokia-dim uppercase">Body Fat</span>
                    <div className="text-xl font-bold">14.2 <span className="text-sm font-normal">%</span></div>
                </NokiaCard>
            </div>
           )}

           <Link href="/looksmaxxer/agent" className="mt-2">
             <NokiaCard variant="filled" className="p-4 flex items-center justify-center gap-2 group hover:bg-nokia-primary hover:text-nokia-bg transition-colors cursor-pointer">
                <span className="uppercase font-bold tracking-widest animate-pulse group-hover:animate-none">{mode === 'physique' ? 'Trainer' : 'Esthetician'}</span>
             </NokiaCard>
           </Link>
        </div>
      </div>
    </NokiaLayout>
  );
}
