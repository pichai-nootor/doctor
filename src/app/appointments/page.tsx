'use client';

import { useAppointments } from '@/context/AppointmentContext';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale/th';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('th', th);

export default function AppointmentsPage() {
  const { appointments, deleteAppointment, updateAppointment } = useAppointments();
  
  // Create current month globally for this render in YYYY-MM
  const currentSystemMonth = new Date().toISOString().slice(0, 7); 
  
  const [selectedMonth, setSelectedMonth] = useState(currentSystemMonth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProcedure, setFilterProcedure] = useState('All');
  const [filterDoctor, setFilterDoctor] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const getProcedureLabel = (procedure: string) => {
    if (procedure === 'PCI') return 'Stage PCI';
    return procedure;
  };

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

  const procedures = ['All', 'CAG', 'PCI', 'CAG+/-PCI', 'PPM', 'EPS', 'EPS+/-RFA', 'Other'];

  const formatMonth = (ym: string) => {
    const [y, m] = ym.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    const monthName = date.toLocaleDateString('th-TH', { month: 'long' });
    const thaiYear = parseInt(y) + 543;
    return `${monthName} ${thaiYear}`;
  };

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(apt => {
        const matchesMonth = apt.date.startsWith(selectedMonth);
        const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             apt.caseNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProcedure = filterProcedure === 'All' || apt.procedure === filterProcedure;
        const matchesDoctor = filterDoctor === 'All' || apt.doctor === filterDoctor;
        return matchesMonth && matchesSearch && matchesProcedure && matchesDoctor;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, selectedMonth, searchTerm, filterProcedure, filterDoctor]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE));
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setCurrentPage(1);
  };

  return (
    <main className="container mx-auto px-4 py-4 max-w-7xl animate-in fade-in duration-500">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .print\:hidden { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; max-width: none !important; margin: 0 !important; }
          .bg-slate-50\/50 { background: white !important; }
          .shadow-sm, .shadow-lg { shadow: none !important; }
          .border { border-color: #e2e8f0 !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid #e2e8f0 !important; padding: 8px !important; }
          .load-more-btn { display: none !important; }
        }
      ` }} />
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Month Selection - DatePicker */}
          <div className="relative inline-block datepicker-wrapper w-full sm:w-auto print:hidden">
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
                setCurrentPage(1);
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

          <Link 
            href="/appointments/new" 
            className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <span className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50"></span>
            <span className="relative flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap">New Appointment</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Table Workspace */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Controls Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Schedule ({filteredAppointments.length})</span>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input 
              type="text" 
              placeholder="Search patients or cases..." 
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-emerald-500/20 outline-none placeholder:text-slate-500 text-slate-700 font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                className="flex-1 sm:flex-none px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none text-slate-600 font-bold hover:border-slate-300 transition-all cursor-pointer"
                value={filterProcedure}
                onChange={(e) => handleFilterChange(setFilterProcedure)(e.target.value)}
              >
                <option value="All" className="text-slate-500">All Procedures</option>
                {procedures.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select 
                className="flex-1 sm:flex-none px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none text-slate-600 font-bold hover:border-slate-300 transition-all cursor-pointer"
                value={filterDoctor}
                onChange={(e) => handleFilterChange(setFilterDoctor)(e.target.value)}
              >
                {doctors.map(doc => <option key={doc} value={doc}>{doc === 'All' ? 'All Doctors' : doc}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- Mobile Cards (< md) --- */}
        <div className="md:hidden p-3 bg-slate-50/50 space-y-3 print:hidden">
          {filteredAppointments.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-medium">No appointments found matching your criteria</div>
          ) : (
            paginatedAppointments.map((apt, idx) => {
              const procColorParams = getProcedureColor(apt.procedure).split(' ');
              const stripColor = procColorParams[0] ? procColorParams[0].replace('100', '500') : 'bg-slate-300';
              return (
                <div key={apt.id} className="bg-white rounded-[1.5rem] border border-slate-200 p-4 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${stripColor}`}></div>
                  
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-11 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 leading-none mb-0.5">{new Date(apt.date).toLocaleDateString('th-TH', { month: 'short' })}</span>
                          <span className="text-sm font-black text-slate-700 leading-none">{new Date(apt.date).getDate() || apt.date.split('-')[2]}</span>
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-[15px] leading-tight mb-1">{apt.patientName}</h3>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">Case: {apt.caseNo}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Appt Time</p>
                        <p className="text-[13px] font-black text-slate-700">{apt.timeER} - {apt.timeSet}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Doctor</p>
                        <p className="text-[13px] font-black text-slate-700 truncate">{apt.doctor}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border tracking-tighter shadow-sm ${getProcedureColor(apt.procedure)}`}>
                        {getProcedureLabel(apt.procedure)}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <button 
                          type="button"
                          onClick={async () => {
                            if (apt.postCathStatus === 'pending' || apt.postCathStatus === 'completed') return;
                            try {
                              await updateAppointment(apt.id, { ...apt, postCathStatus: 'pending' });
                            } catch (e) {
                              console.error("Failed to send to Post-Cath", e);
                            }
                          }}
                          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                            apt.postCathStatus === 'pending' || apt.postCathStatus === 'completed'
                              ? 'bg-slate-100 text-slate-400 cursor-default'
                              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                          }`}
                          title="Send to Post-Cath"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <Link 
                          href={`/appointments/view?id=${apt.id}`}
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        </Link>
                        <Link 
                          href={`/appointments/new?copyId=${apt.id}`}
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          title="Copy Appointment"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                            <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2H7a4 4 0 00-4 4v5H5V5z" />
                          </svg>
                        </Link>
                        <Link 
                          href={`/print?id=${apt.id}`}
                          target="_blank"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                        </Link>
                        <Link 
                          href={`/appointments/edit?id=${apt.id}`}
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" clipRule="evenodd" /></svg>
                        </Link>
                        <button 
                          type="button"
                          onClick={() => {
                            setPendingDeleteId(apt.id);
                            setDeleteConfirmOpen(true);
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- Desktop Table (>= md) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[10px] uppercase tracking-widest font-bold text-slate-400 whitespace-nowrap">
                <th className="px-5 py-3">Date/Time</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3 text-center">Procedure</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3 text-right print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">No appointments found matching your criteria</td>
                </tr>
              ) : (
                paginatedAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-10 border border-slate-200 rounded bg-white flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-slate-400 leading-none mb-0.5">{new Date(apt.date).toLocaleDateString('th-TH', { month: 'short' })}</span>
                          <span className="text-sm font-black text-slate-700 leading-none">{new Date(apt.date).getDate() || apt.date.split('-')[2]}</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-[13px]">{new Date(apt.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{apt.timeER} - {apt.timeSet}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="font-bold text-slate-800 text-[13px]">{apt.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-bold">Case: {apt.caseNo}</div>
                    </td>
                    <td className="px-5 py-2.5 text-center">
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border tracking-tighter ${getProcedureColor(apt.procedure)}`}>
                        {getProcedureLabel(apt.procedure)}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-bold text-slate-700 text-[13px]">{apt.doctor}</td>
                    <td className="px-5 py-2.5 text-right space-x-1 print:hidden">
                      {[
                        { 
                          onClick: async () => {
                            if (apt.postCathStatus === 'pending' || apt.postCathStatus === 'completed') return;
                            await updateAppointment(apt.id, { ...apt, postCathStatus: 'pending' });
                          },
                          icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z", 
                          color: apt.postCathStatus === 'pending' || apt.postCathStatus === 'completed' ? "slate" : "indigo",
                          title: "Send to Post-Cath",
                          disabled: apt.postCathStatus === 'pending' || apt.postCathStatus === 'completed'
                        },
                        { href: `/appointments/view?id=${apt.id}`, icon: "M10 12a2 2 0 100-4 2 2 0 000 4z M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z", color: "blue", title: "View" },
                        { href: `/appointments/new?copyId=${apt.id}`, icon: "M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z M5 5a2 2 0 012-2h6a2 2 0 012 2v2H7a4 4 0 00-4 4v5H5V5z", color: "emerald", title: "คัดลอกนัด (Copy)" },
                        { href: `/print?id=${apt.id}`, icon: "M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z", color: "emerald", target: "_blank", title: "Print" },
                        { href: `/appointments/edit?id=${apt.id}`, icon: "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z", color: "amber", title: "Edit" }
                      ].map((action: any, i) => {
                        if (action.href) {
                          const linkAction = action as { href: string; icon: string; color: string; target?: string; title?: string };
                          return (
                            <Link 
                              key={i}
                              href={linkAction.href}
                              target={linkAction.target}
                              title={linkAction.title}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-${linkAction.color}-600 hover:bg-${linkAction.color}-50 transition-all border border-transparent hover:border-${linkAction.color}-100`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d={linkAction.icon} clipRule="evenodd" />
                              </svg>
                            </Link>
                          );
                        } else {
                          const btnAction = action as { onClick: () => void; icon: string; color: string; title: string; disabled: boolean };
                          return (
                            <button 
                              key={i}
                              type="button"
                              onClick={btnAction.onClick}
                              disabled={btnAction.disabled}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-md transition-all border border-transparent 
                                ${btnAction.disabled 
                                  ? 'text-slate-300 cursor-default bg-slate-50' 
                                  : `text-slate-400 hover:text-${btnAction.color}-600 hover:bg-${btnAction.color}-50 hover:border-${btnAction.color}-100`
                                }`}
                              title={btnAction.title}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d={btnAction.icon} clipRule="evenodd" />
                              </svg>
                            </button>
                          );
                        }
                      })}
                      <button 
                        type="button"
                        onClick={() => {
                          setPendingDeleteId(apt.id);
                          setDeleteConfirmOpen(true);
                        }}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
              แสดง {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredAppointments.length)} จาก {filteredAppointments.length} รายการ
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >← ก่อนหน้า</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                    page === currentPage
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                  }`}
                >{page}</button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >ถัดไป →</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={deleteConfirmOpen}
        title="ลบข้อมูลการนัดหมาย?"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบการนัดหมายนี้? ข้อมูลจะถูกลบออกจากระบบอย่างถาวร"
        confirmText="ยืนยันการลบ"
        cancelText="ยกเลิก"
        isDestructive={true}
        isLoading={isDeleteLoading}
        onConfirm={async () => {
          if (pendingDeleteId) {
            setIsDeleteLoading(true);
            try {
              await deleteAppointment(pendingDeleteId);
              setDeleteConfirmOpen(false);
              setPendingDeleteId(null);
            } catch (error) {
              console.error("Delete failed:", error);
            } finally {
              setIsDeleteLoading(false);
            }
          }
        }}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </main>
  );
}
