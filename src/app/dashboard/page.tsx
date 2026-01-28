"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Briefcase, 
  Heart, 
  Dumbbell, 
  DollarSign, 
  CheckSquare, 
  Brain,
  BookOpen,
  ChevronRight,
  Battery
} from 'lucide-react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import { cn } from '@/lib/utils';

interface AgentItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  desc: string;
}

const agents: AgentItem[] = [
  { id: 'finance', label: 'FinMaxxer', icon: DollarSign, href: '/finmaxxer', desc: 'Wealth & Assets' },
  { id: 'habits', label: 'HabitMaxxer', icon: CheckSquare, href: '/habitmaxxer', desc: 'Routine Protocol' },
  { id: 'looks', label: 'LooksMaxxer', icon: Dumbbell, href: '/looksmaxxer', desc: 'Physique & Style' },
  { id: 'romance', label: 'RizzMaxxer', icon: Heart, href: '/rizzmaxxer', desc: 'Social Dynamics' },
  { id: 'career', label: 'CareerMaxxer', icon: Briefcase, href: '/careermaxxer', desc: 'Professional Arc' },
  { id: 'study', label: 'StudyMaxxer', icon: BookOpen, href: '/studymaxxer', desc: 'Neural Upload' }, // New Agent
  { id: 'brain', label: 'MindMaxxer', icon: Brain, href: '/mindmaxxer', desc: 'Knowledge Base' },
];

export default function DashboardPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <NokiaLayout>
      <div className="flex flex-col h-full pt-2">
        
        {/* Date/Time Header Widget */}
        <div className="mb-6 px-2 flex justify-between items-end border-b-2 border-nokia-dim/30 pb-2">
           <div className="flex flex-col">
              <span className="text-3xl leading-none font-bold tracking-tighter">12:45</span>
              <span className="text-xs uppercase tracking-widest text-nokia-dim">PM</span>
           </div>
           <span className="text-sm uppercase tracking-widest font-bold">JAN 26</span>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          {agents.map((agent, index) => {
            const isSelected = selectedIndex === index;
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative p-4 flex flex-col items-center justify-center gap-3 border-2 rounded-sm cursor-pointer transition-all duration-200 group aspect-square",
                  isSelected 
                    ? "bg-nokia-primary border-nokia-primary text-nokia-bg shadow-[0_4px_0_var(--color-nokia-dim)] translate-y-[-2px]" 
                    : "bg-transparent border-nokia-dim text-nokia-primary hover:border-nokia-primary/50"
                )}
              >
                {/* Icon Container */}
                <div className={cn(
                  "p-2 rounded-sm border-2 transition-colors",
                  isSelected ? "border-nokia-bg bg-nokia-bg text-nokia-primary" : "border-nokia-dim bg-nokia-dim/10"
                )}>
                  <agent.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                
                <span className={cn(
                  "text-sm font-bold uppercase tracking-wider text-center",
                  isSelected ? "text-nokia-bg" : "text-nokia-primary"
                )}>
                  {agent.label}
                </span>

                {/* Selection Indicator Corner */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-2 h-2">
                    <div className="absolute top-0 right-0 w-full h-[2px] bg-nokia-bg" />
                    <div className="absolute top-0 right-0 h-full w-[2px] bg-nokia-bg" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Context / Description Area */}
        <div className="mt-auto border-t-2 border-nokia-dim pt-3 min-h-[80px]">
           <AnimatePresence mode="wait">
             <motion.div
               key={selectedIndex}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="flex items-center gap-3"
             >
                <div className="flex-1">
                   <h3 className="text-xs uppercase tracking-[0.2em] text-nokia-dim mb-1">SELECTED AGENT</h3>
                   <p className="text-lg uppercase font-bold leading-tight">
                     {agents[selectedIndex].desc}
                   </p>
                </div>
                
                <Link href={agents[selectedIndex].href}>
                  <button className="h-10 w-10 border-2 border-nokia-primary flex items-center justify-center hover:bg-nokia-primary hover:text-nokia-bg active:scale-95 transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </Link>
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </NokiaLayout>
  );
}
