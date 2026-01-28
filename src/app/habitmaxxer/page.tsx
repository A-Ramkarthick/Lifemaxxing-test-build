"use client";

import React, { useState } from 'react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import NokiaCard from '@/components/ui/NokiaCard';
import NokiaGoals from '@/components/ui/NokiaGoals';
import { CheckSquare, Square, ArrowLeft, Flame, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const initialHabits = [
  { id: 1, text: 'Morning Sun', done: true, deadline: '08:00 AM' },
  { id: 2, text: 'Cold Shower', done: false, deadline: '08:30 AM' },
  { id: 3, text: 'Deep Work 4h', done: false, deadline: '12:00 PM' },
  { id: 4, text: 'No Sugar', done: false, deadline: 'ALL DAY' },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState(initialHabits);
  const [panicMode, setPanicMode] = useState(false);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  return (
    <NokiaLayout>
      <div className="flex flex-col h-full space-y-4 pt-2 relative">
        {/* Panic Overlay */}
        <AnimatePresence>
          {panicMode && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 z-50 bg-nokia-bg flex flex-col items-center justify-center p-4 border-4 border-nokia-primary"
             >
                <AlertCircle className="w-16 h-16 text-nokia-primary animate-pulse mb-4" />
                <h2 className="text-2xl font-bold uppercase text-center mb-2">Urge Detected</h2>
                <p className="text-center text-sm mb-6">Dopamine spike incoming. Engage countermeasures immediately.</p>
                <div className="flex flex-col gap-2 w-full">
                  <button className="p-3 bg-nokia-primary text-nokia-bg font-bold uppercase tracking-widest">Breathing Exercise</button>
                  <button className="p-3 border-2 border-nokia-primary font-bold uppercase tracking-widest">Call Accountability Partner</button>
                  <button onClick={() => setPanicMode(false)} className="mt-4 text-xs underline text-nokia-dim">DISMISS (I am in control)</button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center gap-2 border-b-2 border-nokia-dim/30 pb-2 mb-2">
          <Link href="/dashboard">
            <button className="p-1 hover:bg-nokia-dim/20 rounded-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-wider">Protocol</h1>
          <button 
            onClick={() => setPanicMode(true)}
            className="ml-auto flex items-center gap-1 bg-red-900/20 text-red-500 border border-red-500/50 px-2 py-1 rounded-sm hover:bg-red-900/40"
          >
             <Flame className="w-4 h-4" />
             <span className="text-[10px] font-bold">PANIC</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 border-2 border-nokia-dim p-[2px] mb-2">
           <motion.div 
             className="h-full bg-nokia-primary"
             initial={{ width: 0 }}
             animate={{ width: `${(habits.filter(h => h.done).length / habits.length) * 100}%` }}
           />
        </div>

        {/* Habits List */}
        <div className="flex flex-col gap-2 overflow-y-auto pb-4 flex-1">
           {habits.map((habit) => (
             <div 
               key={habit.id} 
               onClick={() => toggleHabit(habit.id)}
               className={cn(
                 "flex items-center justify-between p-3 border-2 cursor-pointer transition-all active:scale-[0.98]",
                 habit.done 
                   ? "bg-nokia-primary border-nokia-primary text-nokia-bg" 
                   : "bg-transparent border-nokia-dim text-nokia-primary hover:border-nokia-primary/50"
               )}
             >
                <div className="flex items-center gap-3">
                  {habit.done ? (
                    <CheckSquare className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 flex-shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className={cn(
                      "font-bold uppercase tracking-wide leading-none",
                      habit.done && "line-through decoration-2"
                    )}>
                      {habit.text}
                    </span>
                    {!habit.done && <span className="text-[10px] text-nokia-dim font-mono mt-1">DUE: {habit.deadline}</span>}
                  </div>
                </div>
             </div>
           ))}
           
           <NokiaGoals title="Micro-Habits" initialGoals={["Drink 2L Water", "Stretch 5 mins"]} />

           {/* Agent Connect Button */}
           <Link href="/habitmaxxer/agent" className="mt-2">
             <NokiaCard variant="filled" className="p-4 flex items-center justify-center gap-2 group hover:bg-nokia-primary hover:text-nokia-bg transition-colors cursor-pointer">
                <span className="uppercase font-bold tracking-widest animate-pulse group-hover:animate-none">Consult Protocol</span>
             </NokiaCard>
           </Link>
        </div>
      </div>
    </NokiaLayout>
  );
}
