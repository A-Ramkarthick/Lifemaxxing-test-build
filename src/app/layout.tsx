import './globals.css';
import { cn } from '@/lib/utils';
// We are using a Google Font that mimics the pixel vibe closesly if local font not avail
import { VT323 } from 'next/font/google';

const vt323 = VT323({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
});

export const metadata = {
  title: 'LifeMaxxing | OS 1100',
  description: 'Personal AI Operating System v1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(vt323.variable, "antialiased min-h-screen overflow-x-hidden selection:bg-nokia-primary selection:text-nokia-bg")}>
         {children}
      </body>
    </html>
  );
}
