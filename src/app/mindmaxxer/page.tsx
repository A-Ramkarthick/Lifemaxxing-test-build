"use client";

import React, { useState, useEffect } from 'react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import NokiaCard from '@/components/ui/NokiaCard';
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  getDay,
  parseISO
} from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock storage key
const STORAGE_KEY = 'mindmaxxer_journal_entries';

interface JournalEntry {
  content: string;
  mood?: 'neutral' | 'good' | 'bad';
  timestamp: number;
}

export default function JournalPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [currentEntry, setCurrentEntry] = useState("");
  const [view, setView] = useState<'calendar' | 'editor'>('calendar');

  // Load entries from "local storage" (simulated)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Update editor content when date changes
  useEffect(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    if (entries[dateKey]) {
      setCurrentEntry(entries[dateKey].content);
    } else {
      setCurrentEntry("");
    }
  }, [selectedDate, entries]);

  const saveEntry = () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const newEntries = {
      ...entries,
      [dateKey]: {
        content: currentEntry,
        timestamp: Date.now()
      }
    };
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    // Optional: visual feedback
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Calculate padding days for the grid (Mon start)
  const startDay = getDay(startOfMonth(currentMonth));
  const paddingDays = startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start (0 is Sunday)

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setView('editor');
  };

  return (
    <NokiaLayout>
      <div className="flex flex-col h-full space-y-4 pt-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-nokia-dim/30 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <button className="p-1 hover:bg-nokia-dim/20 rounded-sm">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <h1 className="text-xl font-bold uppercase tracking-wider">
              {view === 'calendar' ? 'Grimoire' : format(selectedDate, 'MMM dd')}
            </h1>
          </div>
          <button 
             onClick={() => setView(view === 'calendar' ? 'editor' : 'calendar')}
             className="p-1 border border-nokia-dim hover:bg-nokia-dim/20"
          >
             <CalendarIcon className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
        {view === 'calendar' ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col"
          >
             {/* Calendar Header */}
             <div className="flex items-center justify-between mb-4 bg-nokia-dim/10 p-2 rounded-sm border border-nokia-dim/30">
               <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                 <ChevronLeft className="w-5 h-5" />
               </button>
               <span className="font-bold uppercase tracking-widest text-lg">
                 {format(currentMonth, 'MMMM yyyy')}
               </span>
               <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                 <ChevronRight className="w-5 h-5" />
               </button>
             </div>

             {/* Days Grid */}
             <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold mb-2">
               {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                 <div key={d} className="text-nokia-dim">{d}</div>
               ))}
             </div>
             
             <div className="grid grid-cols-7 gap-1 flex-1 content-start">
               {Array.from({ length: paddingDays }).map((_, i) => (
                 <div key={`pad-${i}`} />
               ))}
               {days.map((day) => {
                 const dateKey = format(day, 'yyyy-MM-dd');
                 const hasEntry = !!entries[dateKey];
                 const isSelected = isSameDay(day, selectedDate);
                 
                 return (
                   <button
                     key={dateKey}
                     onClick={() => handleDateClick(day)}
                     className={cn(
                       "aspect-square flex flex-col items-center justify-center border border-transparent rounded-sm relative hover:border-nokia-dim transition-colors",
                       isSelected && "bg-nokia-primary text-nokia-bg font-bold border-nokia-primary",
                       !isSelected && hasEntry && "bg-nokia-dim/20"
                     )}
                   >
                     <span>{format(day, 'd')}</span>
                     {hasEntry && !isSelected && (
                       <div className="w-1 h-1 bg-nokia-primary rounded-full mt-1" />
                     )}
                   </button>
                 );
               })}
             </div>
             
             <div className="mt-auto pt-4 text-center">
                <p className="text-xs text-nokia-dim uppercase tracking-widest">
                  {Object.keys(entries).length} Entries Recorded
                </p>
             </div>
          </motion.div>
        ) : (
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="flex-1 flex flex-col gap-4"
          >
             {/* Text Area Simulation */}
             <NokiaCard variant="screen" className="flex-1 p-3 overflow-hidden flex flex-col">
               <div className="flex justify-between items-center mb-2 border-b border-nokia-dim/20 pb-1">
                 <span className="text-xs text-nokia-dim font-mono">{format(selectedDate, 'yyyy-MM-dd')} // {format(selectedDate, 'HH:mm')}</span>
                 <div className="w-2 h-2 bg-nokia-primary animate-pulse" />
               </div>
               <textarea 
                 value={currentEntry}
                 onChange={(e) => setCurrentEntry(e.target.value)}
                 className="flex-1 w-full bg-transparent border-none outline-none resize-none font-mono text-lg leading-relaxed text-nokia-primary placeholder:text-nokia-dim/50"
                 placeholder="SYSTEM LOG: BEGIN ENTRY..."
                 autoFocus
               />
             </NokiaCard>

             {/* Action Bar */}
             <div className="grid grid-cols-2 gap-3 pb-2">
                <button 
                  onClick={() => setCurrentEntry('')}
                  className="p-3 border-2 border-nokia-dim hover:bg-nokia-dim/10 uppercase font-bold text-sm tracking-wider"
                >
                  Clear
                </button>
                <button 
                  onClick={saveEntry}
                  className="group p-3 border-2 border-nokia-primary bg-nokia-primary text-nokia-bg hover:bg-nokia-bg hover:text-nokia-primary transition-all uppercase font-bold text-sm tracking-wider flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
             </div>
             
             {/* Agent Connect Button */}
             <Link href="/mindmaxxer/agent">
                <NokiaCard variant="filled" className="p-3 flex items-center justify-center gap-2 group hover:bg-nokia-primary hover:text-nokia-bg transition-colors cursor-pointer border-t-2 border-nokia-bg/20">
                   <span className="text-xs uppercase font-bold tracking-widest group-hover:animate-pulse">Analyze with Agent</span>
                </NokiaCard>
             </Link>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </NokiaLayout>
  );
}
