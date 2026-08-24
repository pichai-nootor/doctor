'use client';

import { useAppointments } from '@/context/AppointmentContext';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale/th';
import "react-datepicker/dist/react-datepicker.css";
import ConfirmModal from '@/components/ConfirmModal';

registerLocale('th', th);

export default function PostCathPage() {
  const { appointments, updateAppointment } = useAppointments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState<{isOpen: boolean, targetAppId: string | null}>({
    isOpen: false,
    targetAppId: null
  });

  const currentSystemMonth = new Date().toISOString().slice(0, 7); 
  const [selectedMonth, setSelectedMonth] = useState(currentSystemMonth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProcedure, setFilterProcedure] = useState('All');
  const [filterDoctor, setFilterDoctor] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const doctors = useMemo(() => {
    return ['All', ...Array.from(new Set(appointments.map(a => a.doctor).filter(Boolean)))];
  }, [appointments]);

  const procedures = [
    'All', 'CAG', 'CAG + PCI', 'CAG + POBA', 'Eps', 
    'Eps + RFA (2D)', 'EPS + RFA (3D)', 'Insertion device', 
    'PPM', 'AICD', 'CRT - D'
  ];

  const pendingCases = useMemo(() => {
    return appointments.filter(a => a.postCathStatus === 'pending');
  }, [appointments]);

  const completedCases = useMemo(() => {
    return appointments.filter(a => {
        const matchesStatus = a.postCathStatus === 'completed';
        const matchesMonth = a.date.startsWith(selectedMonth);
        const matchesSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             a.caseNo.toLowerCase().includes(searchTerm.toLowerCase());
        const proc = a.postCathData?.procedure || a.procedure;
        const matchesProcedure = filterProcedure === 'All' || proc === filterProcedure;
        const matchesDoctor = filterDoctor === 'All' || a.doctor === filterDoctor;
        return matchesStatus && matchesMonth && matchesSearch && matchesProcedure && matchesDoctor;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, selectedMonth, searchTerm, filterProcedure, filterDoctor]);

  const totalPages = Math.ceil(completedCases.length / itemsPerPage);
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return completedCases.slice(start, start + itemsPerPage);
  }, [completedCases, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to first page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, searchTerm, filterProcedure, filterDoctor]);

  const formatMonth = (ym: string) => {
    const [y, m] = ym.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    const monthName = date.toLocaleDateString('th-TH', { month: 'long' });
    const thaiYear = parseInt(y) + 543;
    return `${monthName} ${thaiYear}`;
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in duration-500">
      
      {/* Pending Queue Section */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">Pending Queue</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cases awaiting procedure records ({pendingCases.length})</p>
          </div>
        </div>

        {pendingCases.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <p className="text-slate-400 font-bold">No pending cases. All records are up to date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingCases.map(app => (
              <div key={app.id} className="group bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-[4rem] group-hover:scale-125 transition-transform duration-500 translate-x-4 -translate-y-4" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-700 font-black text-sm">
                        {new Date(app.date).getDate()}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-sm leading-tight">{app.patientName}</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Case: {app.caseNo}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2 opacity-70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span className="text-[11px] font-bold text-slate-600">{app.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span className="text-[11px] font-bold text-slate-600">{app.procedure}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/post-cath/record?id=${app.id}`}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Record Results
                    </Link>
                    <button 
                      onClick={async () => {
                        try {
                          await updateAppointment(app.id, { ...app, postCathStatus: 'none' });
                        } catch (e) {
                          console.error("Failed to return to appointments", e);
                        }
                      }}
                      className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                      title="Return to Appointments"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed History Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">Post-Cath History</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed procedure records</p>
            </div>
          </div>

          {/* Month Picker */}
          <div className="relative inline-block datepicker-wrapper w-full sm:w-auto">
            <style dangerouslySetInnerHTML={{ __html: `
              .datepicker-wrapper .react-datepicker-wrapper { display: block; width: 100%; }
            .datepicker-wrapper .react-datepicker__month-wrapper { display: flex; justify-content: space-around; margin: 4px 0; }
            .datepicker-wrapper .react-datepicker__month-text { padding: 8px 12px; border-radius: 8px; width: auto; margin: 0; font-weight: bold; }
            .datepicker-wrapper .react-datepicker__month-text:hover { background-color: #f1f5f9; }
            .datepicker-wrapper .react-datepicker__month-text--keyboard-selected { background-color: #10b981; color: white; }
            .datepicker-wrapper .react-datepicker { border-radius: 12px; border: 1px solid #e2e8f0; font-family: inherit; font-size: 14px; padding: 8px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
            .datepicker-wrapper .react-datepicker__header { background-color: transparent; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
            .datepicker-wrapper .react-datepicker__current-month { font-size: 16px; font-weight: 800; color: #334155; }
            .datepicker-wrapper .react-datepicker__navigation { top: 12px; }
            .datepicker-wrapper .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle { fill: white; color: white; }
          ` }} />
            <DatePicker
              selected={new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]) - 1, 1)}
              onChange={(date: Date | null) => {
                if (date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  setSelectedMonth(`${y}-${m}`);
                }
              }}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
              locale="th"
              customInput={
                <button className="flex justify-between items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:border-emerald-300 transition-all shadow-sm focus:ring-2 focus:ring-emerald-500/20 group w-full sm:w-auto">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[14px] whitespace-nowrap">{formatMonth(selectedMonth)}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              }
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          {/* Controls Bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Records ({completedCases.length})</span>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input 
                type="text" 
                placeholder="Search patients or cases..." 
                className="px-4 py-2 text-[13px] bg-white border border-slate-200 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-emerald-500/20 outline-none placeholder:text-slate-500 text-slate-700 font-medium transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <select 
                  className="flex-1 sm:flex-none px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg outline-none text-slate-600 font-bold hover:border-slate-300 transition-all cursor-pointer"
                  value={filterProcedure}
                  onChange={(e) => setFilterProcedure(e.target.value)}
                >
                  <option value="All" className="text-slate-500">All Procedures</option>
                  {procedures.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select 
                  className="flex-1 sm:flex-none px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg outline-none text-slate-600 font-bold hover:border-slate-300 transition-all cursor-pointer"
                  value={filterDoctor}
                  onChange={(e) => setFilterDoctor(e.target.value)}
                >
                  {doctors.map(doc => <option key={doc} value={doc}>{doc === 'All' ? 'All Doctors' : doc}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {paginatedCases.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold">No completed cases found for this month</div>
            ) : (
              paginatedCases.map(app => (
                <div key={app.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex flex-col items-center justify-center shrink-0 border border-emerald-100 font-black shadow-sm">
                         <span className="text-[10px] uppercase leading-none mb-0.5">{new Date(app.date).toLocaleDateString('th-TH', { month: 'short' })}</span>
                         <span className="text-sm leading-none">{new Date(app.date).getDate()}</span>
                       </div>
                       <div>
                         <div className="font-black text-slate-900 text-[13px]">{app.patientName}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-80">Case: {app.caseNo}</div>
                       </div>
                     </div>
                     <div className="flex items-center gap-1">
                        <Link
                          href={`/post-cath/view?id=${app.id}`}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="ดูรายละเอียด"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/post-cath/record?id=${app.id}&edit=true`}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="แก้ไขข้อมูล"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => {
                            setConfirmModalState({ isOpen: true, targetAppId: app.id });
                          }}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="ลบข้อมูลและส่งกลับไปที่ Appointments"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Procedure</p>
                       <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/60">
                         <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-tight">{app.postCathData?.procedure || app.procedure}</span>
                         {app.postCathData?.procedureRemark && (
                           <div className="relative group flex items-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 hover:text-amber-500 cursor-help transition-colors" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                             </svg>
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] sm:max-w-xs bg-slate-800 text-white text-xs font-normal rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl break-words whitespace-normal text-center">
                                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">หมายเหตุ</span>
                                {app.postCathData.procedureRemark}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                             </div>
                           </div>
                         )}
                       </div>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Doctor</p>
                       <span className="text-[12px] font-bold text-slate-600">Dr. {app.doctor}</span>
                     </div>
                  </div>

                  <div className="mb-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lesions</p>
                     <div className="flex flex-wrap gap-1.5">
                       {app.postCathData?.lesions && app.postCathData.lesions.length > 0 ? app.postCathData.lesions.map(l => (
                         <span key={l} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-md border border-blue-100 uppercase shadow-sm">{l}</span>
                       )) : <span className="text-[11px] text-slate-400 font-medium">-</span>}
                     </div>
                  </div>

                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommendations</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {app.postCathData?.recommendations && app.postCathData.recommendations.length > 0 ? app.postCathData.recommendations.map((r, idx) => (
                          <span key={r} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded-md border border-purple-100 shadow-sm">
                            {r}
                            {idx === (app.postCathData?.recommendations?.length || 0) - 1 && app.postCathData?.remark && (
                              <span className="ml-1 font-medium">{app.postCathData.remark}</span>
                            )}
                          </span>
                        )) : app.postCathData?.remark ? (
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded-md border border-purple-100 shadow-sm">
                            <span className="font-medium">{app.postCathData.remark}</span>
                          </span>
                        ) : <span className="text-[11px] text-slate-400 font-medium">-</span>}
                      </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-widest font-black text-[10px] text-slate-400">
                  <tr>
                    <th className="px-6 py-4 w-1/4">Patient Info</th>
                    <th className="px-6 py-4">Procedure</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Lesions</th>
                    <th className="px-6 py-4">Recommendations</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCases.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-400 font-bold">No completed cases found for this month</td>
                    </tr>
                  ) : (
                    paginatedCases.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex flex-col items-center justify-center shrink-0 border border-emerald-100 font-black shadow-sm">
                               <span className="text-[10px] uppercase leading-none mb-0.5">{new Date(app.date).toLocaleDateString('th-TH', { month: 'short' })}</span>
                               <span className="text-sm leading-none">{new Date(app.date).getDate()}</span>
                             </div>
                             <div>
                               <div className="font-black text-slate-900 text-[13px]">{app.patientName}</div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-80">Case: {app.caseNo}</div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/60">
                            <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-tight">{app.postCathData?.procedure || app.procedure}</span>
                            {app.postCathData?.procedureRemark && (
                              <div className="relative group flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 hover:text-amber-500 cursor-help transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] sm:max-w-xs bg-slate-800 text-white text-xs font-normal rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl break-words whitespace-normal text-center">
                                   <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">หมายเหตุ</span>
                                   {app.postCathData.procedureRemark}
                                   <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                             <span className="text-[12px] font-bold text-slate-600 whitespace-nowrap">Dr. {app.doctor}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-1.5">
                            {app.postCathData?.lesions.map(l => (
                              <span key={l} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-md border border-blue-100 uppercase shadow-sm">{l}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {app.postCathData?.recommendations && app.postCathData.recommendations.length > 0 ? app.postCathData.recommendations.map((r, idx) => (
                              <span key={r} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded-md border border-purple-100 shadow-sm">
                                {r}
                                {idx === (app.postCathData?.recommendations?.length || 0) - 1 && app.postCathData?.remark && (
                                  <span className="ml-1 font-medium">{app.postCathData.remark}</span>
                                )}
                              </span>
                            )) : app.postCathData?.remark ? (
                              <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded-md border border-purple-100 shadow-sm">
                                <span className="font-medium">{app.postCathData.remark}</span>
                              </span>
                            ) : <span className="text-[11px] text-slate-400 font-medium">-</span>}
                          </div>
                        </td>
                        <td className="px-6 py-5 border-l border-slate-50">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/post-cath/view?id=${app.id}`}
                              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="ดูรายละเอียด"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <Link
                              href={`/post-cath/record?id=${app.id}&edit=true`}
                              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="แก้ไขข้อมูล"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => {
                                setConfirmModalState({ isOpen: true, targetAppId: app.id });
                              }}
                              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="ลบข้อมูลและส่งกลับไปที่ Appointments"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
                  แสดง {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, completedCases.length)} จาก {completedCases.length} รายการ
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >← ก่อนหน้า</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                        page === currentPage
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                          : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                      }`}
                    >{page}</button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >ถัดไป →</button>
                </div>
              </div>
            )}
        </div>
      </section>

      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title="ยืนยันการลบข้อมูล"
        message="คุณต้องการลบข้อมูลนี้และส่งกลับไปที่ Appointments ใช่หรือไม่?"
        confirmText="ใช่, ส่งกลับ"
        cancelText="ยกเลิก"
        isDestructive={true}
        onConfirm={async () => {
          if (confirmModalState.targetAppId) {
            const app = appointments.find(a => a.id === confirmModalState.targetAppId);
            if (app) {
              try {
                const { postCathData, ...restApp } = app;
                await updateAppointment(app.id, { ...restApp, postCathStatus: 'none' });
              } catch (e) {
                console.error("Failed to delete and return to appointments", e);
              }
            }
          }
          setConfirmModalState({ isOpen: false, targetAppId: null });
        }}
        onCancel={() => setConfirmModalState({ isOpen: false, targetAppId: null })}
      />

    </main>
  );
}
