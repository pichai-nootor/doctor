'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAppointments } from '@/context/AppointmentContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PostCathData } from '@/types/appointment';

const PROCEDURES = [
  'CAG', 'CAG + PCI', 'CAG + POBA', 'Eps',
  'Eps + RFA (2D)', 'EPS + RFA (3D)', 'Insertion device',
  'PPM', 'AICD', 'CRT - D'
];

const LESIONS = ['LAD', 'LCx', 'RCA', 'PLV', 'PDA', 'DG', 'OM'];
const RECOMMENDATIONS = ['Medication', 'Stage PCI', 'CAG ± PCI (for Eps)'];

const STEPS = [
  { id: 1, label: 'Procedure', icon: 'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z', color: 'emerald' },
  { id: 2, label: 'Lesions', icon: 'M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2.382-.553.894z', color: 'blue' },
  { id: 3, label: 'Recommendations', icon: 'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z', color: 'purple' },
];

const colorMap: Record<string, Record<string, string>> = {
  emerald: {
    bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-400',
    text: 'text-emerald-700', ring: 'ring-emerald-400/20', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    btn: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30',
    input: 'focus:border-emerald-400 focus:ring-emerald-400/20',
    grad: 'from-emerald-50 to-teal-50/50',
  },
  blue: {
    bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-400',
    text: 'text-blue-700', ring: 'ring-blue-400/20', badge: 'bg-blue-100 text-blue-700 border-blue-200',
    btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30',
    input: 'focus:border-blue-400 focus:ring-blue-400/20',
    grad: 'from-blue-50 to-indigo-50/50',
  },
  purple: {
    bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-400',
    text: 'text-purple-700', ring: 'ring-purple-400/20', badge: 'bg-purple-100 text-purple-700 border-purple-200',
    btn: 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/30',
    input: 'focus:border-purple-400 focus:ring-purple-400/20',
    grad: 'from-purple-50 to-violet-50/50',
  },
};

function PostCathRecordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const isEditMode = searchParams.get('edit') === 'true';
  const { appointments, updateAppointment } = useAppointments();

  const appointment = appointments.find(a => a.id === id);

  const [step, setStep] = useState(1);
  const [data, setData] = useState<PostCathData>({
    procedure: '', procedureRemark: '', lesions: [], recommendations: [], remark: ''
  });
  const [lesionText, setLesionText] = useState('');
  const [recText, setRecText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointment?.postCathData && isEditMode) {
      const d = appointment.postCathData;
      setData({ procedure: d.procedure || '', procedureRemark: d.procedureRemark || '', lesions: d.lesions || [], recommendations: d.recommendations || [], remark: d.remark || '' });
      setLesionText((d.lesions || []).join(', '));
      setRecText((d.recommendations || []).join(', '));
    }
  }, [appointment, isEditMode]);

  if (!appointment) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="text-xl font-bold text-slate-700">Appointment Not Found</div>
      <Link href="/post-cath" className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors">Return to Post-Cath</Link>
    </div>
  );

  const handleToggleLesion = (lesion: string) => {
     setData(prev => {
        const newLesions = prev.lesions.includes(lesion) ? prev.lesions.filter(l => l !== lesion) : [...prev.lesions, lesion];
        setLesionText(newLesions.join(', '));
        return { ...prev, lesions: newLesions };
     });
  };

  const handleRemoveLesion = (lesion: string) => setData(prev => {
      const newLesions = prev.lesions.filter(l => l !== lesion);
      setLesionText(newLesions.join(', '));
      return { ...prev, lesions: newLesions };
  });

  const handleLesionTextChange = (val: string) => {
     setLesionText(val);
     setData(prev => ({ ...prev, lesions: val.split(',').map(s=>s.trim()).filter(Boolean) }));
  };

  const handleToggleRec = (rec: string) => {
     setData(prev => {
        const newRecs = prev.recommendations.includes(rec) ? prev.recommendations.filter(r => r !== rec) : [...prev.recommendations, rec];
        setRecText(newRecs.join(', '));
        return { ...prev, recommendations: newRecs };
     });
  };

  const handleRemoveRec = (rec: string) => setData(prev => {
      const newRecs = prev.recommendations.filter(r => r !== rec);
      setRecText(newRecs.join(', '));
      return { ...prev, recommendations: newRecs };
  });

  const handleRecTextChange = (val: string) => {
    setRecText(val);
    setData(prev => ({ ...prev, recommendations: val.split(',').map(s=>s.trim()).filter(Boolean) }));
  };

  const isStepValid = () => {
    if (step === 1) return data.procedure.trim() !== '';
    return true;
  };

  const handleSave = async () => {
    if (!data.procedure.trim()) { setError('กรุณาระบุ Procedure ก่อนบันทึก'); return; }
    setError(''); setIsSubmitting(true);
    try {
      await updateAppointment(appointment.id, { ...appointment, postCathStatus: 'completed', postCathData: data });
      router.push('/post-cath');
    } catch (e) {
      console.error('Failed to save Post-Cath record', e);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally { setIsSubmitting(false); }
  };

  const currentStep = STEPS[step - 1];
  const c = colorMap[currentStep.color];

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/post-cath" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
             Back to Post-Cath
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          {/* Step numbers + labels */}
          <div className="grid grid-cols-3 mb-4">
            {STEPS.map((s, i) => {
              const isDone = step > s.id;
              const isActive = step === s.id;
              const sc = colorMap[s.color];
              return (
                <div key={s.id} className="relative flex flex-col items-center">
                  <button
                    onClick={() => { if (isDone || isActive) setStep(s.id); }}
                    className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all
                      ${isDone ? `${sc.bg} text-white shadow-md` : isActive ? `${sc.bg} text-white shadow-lg scale-110` : 'bg-white border-2 border-slate-200 text-slate-400'}`}
                  >
                    {isDone ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : s.id}
                  </button>
                  <span className={`text-[10px] font-bold mt-1.5 uppercase tracking-wide text-center z-10 bg-slate-50/50 px-2 rounded-lg ${isActive ? sc.text : isDone ? 'text-slate-500' : 'text-slate-300'}`}>
                    {s.label}
                  </span>
                  
                  {/* Connecting Line */}
                  {i < STEPS.length - 1 && (
                    <div className={`absolute top-5 left-[50%] w-full h-0.5 -mt-[1px] rounded-full transition-all duration-500 z-0 ${step > s.id ? sc.bg : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
          {/* Card Header (Sticky) */}
          <div className={`px-6 py-5 border-b border-slate-100 bg-gradient-to-r ${c.grad} flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-sm shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${c.bg} flex items-center justify-center text-white shadow-md shrink-0`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={currentStep.icon} clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800">Step {step} — {currentStep.label}</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {step === 1 && 'เลือกชื่อ procedure และบันทึกข้อความเพิ่มเติม'}
                  {step === 2 && 'เลือกได้หลายตำแหน่ง หรือพิมพ์เพิ่มเติม'}
                  {step === 3 && 'เลือก recommendation และบันทึก remark'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end bg-white/60 px-4 py-2 rounded-xl border border-white/50 shadow-sm shrink-0">
               <div className="flex items-center gap-2 mb-0.5">
                 <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{isEditMode ? 'Editing Record' : 'New Record'}</span>
                 <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-bold">CASE: {appointment.caseNo}</span>
               </div>
               <p className="text-sm font-black text-slate-800">{appointment.patientName}</p>
            </div>
          </div>

          {/* Step 1: Procedure */}
          {step === 1 && (
            <div className="p-6 space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PROCEDURES.map(p => (
                  <button key={p} onClick={() => setData(prev => ({ ...prev, procedure: p }))}
                    className={`px-4 py-3.5 rounded-2xl text-sm font-bold text-left transition-all border-2 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-sm
                      ${data.procedure === p ? `${c.light} ${c.border} ${c.text} ring-2 ${c.ring}` : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    <span>{p}</span>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${data.procedure === p ? `${c.bg} text-white scale-100 opacity-100` : 'scale-75 opacity-0'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">หมายเหตุเพิ่มเติม (Procedure Remark)</label>
                <input
                  type="text"
                  value={data.procedureRemark || ''}
                  onChange={e => setData(prev => ({ ...prev, procedureRemark: e.target.value }))}
                  placeholder="รายละเอียดเพิ่มเติม..." 
                  className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-normal text-slate-500 text-sm outline-none focus:ring-2 transition-all placeholder:text-slate-300 placeholder:font-normal ${c.input}`}
                />
              </div>
            </div>
          )}

          {/* Step 2: Lesions */}
          {step === 2 && (
            <div className="p-6 space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="flex flex-wrap gap-2">
                {LESIONS.map(l => (
                  <button key={l} onClick={() => handleToggleLesion(l)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all border-2 hover:-translate-y-0.5 hover:shadow-sm
                      ${data.lesions.includes(l) ? `${c.light} ${c.border} ${c.text} ring-2 ${c.ring}` : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block mb-2">หรือพิมพ์ / แก้ไขชื่อ Lesion</label>
                <input
                  type="text"
                  value={lesionText}
                  onChange={e => handleLesionTextChange(e.target.value)}
                  placeholder="เช่น LAD, LCx, LM..."
                 className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-normal text-slate-700 text-sm outline-none focus:ring-2 transition-all placeholder:text-slate-300 ${c.input}`}
                />
              </div>
            </div>
          )}

          {/* Step 3: Recommendations + Remark */}
          {step === 3 && (
            <div className="p-6 space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2.5">
                {RECOMMENDATIONS.map(r => (
                  <button key={r} onClick={() => handleToggleRec(r)}
                    className={`w-full px-5 py-4 rounded-2xl text-sm font-bold text-left transition-all border-2 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-sm
                      ${data.recommendations.includes(r) ? `${c.light} ${c.border} ${c.text} ring-2 ${c.ring}` : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    <span>{r}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${data.recommendations.includes(r) ? `${c.bg} text-white scale-100 opacity-100` : 'scale-75 opacity-0'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>



              <div className="pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Clinical Remarks (ไม่บังคับ)
                </label>
                <textarea
                  value={data.remark}
                  onChange={e => setData(prev => ({ ...prev, remark: e.target.value }))}
                  placeholder="บันทึกเพิ่มเติม เช่น ผลการทำหัตถการ, ปัญหาที่พบ..."
                  rows={4}
                  className="w-full px-4 py-3 bg-amber-50/30 border border-amber-100 rounded-xl font-medium text-slate-700 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary preview (steps 2+) */}
        {step > 1 && (
          <div className="mt-4 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-bold text-slate-500">
              {data.procedure && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-slate-700">{data.procedure} {data.procedureRemark ? `(${data.procedureRemark})` : ''}</span>
                </span>
              )}
              {step > 2 && data.lesions.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-slate-700">{data.lesions.join(', ')}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mt-6">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm shadow-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <Link href="/post-cath"
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm shadow-sm"
            >Cancel</Link>
          )}

          {step < 3 ? (
            <button
              onClick={() => { if (isStepValid()) setStep(s => s + 1); else setError(''); }}
              disabled={!isStepValid()}
              className={`flex-1 sm:flex-none px-8 py-3.5 font-black text-white rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-lg ${c.btn}`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className={`flex-1 sm:flex-none px-8 py-3.5 font-black text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-lg ${
                isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
              }`}
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              ) : (
                <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>{isEditMode ? 'Update Record' : 'Save Record'}</>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function PostCathRecordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <PostCathRecordForm />
    </Suspense>
  );
}
