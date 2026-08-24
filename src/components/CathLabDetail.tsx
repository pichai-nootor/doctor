'use client';

import { CathLabProcedure } from '@/types/cathlab';
import { PriorityType, PayerType } from '@/types/cathlab';

interface CathLabDetailProps {
  procedure: CathLabProcedure;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CathLabDetail({ procedure, onClose, onEdit, onDelete }: CathLabDetailProps) {
  const getPriorityStyle = (priority: PriorityType) => {
    switch (priority) {
      case 'Elective': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Urgent': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Emergency': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPayerStyle = (payer: PayerType) => {
    switch (payer) {
      case 'UCEP': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Cash': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-slate-200">
      {/* Header - Emerald Theme */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 flex items-center justify-between shrink-0">
        <div>
          <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-0.5">Case Details</p>
          <h2 className="text-xl font-black text-white">{procedure.patientName}</h2>
          <p className="text-emerald-200 text-xs font-bold mt-0.5">No. {procedure.seq} · {new Date(procedure.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Patient Overview - no longer needed, info is in header */}
        <section>
          <div className="grid grid-cols-2 gap-3">
             <div className={`p-3 rounded-2xl border text-center ${getPriorityStyle(procedure.priority)}`}>
               <p className="text-[10px] font-bold uppercase tracking-tight mb-0.5 opacity-70">Priority</p>
               <p className="font-black text-sm">{procedure.priority}</p>
             </div>
             <div className={`p-3 rounded-2xl border text-center ${getPayerStyle(procedure.payer)}`}>
               <p className="text-[10px] font-bold uppercase tracking-tight mb-0.5 opacity-70">Payer Type</p>
               <p className="font-black text-sm">{procedure.payer}</p>
             </div>
          </div>
        </section>

        {/* Schedule Info */}
        <section className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Schedule & Logistics</h4>
          <div className="space-y-3">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-600">Date</span>
              </div>
              <span className="text-sm font-black text-slate-900">{new Date(procedure.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Appointment</p>
                <p className="text-sm font-black text-slate-900">{procedure.appointmentTime}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Set Time</p>
                <p className="text-sm font-black text-slate-700 italic">"{procedure.setTime}"</p>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Details */}
        <section className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Information</h4>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Procedure</p>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-black uppercase">
                {procedure.procedure}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Physician</p>
                <p className="text-sm font-black text-slate-800">{procedure.doctor}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Refer In</p>
                <p className="text-sm font-black text-slate-800">{procedure.referralSource}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Case Status</p>
                <p className="text-sm font-black text-emerald-600">{procedure.caseStatus}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Confirmation</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${procedure.isConfirmed ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-black uppercase">{procedure.isConfirmed ? 'Confirmed' : 'Pending'}</span>
                </div>
              </div>
            </div>
            
            {(procedure.underlyingDisease || procedure.history) && (
              <div className="pt-2 border-t border-slate-200/50 space-y-3">
                {procedure.underlyingDisease && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Underlying Disease (U/D)</p>
                    <p className="text-sm font-bold text-slate-800">{procedure.underlyingDisease}</p>
                  </div>
                )}
                {procedure.history && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">History (Hx.)</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{procedure.history}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Contact & Remarks */}
        <section className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Remarks</h4>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Telephone</p>
              <p className="text-sm font-black text-slate-800">{procedure.tel}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Remark</p>
              <p className="text-sm font-bold text-orange-600 italic">"{procedure.remark || 'No remarks provided'}"</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
        <button 
          onClick={() => { onEdit(procedure.id); onClose(); }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white font-black text-sm hover:shadow-emerald-500/30 hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Detail
        </button>
        <button 
          type="button"
          onClick={() => onDelete(procedure.id)}
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-black text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
