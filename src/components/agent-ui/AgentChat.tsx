"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Video, PhoneOff, Paperclip, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import NokiaCard from '../ui/NokiaCard';
import NokiaInput from '../ui/NokiaInput';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  attachment?: { type: 'image' | 'file', name: string };
}

interface AgentChatProps {
  agentName: string;
  initialMessage?: string;
  onHangup?: () => void;
}

export default function AgentChat({ agentName, initialMessage, onHangup }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'agent', text: initialMessage || `Connected to ${agentName}. Upload data for analysis.`, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate response delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `Processing input for ${agentName} context... [MOCK RESPONSE]`,
        timestamp: new Date(),
      }]);
    }, 1000);
  };

  const handleUpload = () => {
     // Mock upload
     const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: 'Sent an attachment',
      attachment: { type: 'image', name: 'screenshot_01.png' },
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }

  return (
    <div className="flex flex-col h-full gap-4 relative">
      <div className="flex-1 flex flex-col gap-2 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-nokia-bg to-transparent z-10" />
        
        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 px-1 py-4 scrollbar-hide">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.sender === 'user' ? "self-end items-end" : "self-start items-start"
                )}
              >
                <div className={cn(
                  "px-3 py-2 text-sm font-bold border-2 leading-tight relative flex flex-col gap-2",
                  msg.sender === 'user' 
                    ? "border-nokia-primary bg-nokia-primary text-nokia-bg rounded-tl-lg rounded-bl-lg rounded-br-lg" 
                    : "border-nokia-dim bg-nokia-dim/20 text-nokia-primary rounded-tr-lg rounded-br-lg rounded-bl-lg"
                )}>
                  {msg.attachment && (
                    <div className="flex items-center gap-2 bg-black/10 p-2 rounded-sm mb-1 border border-current/20">
                       <ImageIcon className="w-4 h-4" />
                       <span className="text-xs underline">{msg.attachment.name}</span>
                    </div>
                  )}
                  {msg.text}
                  {/* Speech bubble tail illusion */}
                  <div className={cn(
                    "absolute top-0 w-2 h-2 border-t-2",
                    msg.sender === 'user' 
                      ? "-right-[10px] border-l-2 border-nokia-primary bg-transparent skew-x-[45deg]" 
                      : "-left-[10px] border-r-2 border-nokia-dim bg-transparent -skew-x-[45deg]"
                  )} />
                </div>
                <span className="text-[10px] uppercase text-nokia-dim mt-1 tracking-wider">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-nokia-bg to-transparent z-10" />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2">
         <button onClick={handleUpload} className="p-2 border-2 border-nokia-dim text-nokia-dim hover:text-nokia-primary hover:border-nokia-primary transition-colors">
            <Paperclip className="w-5 h-5" />
         </button>
         <NokiaCard variant="outline" className="flex-1 flex items-center p-1 bg-nokia-bg">
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none outline-none font-mono text-nokia-primary placeholder:text-nokia-dim px-2 py-1 text-sm"
              placeholder="TRANSMIT MESSAGE..."
              autoFocus
            />
         </NokiaCard>
         <button 
           onClick={handleSend}
           className="w-10 h-10 border-2 border-nokia-primary bg-nokia-primary text-nokia-bg flex items-center justify-center hover:bg-nokia-bg hover:text-nokia-primary transition-colors"
         >
           <Send className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
}
