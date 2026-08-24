'use client';

import { useCathLab } from '@/context/CathLabContext';
import { CathLabProcedure, PriorityType, PayerType, CaseStatus } from '@/types/cathlab';
import { useState, useEffect } from 'react';
import ThaiDatePicker from './ThaiDatePicker';

interface CathLabFormProps {
  editingId?: string;
  onClose: () => void;
}

export default function CathLabForm({ editingId, onClose }: CathLabFormProps) {
  const { procedures, addProcedure, updateProcedure } = useCathLab();

  const [formData, setFormData] = useState<Partial<CathLabProcedure>>({
    date: new Date().toISOString().split('T')[0],
    seq: procedures.length + 1,
    caseNo: '',
    appointmentTime: '08:00',
    setTime: 'on call',
    patientName: '',
    age: undefined,
    underlyingDisease: '',
    history: '',
    priority: 'Elective',
    doctor: '',
    payer: 'UCEP',
    referralSource: '',
    caseStatus: 'ได้',
    procedure: 'CAG +- PCI',
    tel: '',
    isConfirmed: true,
    remark: ''
  });

  useEffect(() => {
    if (editingId) {
      const existing = procedures.find(p => p.id === editingId);
      if (existing) setFormData(existing);
    }
  }, [editingId, procedures]);

  const update = (field: Partial<CathLabProcedure>) => setFormData(prev => ({ ...prev, ...field }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Firestore does not accept undefined values, so we must clean them out
    const sanitizedData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== undefined)
    ) as Partial<CathLabProcedure>;

    if (editingId) {
      updateProcedure(editingId, sanitizedData as CathLabProcedure);
    } else {
      // Create a temporary ID that matches our interface until Firestore generates one
      addProcedure({ ...sanitizedData, id: Math.random().toString(36).substr(2, 9) } as CathLabProcedure);
    }
    onClose();
  };

  const fc = 'block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-700 text-sm transition-all';
  const lc = 'block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-7 py-4 flex justify-between items-center">
          <div>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">{editingId ? 'Editing Case' : 'New Case'}</p>
            <h2 className="text-lg font-black text-white">{editingId ? 'Edit Procedure Details' : 'New Cath Lab Case'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form — 3-column compact, all in view */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3">

          {/* Row 1: Patient name full width */}
          <div>
            <label className={lc}>Patient Name</label>
            <input required type="text" value={formData.patientName} onChange={e => update({ patientName: e.target.value })} className={fc} placeholder="Name Surname" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="relative col-span-1">
              <label className={lc}>Date</label>
              <ThaiDatePicker 
                value={formData.date || ''} 
                onChange={(_, dateString) => update({ date: dateString })} 
                className={fc} 
              />
            </div>
            <div>
              <label className={lc}>Case No.</label>
              <input type="text" value={formData.caseNo || ''} onChange={e => update({ caseNo: e.target.value })} className={fc} placeholder="e.g. 1" />
            </div>
            <div>
              <label className={lc}>Age</label>
              <input type="number" value={formData.age || ''} onChange={e => update({ age: parseInt(e.target.value) })} className={fc} placeholder="—" />
            </div>
            <div>
              <label className={lc}>Seq</label>
              <input type="number" value={formData.seq} onChange={e => update({ seq: parseInt(e.target.value) })} className={fc} />
            </div>
          </div>

          {/* Row 3: Appt Time · Set Time · Priority */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={lc}>Appointment Time</label>
              <input type="time" value={formData.appointmentTime} onChange={e => update({ appointmentTime: e.target.value })} className={fc} />
            </div>
            <div>
              <label className={lc}>Set Time</label>
              <input type="text" value={formData.setTime} onChange={e => update({ setTime: e.target.value })} className={fc} placeholder="on call / 09:00" />
            </div>
            <div>
              <label className={lc}>Priority</label>
              <select value={formData.priority} onChange={e => update({ priority: e.target.value as PriorityType })} className={fc}>
                <option value="Elective">Elective</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Row 4: Doctor · Payer · Refer In */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={lc}>Doctor</label>
              <select required value={formData.doctor} onChange={e => update({ doctor: e.target.value })} className={fc}>
                <option value="" disabled>Select Doctor</option>
                <option value="ปริชาพล">ปริชาพล</option>
                <option value="ทรงภพ">ทรงภพ</option>
                <option value="พลกฤษณ์">พลกฤษณ์</option>
                <option value="ชวัล">ชวัล</option>
                <option value="พัฒวรินทร์">พัฒวรินทร์</option>
                <option value="สุรเชษฐ์">สุรเชษฐ์</option>
              </select>
            </div>
            <div>
              <label className={lc}>Payer</label>
              <select value={formData.payer} onChange={e => update({ payer: e.target.value as PayerType })} className={fc}>
                <option value="UCEP">UCEP</option>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance</option>
                <option value="Social Security">Social Security</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={lc}>Refer In</label>
              <input type="text" value={formData.referralSource} onChange={e => update({ referralSource: e.target.value })} className={fc} />
            </div>
          </div>

          {/* Row 5: Procedure · Case Status · Telephone */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={lc}>Procedure</label>
              <input type="text" value={formData.procedure} onChange={e => update({ procedure: e.target.value })} className={fc} />
            </div>
            <div>
              <label className={lc}>ค่าส่งเคส</label>
              <select value={formData.caseStatus} onChange={e => update({ caseStatus: e.target.value as CaseStatus })} className={fc}>
                <option value="ได้">ได้</option>
                <option value="ไม่ได้">ไม่ได้</option>
              </select>
            </div>
            <div>
              <label className={lc}>Telephone</label>
              <input type="text" value={formData.tel} onChange={e => update({ tel: e.target.value })} className={fc} />
            </div>
          </div>

          {/* New Row: U/D and Hx */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={lc}>Underlying Disease (U/D)</label>
              <input type="text" value={formData.underlyingDisease || ''} onChange={e => update({ underlyingDisease: e.target.value })} className={fc} placeholder="Any known conditions" />
            </div>
            <div className="col-span-2">
              <label className={lc}>History (Hx.)</label>
              <input type="text" value={formData.history || ''} onChange={e => update({ history: e.target.value })} className={fc} placeholder="Patient's medical history..." />
            </div>
          </div>

          {/* Row 6: Remark + Confirm */}
          <div className="grid grid-cols-3 gap-3 items-end">
            <div className="col-span-2">
              <label className={lc}>Remark</label>
              <input type="text" value={formData.remark} onChange={e => update({ remark: e.target.value })} className={fc} placeholder="Optional..." />
            </div>
            <div>
              <label className={lc}>Confirmed</label>
              <button
                type="button"
                onClick={() => update({ isConfirmed: !formData.isConfirmed })}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 font-black text-sm transition-all ${
                  formData.isConfirmed
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  formData.isConfirmed ? 'bg-emerald-500' : 'bg-slate-200'
                }`}>
                  {formData.isConfirmed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                {formData.isConfirmed ? 'Confirmed' : 'Not Confirmed'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 justify-end">
            <button type="button" onClick={onClose} className="px-6 bg-slate-100 text-slate-600 font-black py-3 rounded-2xl hover:bg-slate-200 transition-all text-sm">
              Cancel
            </button>
            <button type="submit" className="px-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black py-3 rounded-2xl shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm">
              {editingId ? '✓ Save Changes' : '+ Confirm & Add Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
