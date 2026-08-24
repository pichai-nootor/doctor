'use client';

import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useCathLab } from '@/context/CathLabContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';


export default function TopBar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useCathLab();
  const { user } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const getPageHeader = () => {
    // Normalize pathname to handle trailing slashes
    const path = pathname.replace(/\/$/, '') || '/';

    if (path === '/') return { title: 'Dashboard', subtitle: 'Overview of hospital operations' };
    if (path === '/cath-lab') return { title: 'Cath Lab', subtitle: 'Manage cardiovascular procedures' };
    if (path === '/appointments') return { title: 'Appointments', subtitle: 'Manage all patient procedures' };
    if (path === '/post-cath') return { title: 'Post-Cath', subtitle: 'Procedure results and recovery tracking' };
    if (path.includes('/appointments/new')) return { title: 'New Appointment', subtitle: 'Schedule a new patient procedure' };
    if (path.includes('/appointments/edit')) return { title: 'Edit Appointment', subtitle: 'Update patient procedure details' };
    if (path.includes('/appointments/view')) return { title: 'View Appointment', subtitle: 'View patient procedure details' };
    if (path.includes('/print')) return { title: 'Print Preview', subtitle: 'Document generation' };
    if (path === '/medications') return { title: 'Master Data : Medications', subtitle: 'Manage medicine inventory and prices' };
    if (path === '/dosages') return { title: 'Master Data : Dosages', subtitle: 'Manage standard dosage instructions' };
    return { title: 'Management System', subtitle: 'System Control Panel' };
  };

  const userEmail = user?.email || 'User';
  const initial = userEmail.charAt(0).toUpperCase();
  const header = getPageHeader();

  return (
    <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-3 md:space-x-4">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-1.5 md:p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate max-w-[200px] md:max-w-[400px] leading-none mb-0.5 mt-0.5">
            {header.title}
          </h1>
          <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block truncate">
            {header.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 md:p-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-all relative border border-transparent hover:border-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="w-px h-6 bg-slate-200 hidden md:block"></div>

          {/* User Profile */}
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center space-x-3 hover:bg-slate-100 p-1.5 md:p-2 rounded-xl transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-emerald-500 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center relative text-white font-black text-xs">
               {initial}
               <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-full"></div>
            </div>
            <div className="hidden md:block text-sm text-left">
              <p className="font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors truncate max-w-[150px]">{userEmail}</p>
              <p className="text-slate-500 text-xs font-medium">Logged in (Sign Out)</p>
            </div>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="ออกจากระบบ?"
        message="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบบัญชีปัจจุบัน?"
        onConfirm={handleSignOut}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="ลงชื่อออก"
        cancelText="ยกเลิก"
        isDestructive={true}
        isLoading={isLoggingOut}
      />
    </header>
  );
}
