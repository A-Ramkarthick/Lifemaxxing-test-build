import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface NokiaCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  title?: string;
  variant?: 'outline' | 'filled' | 'screen';
  className?: string;
}

const NokiaCard = ({ 
  children, 
  title,
  variant = 'outline', 
  className,
  ...props 
}: NokiaCardProps) => {
  const variants = {
    outline: "border-2 border-nokia-dim bg-nokia-bg",
    filled: "bg-nokia-dim text-nokia-primary border-2 border-nokia-dim",
    screen: "bg-nokia-screen border-2 border-nokia-dim inset-shadow-sm",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative rounded-sm p-4",
        variants[variant],
        className
      )}
      {...props}
    >
      {title && (
        <div className="absolute -top-3 left-4 bg-nokia-bg px-2 text-nokia-dim text-sm uppercase font-bold tracking-widest">
          {title}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default NokiaCard;
