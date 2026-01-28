"use client";

import React from 'react';
import NokiaLayout from '@/components/layout/NokiaLayout';
import AgentVideoFeed from '@/components/agent-ui/AgentVideoFeed';
import AgentChat from '@/components/agent-ui/AgentChat';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LooksAgentPage() {
  return (
    <NokiaLayout>
      <div className="flex flex-col h-full space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b-2 border-nokia-dim/30 pb-2 mb-2">
          <Link href="/looksmaxxer">
            <button className="p-1 hover:bg-nokia-dim/20 rounded-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-wider">Style Link</h1>
        </div>

        <AgentVideoFeed agentName="LooksMaxxer" />

        <div className="flex-1 min-h-0 border-t-2 border-nokia-dim/30 pt-2">
           <AgentChat 
             agentName="LooksMaxxer" 
             initialMessage="Your posture metrics are down by 15% this week. Let's calibrate your back routine."
           />
        </div>
      </div>
    </NokiaLayout>
  );
}
