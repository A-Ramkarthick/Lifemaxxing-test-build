"use client";

import React, { useState } from 'react';
import { Plus, X, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import NokiaCard from './NokiaCard';

interface Goal {
  id: number;
  text: string;
  completed: boolean;
}

interface NokiaGoalsProps {
  initialGoals?: string[];
  title?: string;
}

export default function NokiaGoals({ initialGoals = [], title = "Subgoals" }: NokiaGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>(
    initialGoals.map((text, i) => ({ id: i, text, completed: false }))
  );
  const [newGoal, setNewGoal] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: Date.now(), text: newGoal, completed: false }]);
    setNewGoal("");
    setIsAdding(false);
  };

  const toggleGoal = (id: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center justify-between">
         <span className="text-xs uppercase tracking-widest text-nokia-dim flex items-center gap-1">
            <Target className="w-3 h-3" /> {title}
         </span>
         <button 
           onClick={() => setIsAdding(!isAdding)}
           className="text-nokia-primary bg-nokia-dim/20 p-1 rounded-sm hover:bg-nokia-primary hover:text-nokia-bg transition-colors"
         >
           <Plus className="w-3 h-3" />
         </button>
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-2 animate-in slide-in-from-top-2">
           <input 
             value={newGoal}
             onChange={(e) => setNewGoal(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && addGoal()}
             className="flex-1 bg-nokia-dim/10 border border-nokia-dim p-1 text-sm outline-none text-nokia-primary placeholder:text-nokia-dim/50 font-mono"
             placeholder="New Objective..."
             autoFocus
           />
           <button onClick={addGoal} className="px-2 bg-nokia-primary text-nokia-bg font-bold text-xs uppercase">Add</button>
        </div>
      )}
      
      <div className="space-y-1">
         {goals.length === 0 && !isAdding && (
            <div className="text-[10px] text-nokia-dim italic py-2 text-center border border-dashed border-nokia-dim/30">
               No active directives.
            </div>
         )}
         {goals.map(g => (
            <div key={g.id} className="group flex items-center justify-between p-2 border border-nokia-dim/30 bg-nokia-dim/5 rounded-sm hover:border-nokia-dim/60 transition-colors">
               <div 
                 onClick={() => toggleGoal(g.id)}
                 className="flex items-center gap-2 cursor-pointer flex-1"
               >
                  <div className={cn("w-2 h-2 border border-nokia-primary", g.completed && "bg-nokia-primary")} />
                  <span className={cn("text-xs uppercase font-medium", g.completed && "line-through opacity-50")}>
                    {g.text}
                  </span>
               </div>
               <button onClick={() => deleteGoal(g.id)} className="opacity-0 group-hover:opacity-100 p-1 text-nokia-dim hover:text-red-400 transition-opacity">
                  <X className="w-3 h-3" />
               </button>
            </div>
         ))}
      </div>
    </div>
  );
}
