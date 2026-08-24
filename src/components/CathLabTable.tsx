'use client';

import { useCathLab } from '@/context/CathLabContext';
import { PriorityType, PayerType } from '@/types/cathlab';
import { useState, useMemo } from 'react';
import CathLabDetail from './CathLabDetail';
import ConfirmModal from './ConfirmModal';

interface CathLabTableProps {
  onEdit: (id: string) => void;
  onAddNew?: () => void;
}

export default function CathLabTable({ onEdit, onAddNew }: CathLabTableProps) {
  const { procedures, deleteProcedure } = useCathLab();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const selectedProcedure = useMemo(() => {
    return procedures.find(p => p.id === selectedProcedureId);
  }, [procedures, selectedProcedureId]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredProcedures = useMemo(() => {
    return procedures.filter(p => {
      const date = new Date(p.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).sort((a, b) => a.seq - b.seq);
  }, [procedures, currentMonth, currentYear]);

  const getPriorityStyle = (priority: PriorityType) => {
    switch (priority) {
      case 'Elective': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Urgent': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Emergency': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityDot = (priority: PriorityType) => {
    switch (priority) {
      case 'Elective': return 'bg-emerald-500';
      case 'Urgent': return 'bg-amber-500';
      case 'Emergency': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getPayerStyle = (payer: PayerType) => {
    switch (payer) {
      case 'UCEP': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Cash': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ── Control Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-2 px-1">
        {/* Left: view toggle + month label */}
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-sm self-start">
          <div className="flex items-center space-x-1 bg-slate-100/50 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Grid
            </button>
          </div>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <span className="text-sm font-black text-slate-700 px-2 tracking-tight">
            {months[currentMonth]} {currentYear + 543}
          </span>
        </div>

        {/* Right: month nav + add */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-sm">
            <button
              onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="px-4 py-1.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{months[currentMonth]}</span>
            </div>
            <button
              onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-black text-xs transition-all active:scale-95 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-emerald-400/40 hover:scale-[1.03]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Add New Case</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[
          { label: 'Total', value: filteredProcedures.length, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
          { label: 'Elective', value: filteredProcedures.filter(p => p.priority === 'Elective').length, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Urgent', value: filteredProcedures.filter(p => p.priority === 'Urgent').length, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Emergency', value: filteredProcedures.filter(p => p.priority === 'Emergency').length, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
          { label: 'Confirmed', value: filteredProcedures.filter(p => p.isConfirmed).length, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-2xl px-2 py-2.5 text-center`}>
            <p className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${stat.color} opacity-70 mt-0.5 leading-tight`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      {viewMode === 'table' ? (
        <>
          {/* ─── MOBILE CARD LIST (< lg) ─── */}
          <div className="lg:hidden space-y-3 animate-in fade-in duration-400">
            {filteredProcedures.length === 0 ? (
              <div className="py-24 flex flex-col items-center gap-3 bg-white rounded-3xl border border-dashed border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-slate-400 font-bold text-sm">ไม่พบข้อมูลในเดือนนี้</p>
              </div>
            ) : (
              filteredProcedures.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProcedureId(p.id)}
                  className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
                >
                  {/* Card top accent strip by priority */}
                  <div className={`h-1 w-full ${getPriorityDot(p.priority)}`} />

                  <div className="p-4">
                    {/* Row 1: seq + name + priority badge */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Seq circle */}
                      <div className="shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-black text-slate-500">{p.seq}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 text-sm leading-tight truncate">{p.patientName}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-tight ${getPriorityStyle(p.priority)}`}>
                            {p.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-tight ${getPayerStyle(p.payer)}`}>
                            {p.payer}
                          </span>
                          {p.isConfirmed && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Confirmed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Age pill */}
                      {p.age && (
                        <div className="shrink-0 px-2 py-1 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <p className="text-[9px] font-bold text-slate-400 leading-none">AGE</p>
                          <p className="text-xs font-black text-slate-700">{p.age}</p>
                        </div>
                      )}
                    </div>

                    {/* Row 2: info pills grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {/* Date + time */}
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">📅 Date / Time</p>
                        <p className="text-xs font-black text-slate-700">
                          {new Date(p.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">Appt: {p.appointmentTime}</p>
                      </div>

                      {/* Procedure */}
                      <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-100">
                        <p className="text-[9px] font-bold text-amber-500 uppercase mb-0.5">🔬 Procedure</p>
                        <p className="text-xs font-black text-amber-700 leading-tight">{p.procedure}</p>
                      </div>

                      {/* Doctor */}
                      <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                        <p className="text-[9px] font-bold text-emerald-500 uppercase mb-0.5">👨‍⚕️ Physician</p>
                        <p className="text-xs font-black text-emerald-700 truncate">{p.doctor}</p>
                      </div>

                      {/* Refer / CaseStatus */}
                      <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-100">
                        <p className="text-[9px] font-bold text-rose-400 uppercase mb-0.5">🏥 Refer</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          <p className="text-xs font-black text-rose-600 uppercase truncate">{p.referralSource}</p>
                          {p.caseStatus && (
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                              p.caseStatus === 'ได้'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}>{p.caseStatus}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remark */}
                    {p.remark && (
                      <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 mb-3">
                        <p className="text-[9px] font-bold text-orange-400 uppercase mb-0.5">📝 Remark</p>
                        <p className="text-xs font-bold text-orange-700 italic">{p.remark}</p>
                      </div>
                    )}

                    {/* Actions row */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedProcedureId(p.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-[11px] font-black shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(p.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-black shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setPendingDeleteId(p.id);
                          setDeleteConfirmOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-[11px] font-black shadow-sm hover:bg-red-600 active:scale-95 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Del
                      </button>
                    </div>
                  </div>

                  {/* Bottom index indicator */}
                  <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 flex justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">#{idx + 1} of {filteredProcedures.length}</span>
                    <span className="text-[9px] font-bold text-slate-400">Set: {p.setTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ─── DESKTOP TABLE (≥ lg) ─── */}
          <div className="hidden lg:block bg-white rounded-3xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-500 overflow-hidden flex flex-col max-h-[calc(100vh-160px)]">
            <div className="bg-[#b4d6a1] py-3 text-center border-b border-slate-300 shrink-0 sticky top-0 z-30">
              <h1 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
                Cath Lab Procedure Schedule • {months[currentMonth]} {currentYear + 543}
              </h1>
            </div>

            <div className="overflow-auto flex-1 relative">
              <table className="w-full text-left border-collapse min-w-[1400px]">
                <thead className="sticky top-0 z-20 bg-[#cfd9f1] shadow-sm">
                  <tr className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                    <th className="px-4 py-4 text-center bg-[#cfd9f1]">Date</th>
                    <th className="px-2 py-4 text-center bg-[#cfd9f1]">No.</th>
                    <th className="px-3 py-4 text-center bg-[#cfd9f1]">Appt</th>
                    <th className="px-3 py-4 text-center bg-[#cfd9f1]">Set</th>
                    <th className="px-4 py-4 bg-[#cfd9f1]">Patient Name</th>
                    <th className="px-2 py-4 text-center bg-[#cfd9f1]">Age</th>
                    <th className="px-4 py-4 text-center bg-[#cfd9f1]">Priority</th>
                    <th className="px-4 py-4 text-center bg-[#cfd9f1]">Physician</th>
                    <th className="px-4 py-4 text-center bg-[#cfd9f1]">Payer</th>
                    <th className="px-4 py-4 text-center bg-[#cfd9f1]">Refer</th>
                    <th className="px-3 py-4 text-center bg-[#cfd9f1]">ค่าส่ง</th>
                    <th className="px-4 py-4 text-center bg-[#cfd9f1]">Procedure</th>
                    <th className="px-3 py-4 text-center bg-[#cfd9f1]">Confirm</th>
                    <th className="px-4 py-4 bg-[#cfd9f1]">Remark</th>
                    <th className="px-4 py-4 text-center bg-[#cfd9f1]">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[12px] font-bold text-slate-700 divide-y divide-slate-100">
                  {filteredProcedures.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="py-24 text-center text-slate-400 font-medium bg-slate-50/30 italic">No procedures found for this period</td>
                    </tr>
                  ) : (
                    filteredProcedures.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                        onClick={() => setSelectedProcedureId(p.id)}
                      >
                        <td className="px-4 py-3 text-center whitespace-nowrap bg-red-50/30">
                          {new Date(p.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-2 py-3 text-center text-slate-400 font-black">{p.seq}</td>
                        <td className="px-3 py-3 text-center">{p.appointmentTime}</td>
                        <td className="px-3 py-3 text-center text-blue-600 italic">&quot;{p.setTime}&quot;</td>
                        <td className="px-4 py-3 font-black text-slate-900">{p.patientName}</td>
                        <td className="px-2 py-3 text-center">{p.age || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-tighter shadow-sm ${getPriorityStyle(p.priority)}`}>
                            {p.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-tighter">
                            {p.doctor}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-tighter ${getPayerStyle(p.payer)}`}>
                            {p.payer}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 uppercase">
                            {p.referralSource}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight border ${
                            p.caseStatus === 'ได้'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {p.caseStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-tighter whitespace-nowrap">
                            {p.procedure}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          {p.isConfirmed ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-orange-600 font-bold whitespace-nowrap italic truncate max-w-[120px]">{p.remark}</td>
                        <td className="px-4 py-3 text-center h-full" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setSelectedProcedureId(p.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-colors" title="View Detail"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => onEdit(p.id)}
                              className="p-1.5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors" title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPendingDeleteId(p.id);
                                setDeleteConfirmOpen(true);
                              }}
                              className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors" title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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
          </div>
        </>
      ) : (
        /* ── GRID VIEW ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredProcedures.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 font-bold">No clinical cases found for this period.</p>
            </div>
          ) : (
            filteredProcedures.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProcedureId(p.id)}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 translate-x-12 -translate-y-12 rounded-full opacity-10 ${p.priority === 'Elective' ? 'bg-emerald-500' : p.priority === 'Urgent' ? 'bg-amber-500' : 'bg-red-500'}`}></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Case ID: {p.id.slice(0,6)}</span>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{p.patientName}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-xl border text-[9px] font-black uppercase tracking-tighter ${getPriorityStyle(p.priority)}`}>
                    {p.priority}
                  </span>
                </div>

                <div className="space-y-3 mb-5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Procedure &amp; Date</p>
                      <p className="text-xs font-black text-slate-700 mt-0.5">{p.procedure} • {new Date(p.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Primary Physician</p>
                      <p className="text-xs font-black text-slate-700 mt-0.5">{p.doctor}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${p.isConfirmed ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{p.isConfirmed ? 'Confirmed' : 'Pending'}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {selectedProcedure && (
        <CathLabDetail
          procedure={selectedProcedure}
          onClose={() => setSelectedProcedureId(null)}
          onEdit={onEdit}
          onDelete={async (id) => {
            setPendingDeleteId(id);
            setDeleteConfirmOpen(true);
          }}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="ลบข้อมูล?"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
        confirmText="ยืนยันการลบ"
        cancelText="ยกเลิก"
        isDestructive={true}
        isLoading={isDeleteLoading}
        onConfirm={async () => {
          if (pendingDeleteId) {
            setIsDeleteLoading(true);
            try {
              await deleteProcedure(pendingDeleteId);
              setDeleteConfirmOpen(false);
              setPendingDeleteId(null);
              if (selectedProcedureId === pendingDeleteId) {
                setSelectedProcedureId(null);
              }
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
    </div>
  );
}
