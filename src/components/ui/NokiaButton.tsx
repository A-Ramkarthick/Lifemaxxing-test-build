import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface NokiaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const NokiaButton = React.forwardRef<HTMLButtonElement, NokiaButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: "bg-nokia-dim text-nokia-primary border-2 border-nokia-dim hover:bg-nokia-primary hover:text-nokia-bg hover:border-nokia-primary shadow-[4px_4px_0_var(--color-nokia-highlight)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    secondary: "bg-transparent text-nokia-dim border-2 border-nokia-dim hover:border-nokia-primary hover:text-nokia-primary hover:bg-nokia-highlight/20",
    ghost: "text-nokia-dim hover:text-nokia-primary bg-transparent hover:bg-nokia-highlight/10",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-12 px-6 text-base uppercase tracking-widest",
    lg: "h-14 px-8 text-lg uppercase tracking-widest font-bold",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center font-mono rounded-sm transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-nokia-primary focus:ring-offset-2 focus:ring-offset-nokia-bg",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props as HTMLMotionProps<"button">}
    >
      {/* Scanline overlay for that retro feel */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-20" />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
});

NokiaButton.displayName = "NokiaButton";

export default NokiaButton;
