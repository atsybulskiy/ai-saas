import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.scss';
import { ModalProvider } from '@/components/providers/ModalProvider';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import { CrispProvider } from '@/components/providers/CrispProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Genius',
  description: 'AI Platform'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider>
    <html lang="en">
      <CrispProvider />
      <body className={inter.className}>
        <ModalProvider />
        <ToasterProvider />
        {children}
      </body>
    </html>
  </ClerkProvider>
);
export default RootLayout;
