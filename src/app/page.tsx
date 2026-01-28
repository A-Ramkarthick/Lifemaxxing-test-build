"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NokiaButton from '@/components/ui/NokiaButton';
import NokiaCard from '@/components/ui/NokiaCard';
import NokiaLayout from '@/components/layout/NokiaLayout';

// Typing effect component for that retro feel
const Typewriter = ({ text, delay = 0, speed = 50 }: { text: string, delay?: number, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length) clearInterval(timer);
      }, speed);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return <span>{displayedText}</span>;
}

export default function LandingPage() {
  return (
    <NokiaLayout>
      <div className="flex flex-col items-center justify-center pt-12 space-y-12">
        
        {/* Logo Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-24 h-24 mx-auto border-4 border-nokia-primary rounded-lg flex items-center justify-center mb-6 relative group">
             {/* Icon */}
             <div className="grid grid-cols-3 gap-1 rotate-45">
                {[...Array(9)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-2 h-2 bg-nokia-primary"
                  />
                ))}
             </div>
             {/* Scanline passing through logo */}
             <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="w-full h-1 bg-nokia-primary/30 animate-[scanline_2s_linear_infinite]" />
             </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-nokia-primary drop-shadow-[0_0_10px_rgba(74,255,158,0.5)]">
            LifeMaxxing
          </h1>
          
          <div className="h-6 text-lg text-nokia-dim font-bold tracking-tight">
             <span className="mr-2">{'>'}</span>
             <Typewriter text="Max out your life." delay={500} />
             <span className="animate-blink ml-1">_</span>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="w-full max-w-xs space-y-4"
        >
          <Link href="/auth/signup" className="block">
            <NokiaButton fullWidth size="lg">Start Life Log</NokiaButton>
          </Link>
          
          <Link href="/dashboard" className="block">
            <NokiaButton fullWidth variant="secondary" size="md">Demo Mode</NokiaButton>
          </Link>

          <div className="pt-8 text-center">
            <p className="text-xs text-nokia-dim uppercase tracking-widest">
              v 1.0.4 • Nokia OS
            </p>
          </div>
        </motion.div>

      </div>
    </NokiaLayout>
  );
}
