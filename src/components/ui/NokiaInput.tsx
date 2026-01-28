// src/components/ui/NokiaInput.tsx
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NokiaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const NokiaInput = React.forwardRef<HTMLInputElement, NokiaInputProps>(
  ({ className, type, label, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="flex flex-col gap-1 w-full mb-4 group">
        <label className={cn(
          "text-xs uppercase tracking-widest transition-colors",
          isFocused ? "text-nokia-primary" : "text-nokia-dim"
        )}>
          {label}
        </label>
        
        <div className={cn(
          "relative flex items-center bg-nokia-screen border-2 rounded-sm transition-all duration-200",
          isFocused 
            ? "border-nokia-primary shadow-[0_4px_0_var(--color-nokia-dim)] translate-y-[-2px]" 
            : "border-nokia-dim shadow-none"
        )}>
          {/* Blinking cursor effect decor */}
          {isFocused && (
            <motion.div 
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-nokia-primary pointer-events-none z-10 opacity-50"
            />
          )}

          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full bg-transparent px-3 py-3 font-mono text-nokia-primary text-lg placeholder-nokia-dim/50 outline-none z-20",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}
            {...props}
          />
        </div>
      </div>
    );
  }
);
NokiaInput.displayName = "NokiaInput";

export default NokiaInput;
