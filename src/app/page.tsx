'use client';

import { useAppointments } from '@/context/AppointmentContext';
import { useState, useMemo } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale/th';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('th', th);

export default function Home() {
  const { appointments, deleteAppointment } = useAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProcedure, setFilterProcedure] = useState('All');
  const [filterDoctor, setFilterDoctor] = useState('All');
  const [visibleCount, setVisibleCount] = useState(15);

  const getProcedureColor = (procedure: string) => {
    switch(procedure) {
      case 'CAG+/-PCI': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'CAG': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PCI': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'PPM': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'EPS': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const doctors = useMemo(() => {
    return ['All', ...Array.from(new Set(appointments.map(a => a.doctor).filter(Boolean)))];
  }, [appointments]);

  const procedures = ['All', 'CAG', 'PCI', 'CAG+/-PCI', 'PPM', 'EPS', 'Other'];

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(apt => {
        const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             apt.caseNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProcedure = filterProcedure === 'All' || apt.procedure === filterProcedure;
        const matchesDoctor = filterDoctor === 'All' || apt.doctor === filterDoctor;
        return matchesSearch && matchesProcedure && matchesDoctor;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, searchTerm, filterProcedure, filterDoctor]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      todayCount: appointments.filter(a => a.date === today).length,
      totalCount: appointments.length
    };
  }, [appointments]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const formatMonth = (ym: string) => {
    const [y, m] = ym.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    const monthName = date.toLocaleDateString('th-TH', { month: 'long' });
    const thaiYear = parseInt(y) + 543;
    return `${monthName} ${thaiYear}`;
  };

  const monthlySummary = useMemo(() => {
    const totalMonth = appointments.filter(a => a.postCathStatus === 'completed' && a.date.startsWith(selectedMonth));
    const stats: Record<string, { total: number, procedures: Record<string, number> }> = {};
    
    totalMonth.forEach(a => {
      const doc = a.doctor || 'Unknown';
      const proc = a.postCathData?.procedure || a.procedure || 'Unknown';
      if (!stats[doc]) stats[doc] = { total: 0, procedures: {} };
      stats[doc].total++;
      stats[doc].procedures[proc] = (stats[doc].procedures[proc] || 0) + 1;
    });
    
    // Calculate procedure-wise total for the chart
    const procedureStats: Record<string, number> = {};
    totalMonth.forEach(a => {
      const proc = a.postCathData?.procedure || a.procedure || 'Unknown';
      procedureStats[proc] = (procedureStats[proc] || 0) + 1;
    });
    
    return {
      totalCases: totalMonth.length,
      doctorStats: stats,
      procedureStats: Object.entries(procedureStats).sort((a, b) => b[1] - a[1])
    };
  }, [appointments, selectedMonth]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      {/* Stats Cards - Real Data Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-[24px] p-8 flex items-center gap-6 shadow-[0_2px_15px_rgb(0,0,0,0.02)] border border-[#f1f5f9]/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-[16px] bg-[#f0f9ff] flex items-center justify-center text-[#0ea5e9] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#64748b]">Today&apos;s Cases</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[32px] font-black text-[#0f172a] leading-none">{stats.todayCount}</span>
              <span className="text-[11px] font-bold text-[#0ea5e9] bg-[#f0f9ff] px-2.5 py-1 rounded-full">Live</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-8 flex items-center gap-6 shadow-[0_2px_15px_rgb(0,0,0,0.02)] border border-[#f1f5f9]/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-[16px] bg-[#ecfdf5] flex items-center justify-center text-[#10b981] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#64748b]">Total Patients</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[32px] font-black text-[#0f172a] leading-none">{stats.totalCount}</span>
              <span className="text-[11px] font-bold text-[#10b981] bg-[#ecfdf5] px-2.5 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Operations Overview (Out of the box redesign) */}
      <div className="mt-16 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-5">
            <div className="w-2 h-14 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.2)]"></div>
            <div>
              <h2 className="text-[32px] font-black text-[#0f172a] tracking-tight leading-none mb-2">Clinical Operations <span className="text-blue-600">Analytics</span></h2>
              <p className="text-[13px] font-bold text-[#64748b] uppercase tracking-[0.25em]">Hospital Procedure Performance</p>
            </div>
          </div>
          
          <div className="relative z-20">
            <style dangerouslySetInnerHTML={{ __html: `
              .datepicker-modern .react-datepicker-wrapper { display: block; width: 100%; }
              .datepicker-modern .react-datepicker { border-radius: 24px; border: 1px solid #e2e8f0; font-family: inherit; font-size: 14px; padding: 16px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
              .datepicker-modern .react-datepicker__header { background-color: transparent; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; }
              .datepicker-modern .react-datepicker__current-month { font-size: 18px; font-weight: 800; color: #0f172a; }
              .datepicker-modern .react-datepicker__month-wrapper { display: flex; justify-content: space-around; margin: 8px 0; gap: 8px; }
              .datepicker-modern .react-datepicker__month-text { padding: 12px 16px; border-radius: 12px; width: auto; margin: 0; font-weight: bold; transition: all 0.2s; }
              .datepicker-modern .react-datepicker__month-text:hover { background-color: #f0f9ff; color: #0ea5e9; }
              .datepicker-modern .react-datepicker__month-text--keyboard-selected { background-color: #0ea5e9; color: white; }
              .datepicker-modern .react-datepicker__navigation { top: 20px; }
            ` }} />
             <div className="datepicker-modern">
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
                  <button className="flex items-center gap-4 px-6 py-4 bg-white border border-[#e2e8f0] rounded-[20px] text-[#334155] font-black hover:border-blue-300 hover:shadow-[0_8px_25px_rgba(59,130,246,0.15)] transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-[0_2px_10px_rgba(59,130,246,0.1)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[15px] tracking-wide">{formatMonth(selectedMonth)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#cbd5e1] group-hover:text-blue-500 transition-colors ml-1" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                }
              />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Procedure Distribution - Clean Minimalist Widget */}
          <div className="xl:col-span-1 bg-white p-8 rounded-[36px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-shadow duration-500 relative overflow-hidden group flex flex-col justify-between border border-[#e2e8f0]/60 h-fit xl:sticky xl:top-8">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#f1f5f9]">
                <h3 className="text-[14px] font-black text-[#0f172a] uppercase tracking-[0.2em] leading-[1.6]">
                  Procedure
                </h3>
                <span className="px-4 py-2 rounded-full bg-[#f0f9ff] text-[#0ea5e9] text-[9px] font-bold uppercase tracking-[0.2em]">Monthly</span>
              </div>
              
              <div className="space-y-7">
                {monthlySummary.procedureStats.length === 0 ? (
                  <p className="text-sm font-bold text-[#94a3b8] italic py-10 text-center">No data available for this month</p>
                ) : (
                  monthlySummary.procedureStats.map(([proc, count]) => (
                    <div key={proc} className="space-y-3">
                      <div className="flex justify-between items-end text-[12px] font-bold uppercase tracking-wider">
                        <span className="text-[#475569]">{proc}</span>
                        <div className="flex items-baseline gap-1.5">
                           <span className="text-[#0f172a] text-[16px] font-black">{count}</span>
                           <span className="text-[#10b981] text-[9px] font-bold uppercase tracking-widest">CASES</span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-emerald-400 rounded-full transition-all duration-1000 relative"
                          style={{ width: `${(count / monthlySummary.totalCases) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-[#f1f5f9] relative z-10">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                   <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">Aggregate Summary</p>
                   <p className="text-[13px] font-semibold text-[#475569]">Total Clinical Procedures</p>
                </div>
                <div className="text-right">
                   <span className="text-[36px] font-black text-[#0f172a] leading-none tracking-tight">{monthlySummary.totalCases}</span>
                   <p className="text-[10px] font-bold text-[#10b981] uppercase tracking-widest mt-1">Confirmed Cases</p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Performance Cards - Vibrant & Modern */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {Object.keys(monthlySummary.doctorStats).length === 0 ? (
               <div className="col-span-full bg-white border border-[#e2e8f0] rounded-[36px] flex items-center justify-center py-24 shadow-sm">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#f8fafc] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#cbd5e1]">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                       </svg>
                    </div>
                    <p className="text-[#94a3b8] font-bold">ไม่มีข้อมูลสถิติในเดือนนี้</p>
                  </div>
               </div>
            ) : (
              Object.entries(monthlySummary.doctorStats).map(([doc, stats], idx) => (
                <div key={doc} className="group bg-white rounded-[32px] p-8 border border-[#f1f5f9] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden h-fit self-start">
                   {/* Decorative Accent */}
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#f0f9ff] rounded-bl-[100px] -mr-8 -mt-8 opacity-50 group-hover:bg-blue-50 transition-colors"></div>
                   
                   <div className="relative z-10 flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-[56px] h-[56px] rounded-[20px] bg-[#f8fafc] border-[2px] border-white shadow-sm flex items-center justify-center text-[#94a3b8] shrink-0 group-hover:bg-white group-hover:border-blue-100 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#64748b] group-hover:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                         </div>
                         <div>
                            <h4 className="text-[19px] font-black text-[#0f172a] leading-tight mb-1">{doc}</h4>
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.1em]">Attending Physician</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="text-[28px] font-black text-[#0f172a] leading-none mb-1 block">{stats.total}</span>
                         <span className="text-[9px] font-black text-[#10b981] uppercase tracking-[0.2em] bg-emerald-50 px-2 py-0.5 rounded-md">Cases</span>
                      </div>
                   </div>

                   <div className="relative z-10 space-y-4">
                      <div>
                         <div className="flex items-center justify-between mb-3">
                            <h5 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">Clinical Breakdown</h5>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {Object.entries(stats.procedures).map(([proc, count]) => (
                               <div key={proc} className="flex items-center gap-3 py-2 px-4 rounded-[14px] bg-[#f8fafc] border border-[#f1f5f9] group-hover:border-blue-50 transition-colors">
                                  <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wide">{proc}</span>
                                  <span className="w-px h-3 bg-slate-200"></span>
                                  <span className="text-[13px] font-bold text-blue-600">{count}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
