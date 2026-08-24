'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Appointments', href: '/' },
    { label: 'Cath Lab', href: '/cath-lab' },
  ];

  return (
    <header className="bg-slate-900 border-b border-white/5 sticky top-0 z-50 transition-all duration-500 print:hidden">
      <div className="container mx-auto px-6 h-18 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          {/* Pulse Brand Identity: Command Center */}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer py-4">
            <div className="relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-9 w-16 text-emerald-400 group-hover:text-emerald-300 transition-all duration-500 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]" 
                fill="none" 
                viewBox="0 0 32 24" 
                stroke="currentColor" 
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l1.5-6 2.5 12 1.5-6h2l1.5-8 2 16 1.5-8h4.5" />
                <circle cx="28" cy="12" r="1.2" fill="currentColor" className="animate-pulse" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="font-outfit text-2xl tracking-tighter leading-none text-white">
                <span className="font-black">Cath</span>
                <span className="font-light text-emerald-400">Lab</span>
              </h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] leading-none mt-1.5 opacity-80">Management System</span>
            </div>
          </Link>

          {/* Premium Desktop Navigation */}
          <nav className="hidden md:flex items-center bg-slate-800/40 backdrop-blur-md rounded-2xl p-1 border border-white/5 shadow-inner">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`
                    px-6 py-2 text-sm font-black transition-all duration-500 rounded-xl relative overflow-hidden group
                    ${isActive 
                      ? 'text-white bg-gradient-to-br from-emerald-500/20 to-teal-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 animate-in fade-in slide-in-from-left-full duration-700"></span>
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* High-Contrast User Profile */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-black text-white leading-none">Admin User</p>
            <p className="text-[9px] font-bold text-emerald-400/70 uppercase tracking-tighter mt-1">Primary Operator</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-0.5 border border-white/10 shadow-2xl flex items-center justify-center group cursor-pointer hover:border-emerald-500/30 transition-all active:scale-95">
            <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors overflow-hidden">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
