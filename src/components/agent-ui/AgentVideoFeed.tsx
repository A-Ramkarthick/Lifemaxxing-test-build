"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Signal, Battery, Video, Wifi } from 'lucide-react';

interface AgentVideoFeedProps {
  agentName: string;
  isLive?: boolean;
}

export default function AgentVideoFeed({ agentName, isLive = true }: AgentVideoFeedProps) {
  return (
    <div className="relative w-full aspect-video border-2 border-nokia-dim bg-nokia-screen overflow-hidden group">
      
      {/* Scanlines & Noise FX */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20">
         <div className="w-full h-full bg-[linear-gradient(rgba(18,22,12,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%]" />
         <div className="absolute inset-0 animate-scanline bg-[linear-gradient(0deg,rgba(0,0,0,0)_50%,rgba(120,224,47,0.1)_50%,rgba(0,0,0,0)_55%)] bg-[length:100%_8px]" />
      </div>

      {/* Placeholder Image Layer */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        {/* This is where the transparent image will go */}
        <div className="text-nokia-dim font-bold text-center">
           <Video className="w-16 h-16 mx-auto mb-2 opacity-50" />
           <p className="uppercase tracking-widest text-xs">Video Feed Interrupted</p>
           <p className="text-[10px] mt-1">Waiting for Signal...</p>
        </div>
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-30 p-2 flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 bg-nokia-bg/80 px-2 py-1 border border-nokia-dim/50 rounded-sm">
               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold tracking-wider uppercase text-nokia-primary">REC</span>
            </div>
            
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold uppercase tracking-wider text-nokia-primary">{agentName}</span>
               <span className="text-[8px] uppercase tracking-widest text-nokia-dim">Secure Line</span>
            </div>
         </div>

         <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono text-nokia-primary/70">
               {new Date().toLocaleTimeString()}
            </span>
            <div className="flex gap-1 text-nokia-primary">
               <Wifi className="w-3 h-3" />
               <Battery className="w-3 h-3" />
            </div>
         </div>
      </div>

      {/* Border Glow Animation */}
      <div className="absolute inset-0 border-2 border-nokia-primary/20 animate-pulse z-10" />
    </div>
  );
}
