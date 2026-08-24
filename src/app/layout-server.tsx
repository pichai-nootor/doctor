import { AppointmentProvider } from '@/context/AppointmentContext';
import { CathLabProvider } from '@/context/CathLabContext';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cath Lab Management System',
  description: 'Manage patient procedures with elegance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-slate-50 min-h-screen flex antialiased text-slate-800`}>
        <AppointmentProvider>
          <CathLabProvider>
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
              <TopBar />
              
              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto bg-[#f8fafc] relative p-8">
                {/* Ambient Background Glows */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-50/30 to-transparent pointer-events-none -z-10 print:hidden" />
                
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </CathLabProvider>
        </AppointmentProvider>
      </body>
    </html>
  );
}
