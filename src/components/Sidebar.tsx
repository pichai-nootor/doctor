'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCathLab } from '@/context/CathLabContext';
import { useAppointments } from '@/context/AppointmentContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  // Normalize pathname to handle trailing slashes
  const normalizedPathname = pathname.replace(/\/$/, '') || '/';
  
  const { isSidebarOpen: isCollapsed, setSidebarOpen: setIsCollapsed } = useCathLab();
  const { appointments } = useAppointments();
  const { permissions } = useAuth();
  
  const pendingCount = appointments.filter(a => a.postCathStatus === 'pending').length;

  const [masterDataOpen, setMasterDataOpen] = useState(normalizedPathname.startsWith('/medications') || normalizedPathname.startsWith('/dosages'));

  const mainNavItems = [
    { 
      label: 'Dashboard', 
      href: '/', 
      permissionKey: 'dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      label: 'Cath Lab', 
      href: '/cath-lab', 
      permissionKey: 'cathLab',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    { 
      label: 'Appointments', 
      href: '/appointments', 
      permissionKey: 'appointments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      label: 'Post-Cath', 
      href: '/post-cath', 
      permissionKey: 'postCath',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  const filteredMainNavItems = mainNavItems.filter(item => {
    // If permissions exist, check if the user has the permission for this menu item
    if (permissions && item.permissionKey) {
      return permissions[item.permissionKey as keyof typeof permissions];
    }
    return true; // Fallback to show if no permission logic
  });

  const masterDataSubItems = [
    {
      label: 'Medications',
      href: '/medications',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      label: 'Dosages',
      href: '/dosages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
  ];

  const isMasterDataActive = masterDataSubItems.some(s => normalizedPathname === s.href);

  return (
    <>
      {/* Mobile Backdrop */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsCollapsed(false)}
        />
      )}
      
      <aside className={`
        ${isCollapsed ? 'translate-x-0 w-64 lg:w-20' : '-translate-x-full w-64 lg:translate-x-0 lg:w-48'} 
        fixed lg:sticky top-0 left-0 z-[60] h-screen
        bg-slate-950 border-r border-white/5 flex flex-col transition-all duration-500
      `}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`
          hidden lg:flex absolute top-14 -right-4 z-[60]
          w-8 h-8 rounded-full bg-slate-900 border border-white/20
          items-center justify-center text-slate-400 hover:text-white
          shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:scale-110 transition-all duration-300
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Section */}
        <div className={`p-5 mb-2 flex items-center ${isCollapsed ? 'justify-between lg:justify-center' : 'justify-between'}`}>
          <Link href="/" className={`flex items-center space-x-2 group animate-in slide-in-from-left duration-700 overflow-hidden ${isCollapsed ? 'flex lg:hidden' : 'flex'}`}>
            <div className="relative flex items-center justify-center shrink-0">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-10 text-emerald-400 group-hover:text-emerald-300 transition-all duration-500 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
                fill="none" 
                viewBox="0 0 32 24" 
                stroke="currentColor" 
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l1.5-6 2.5 12 1.5-6h2l1.5-8 2 16 1.5-8h4.5" />
                <circle cx="28" cy="12" r="1.2" fill="currentColor" className="animate-pulse" />
              </svg>
            </div>
            <div className="flex flex-col whitespace-nowrap min-w-0">
              <h1 className="font-outfit text-xl tracking-tighter leading-none text-white overflow-hidden">
                <span className="font-black">Cath</span>
                <span className="font-light text-emerald-400">Lab</span>
              </h1>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1 opacity-80 truncate">Management</span>
            </div>
          </Link>
          
          <div className={`relative items-center justify-center animate-in zoom-in duration-500 ${isCollapsed ? 'hidden lg:flex' : 'hidden'}`}>
             <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-12 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
              fill="none" 
              viewBox="0 0 32 24" 
              stroke="currentColor" 
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l1.5-6 2.5 12 1.5-6h2l1.5-8 2 16 1.5-8h4.5" />
            </svg>
          </div>
        </div>

        {/* Navigation section */}
        <nav className="flex-1 px-3 space-y-1 mt-4 overflow-x-hidden overflow-y-auto pb-6">
          <p className={`px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 animate-in fade-in duration-700 ${isCollapsed ? 'block lg:hidden' : 'block'}`}>
            Overview
          </p>

          {/* Main nav items */}
          {filteredMainNavItems.map((item) => {
            const isActive = normalizedPathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`
                  flex items-center space-x-3 py-3 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                  ${isCollapsed ? 'px-4 lg:justify-center lg:px-0' : 'px-4'}
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsCollapsed(false);
                }}
              >
                <div className={`transition-transform duration-300 group-hover:scale-110 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-bold tracking-tight whitespace-nowrap flex-1 truncate transition-colors duration-300 ${isActive ? 'text-white' : ''} ${isCollapsed ? 'block lg:hidden' : 'hidden lg:block'}`}>
                  {item.label}
                </span>

                {isActive && (
                  <div className={`w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse shrink-0 ml-2 ${isCollapsed ? 'block lg:hidden' : 'block'}`} />
                )}

                {item.label === 'Post-Cath' && pendingCount > 0 && !isActive && (
                  <div className={`ml-auto bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center shadow-sm ${isCollapsed ? 'block lg:hidden' : 'block'}`}>
                    {pendingCount}
                  </div>
                )}
                
                {isActive && isCollapsed && (
                  <div className="absolute left-0 w-1 h-6 bg-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(52,211,153,0.8)] lg:block hidden" />
                )}
              </Link>
            );
          })}

          {/* Master Data section */}
          {permissions?.masterData && (
            <>
              <p className={`px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-4 pb-2 animate-in fade-in duration-700 ${isCollapsed ? 'block lg:hidden' : 'block'}`}>
                Data Management
              </p>

              {/* Master Data parent button */}
              <button
                onClick={() => {
                  if (window.innerWidth >= 1024 && isCollapsed) return;
                  setMasterDataOpen(o => !o);
                }}
                className={`
                  w-full flex items-center space-x-3 py-3 rounded-2xl transition-all duration-300 group relative
                  ${isMasterDataActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                  ${isCollapsed ? 'px-4 lg:justify-center lg:px-0' : 'px-4'}
                `}
              >
                <div className={`transition-transform duration-300 group-hover:scale-110 shrink-0 ${isMasterDataActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm0 5h16M9 4v16" />
                  </svg>
                </div>
                
                <div className={`flex items-center flex-1 min-w-0 ${isCollapsed ? 'flex lg:hidden' : 'hidden lg:flex'}`}>
                  <span className={`text-sm font-bold tracking-tight whitespace-nowrap flex-1 text-left ${isMasterDataActive ? 'text-white' : ''}`}>
                    Master Data
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${masterDataOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {isMasterDataActive && (
                  <div className={`ml-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse shrink-0 ${isCollapsed ? 'block lg:hidden' : 'block'}`} />
                )}
                
                {isMasterDataActive && isCollapsed && (
                  <div className="absolute left-0 w-1 h-6 bg-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(52,211,153,0.8)] lg:block hidden" />
                )}
              </button>

              {/* Submenu */}
              <div className={`ml-4 pl-3 border-l border-white/10 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200 ${masterDataOpen ? 'block' : 'hidden'} ${isCollapsed ? 'block lg:hidden' : 'block'}`}>
                {masterDataSubItems.map(sub => {
                  const isSubActive = normalizedPathname === sub.href;
                  return (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className={`
                        flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group
                        ${isSubActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                          : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                        }
                      `}
                      onClick={() => {
                        if (window.innerWidth < 1024) setIsCollapsed(false);
                      }}
                    >
                      <div className={`shrink-0 ${isSubActive ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-300'}`}>
                        {sub.icon}
                      </div>
                      <span className={`text-xs font-bold tracking-tight whitespace-nowrap ${isSubActive ? 'text-white' : ''}`}>
                        {sub.label}
                      </span>
                      {isSubActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

        </nav>
      </div>
    </aside>
    </>
  );
}
