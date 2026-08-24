'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppointmentProvider } from '@/context/AppointmentContext';
import { CathLabProvider } from '@/context/CathLabContext';
import { useAuth } from '@/context/AuthContext';
import { MedicationProvider } from '@/context/MedicationContext';
import { DosageProvider } from '@/context/DosageContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Ensure we only run logic after mounting to avoid hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize pathname: ensure it starts with / and remove only the final slash if it's not the root
  const normalizedPathname = pathname ? (pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname) : '';
  
  const isLoginPage = normalizedPathname === '/login';
  const isPrintPage = normalizedPathname.startsWith('/print');

  useEffect(() => {
    // Only redirect if we ARE NOT already on the login page
    if (mounted && !isLoading && !user && !isLoginPage) {
      // Use window.location.replace for the initial redirect to be more robust in static exports
      if (typeof window !== 'undefined') {
        window.location.replace('/login/');
      }
    }
  }, [user, isLoading, isLoginPage, mounted]);

  // Before mounting, or while loading auth state, show a consistent loader
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
            <svg className="animate-spin h-12 w-12 text-emerald-500 relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-bold animate-pulse tracking-widest uppercase">Initializing System</p>
          <p className="text-slate-400 text-[10px] mt-2 font-medium">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  // Handle Print Page (Standalone)
  if (isPrintPage && user) {
    return (
      <AppointmentProvider>
        <div className="bg-white min-h-screen overflow-auto">
          {children}
        </div>
      </AppointmentProvider>
    );
  }

  // Handle Login Page
  if (isLoginPage) {
    return <div className="bg-slate-50 min-h-screen overflow-hidden">{children}</div>;
  }

  // Handle Unauthenticated (Waiting for redirect)
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden">
        <div className="flex flex-col items-center">
           <svg className="animate-spin h-10 w-10 text-emerald-500 mb-6" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z"/>
           </svg>
           <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Redirecting to login...</p>
           <button 
             onClick={() => window.location.href = '/login/'} 
             className="mt-8 text-emerald-500 text-xs font-black hover:text-emerald-400 transition-colors uppercase tracking-widest border-2 border-emerald-500/20 px-6 py-2.5 rounded-2xl bg-white shadow-sm"
           >
             Manual Login Link
           </button>
        </div>
      </div>
    );
  }

  // Handle Main App
  return (
    <AppointmentProvider>
      <CathLabProvider>
        <MedicationProvider>
          <DosageProvider>
          <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased overflow-hidden">
            <div className="print:hidden">
              <Sidebar />
            </div>
            
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden print:h-auto print:overflow-visible">
              <div className="print:hidden">
                <TopBar />
              </div>
              
              <main className="flex-1 overflow-y-auto bg-[#f8fafc] relative p-4 sm:p-8 print:p-0 print:bg-white print:overflow-visible">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-50/30 to-transparent pointer-events-none -z-10 print:hidden" />
                <div className="max-w-7xl mx-auto text-slate-800 print:max-w-none">
                  {children}
                </div>
              </main>
            </div>
          </div>
          </DosageProvider>
        </MedicationProvider>
      </CathLabProvider>
    </AppointmentProvider>
  );
}
