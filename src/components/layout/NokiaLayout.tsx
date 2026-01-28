"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Square, 
  BookOpen, 
  BarChart2, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PixelTrail from '@/components/ui/PixelTrail';

// Layout wrapper for pages to ensure background consistency
export default function NokiaLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: Square },
    { label: "Grimoire", href: "/mindmaxxer", icon: BookOpen },
    { label: "FinMaxxer", href: "/finmaxxer", icon: BarChart2 },
    { label: "HabitMaxxer", href: "/habitmaxxer", icon: CheckSquare },
    { label: "StudyMaxxer", href: "/studymaxxer", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col font-mono text-nokia-primary relative overflow-hidden bg-nokia-bg shadow-[0_0_150px_rgba(120,224,47,0.1)] border-x-2 border-nokia-dim/20">
      
      {/* Background FX */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,22,12,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_4px,6px_100%] pointer-events-none" />
        <div className="absolute inset-0 animate-scanline bg-[linear-gradient(0deg,rgba(0,0,0,0)_50%,rgba(120,224,47,0.05)_50%,rgba(0,0,0,0)_55%)] bg-[length:100%_8px] z-[2] pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-0 h-full w-full">
         <PixelTrail 
            gridSize={60} 
            trailSize={0.8} 
            color="#3a5c20" 
            maxAge={1200} 
            interpolate={8}
            className="opacity-100"
         />
      </div>

      {/* Top Status Bar */}
      <header className="flex justify-between items-end border-b-2 border-nokia-dim pb-2 mb-8 select-none relative z-10">
        <div className="flex flex-col">
          <span className="text-xs text-nokia-dim uppercase tracking-[0.2em]">Signal</span>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-nokia-primary" />
            <div className="w-1 h-3 bg-nokia-primary" />
            <div className="w-1 h-3 bg-nokia-primary" />
            <div className="w-1 h-3 bg-nokia-dim" />
            <div className="w-1 h-3 bg-nokia-dim" />
          </div>
        </div>
        
        <h1 className="text-xl font-bold tracking-tighter uppercase relative top-1">
          LifeMaxxing
        </h1>

        <div className="flex flex-col items-end">
          <span className="text-xs text-nokia-dim uppercase tracking-[0.2em]">Battery</span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-3 border-2 border-nokia-primary p-[1px]">
              <div className="w-full h-full bg-nokia-primary animate-pulse" />
            </div>
            <div className="w-1 h-2 bg-nokia-primary" />
          </div>
        </div>
      </header>

      {/* Main Content Area - Acts as the "Screen" */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="min-h-[60vh] "
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Retro Bottom Navigation / Softkeys */}
      <nav className="mt-8 border-t-2 border-nokia-dim pt-4 grid grid-cols-3 gap-4 text-center relative z-10">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col items-start active:translate-y-1 transition-transform pl-2"
        >
          <span className="text-sm uppercase font-bold">Options</span>
        </button>
        
        <Link href="/dashboard" className="flex flex-col items-center active:translate-y-1 transition-transform group">
           <div className="w-12 h-6 border-2 border-nokia-primary rounded-sm bg-nokia-dim/10 flex items-center justify-center mb-1 group-hover:bg-nokia-primary/20 transition-colors">
              <div className="w-6 h-2 bg-nokia-primary rounded-[1px]" />
           </div>
           <span className="text-xs uppercase font-bold tracking-widest text-nokia-primary">Select</span>
        </Link>

        <button 
          onClick={() => router.back()}
          className="flex flex-col items-end active:translate-y-1 transition-transform pr-2"
        >
          <span className="text-sm uppercase font-bold">Back</span>
        </button>
      </nav>

      {/* Slide-up Menu Modal */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.8 }} 
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-nokia-bg z-40" 
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-nokia-bg border-t-2 border-nokia-primary p-6 z-50 rounded-t-lg shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
              <div className="max-w-md mx-auto space-y-2">
                <div className="text-center mb-6 text-nokia-dim uppercase tracking-widest text-sm">— Menu —</div>
                {menuItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 p-4 border-2 border-nokia-dim hover:bg-nokia-primary hover:text-nokia-bg hover:border-nokia-primary transition-colors group"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="uppercase tracking-widest text-lg">{item.label}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100">◄</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
