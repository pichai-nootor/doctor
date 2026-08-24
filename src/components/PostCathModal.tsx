'use client';

import { useState, useEffect } from 'react';
import { Appointment, PostCathData } from '@/types/appointment';

interface PostCathModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onConfirm: (data: PostCathData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: PostCathData | null;
}

const PROCEDURES = [
  'CAG', 'CAG + PCI', 'CAG + POBA', 'Eps', 
  'Eps + RFA (2D)', 'EPS + RFA (3D)', 'Insertion device', 
  'PPM', 'AICD', 'CRT - D'
];

const LESIONS = ['LAD', 'LCx', 'RCA', 'PLV', 'PDA', 'DG', 'OM'];

const RECOMMENDATIONS = ['Medication', 'Stage PCI', 'CAG ± PCI (for Eps)'];

export default function PostCathModal({
  isOpen,
  appointment,
  onConfirm,
  onCancel,
  isLoading = false,
  initialData = null
}: PostCathModalProps) {
  const isEditMode = !!initialData;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<PostCathData>({
    procedure: '',
    lesions: [],
    recommendations: [],
    finishTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }),
    remark: ''
  });

  // Initialize with existing data when in edit mode
  useEffect(() => {
    if (isOpen && initialData) {
      setData({
        procedure: initialData.procedure || '',
        lesions: initialData.lesions || [],
        recommendations: initialData.recommendations || [],
        finishTime: initialData.finishTime || '',
        remark: initialData.remark || ''
      });
      setStep(1);
    } else if (isOpen && !initialData) {
      setData({
        procedure: '',
        lesions: [],
        recommendations: [],
        finishTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }),
        remark: ''
      });
      setStep(1);
    }
  }, [isOpen, initialData]);

  if (!isOpen || !appointment) return null;

  const handleToggleLesion = (lesion: string) => {
    setData(prev => ({
      ...prev,
      lesions: prev.lesions.includes(lesion)
        ? prev.lesions.filter(l => l !== lesion)
        : [...prev.lesions, lesion]
    }));
  };

  const handleToggleRec = (rec: string) => {
    setData(prev => ({
      ...prev,
      recommendations: prev.recommendations.includes(rec)
        ? prev.recommendations.filter(r => r !== rec)
        : [...prev.recommendations, rec]
    }));
  };

  const isStepValid = () => {
    if (step === 1) return data.procedure !== '';
    if (step === 2) return true;
    return true;
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={!isLoading ? onCancel : undefined}></div>
      
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* Progress Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-[22px] font-black text-[#1A202C] leading-none mb-1.5">
                {isEditMode ? 'Edit Post-Cath Record' : 'Post-Cath Record'}
              </h3>
              <p className="text-[13px] font-extrabold text-[#A0AEC0]">{appointment.patientName}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-xs font-bold mt-0.5 ${isEditMode ? 'border-amber-200/60 text-amber-500' : 'border-slate-200/60 text-[#00C16E]'}`}>
              {isEditMode ? 'Edit Mode' : `Step ${step} of 3`}
            </div>
          </div>
          <div className="flex gap-2.5">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-[6px] flex-1 rounded-full transition-all duration-500 ${s <= step ? (isEditMode ? 'bg-amber-400' : 'bg-[#00C16E]') : 'bg-[#EDF2F7]'}`} />
            ))}
          </div>
        </div>

        <div className="px-8 pb-2 max-h-[55vh] overflow-y-auto custom-scrollbar border-t border-[#F7FAFC] pt-6">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <label className="text-[13px] font-black text-[#4A5568] uppercase tracking-widest block mb-4">Select Procedure</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROCEDURES.map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setData({ ...data, procedure: p });
                      if (!isEditMode) {
                        setTimeout(() => setStep(2), 250);
                      }
                    }}
                    className={`px-5 py-4 rounded-2xl text-[15px] font-bold text-left transition-all border-2 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-sm
                      ${data.procedure === p 
                        ? 'bg-[#E6F8F0] border-[#00C16E] text-[#009A58] ring-2 ring-[#00C16E]/20' 
                        : 'bg-white border-[#EDF2F7] text-[#4A5568] hover:border-[#CBD5E0]'
                      }`}
                  >
                    <span>{p}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${data.procedure === p ? 'bg-[#00C16E] text-white shadow-sm scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <label className="text-[13px] font-black text-[#4A5568] uppercase tracking-widest block mb-4">Select Lesions (Multiple)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {LESIONS.map(l => (
                  <button
                    key={l}
                    onClick={() => handleToggleLesion(l)}
                    className={`px-5 py-4 rounded-2xl text-[15px] font-bold transition-all border-2 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-sm
                      ${data.lesions.includes(l) 
                        ? 'bg-[#EBF4FF] border-[#3182CE] text-[#2B6CB0] ring-2 ring-[#3182CE]/20' 
                        : 'bg-white border-[#EDF2F7] text-[#4A5568] hover:border-[#CBD5E0]'
                      }`}
                  >
                    <span>{l}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${data.lesions.includes(l) ? 'bg-[#3182CE] text-white shadow-sm scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 border-b border-transparent">
              <div>
                <label className="text-[13px] font-black text-[#4A5568] uppercase tracking-widest block mb-4">Recommendations (Multiple)</label>
                <div className="space-y-3">
                  {RECOMMENDATIONS.map(r => (
                    <button
                      key={r}
                      onClick={() => handleToggleRec(r)}
                      className={`w-full px-5 py-4 rounded-2xl text-[15px] font-bold text-left transition-all border-2 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-sm
                        ${data.recommendations.includes(r) 
                          ? 'bg-[#FAF5FF] border-[#805AD5] text-[#553C9A] ring-2 ring-[#805AD5]/20' 
                          : 'bg-white border-[#EDF2F7] text-[#4A5568] hover:border-[#CBD5E0]'
                        }`}
                    >
                      <span>{r}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${data.recommendations.includes(r) ? 'bg-[#805AD5] text-white shadow-sm scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDF2F7]">
                 <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Remark</label>
                    <input 
                      type="text" 
                      placeholder="Optional..."
                      value={data.remark}
                      onChange={(e) => setData({ ...data, remark: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#EDF2F7] rounded-xl font-bold text-[#4A5568] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
                    />
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8 pt-4 bg-white flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="text-[15px] font-black text-[#A0AEC0] hover:text-[#4A5568] transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="text-[15px] font-black text-[#8997AD] hover:text-[#4A5568] transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid() || isLoading}
              className="px-8 py-3.5 bg-[#8C93A3] hover:bg-[#718096] text-white text-[15px] font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#8C93A3]/20"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={() => onConfirm(data)}
              disabled={isLoading}
              className={`px-8 py-3.5 text-white text-[15px] font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg ${
                isEditMode 
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' 
                  : 'bg-[#00C16E] hover:bg-[#00B060] shadow-[#00C16E]/30'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isEditMode ? 'Update Record' : 'Complete Record'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
