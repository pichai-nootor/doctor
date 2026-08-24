'use client';

import { useAppointments } from '@/context/AppointmentContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AppointmentDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { appointments } = useAppointments();
  
  const appointment = appointments.find(a => a.id === id);

  if (!appointment) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
       <div className="text-slate-300">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
       </div>
       <div className="text-xl font-bold text-slate-700">Appointment Not Found</div>
       <Link href="/" className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-200 transition-colors">Return Home</Link>
    </div>
  );

  return (
    <main className="container mx-auto px-6 py-10 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
            <Link href="/appointments" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 group-hover:text-slate-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            </Link>
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-200">Case No. {appointment.caseNo}</span>
               <span className="text-sm font-medium text-slate-600">Patient: <strong className="text-slate-900">{appointment.patientName}</strong></span>
            </div>
        </div>

        <Link 
            href={`/print?id=${appointment.id}`} 
            target="_blank"
            className="inline-flex flex-1 md:flex-none items-center justify-center w-full md:w-auto px-6 py-3 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm space-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Official Form</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column (Main Info) */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Clinical Overview Card */}
            <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
               
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Clinical Overview</h2>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
                  <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Procedure Type</p>
                      <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold border border-purple-200">
                         {appointment.procedure}
                      </div>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Scheduled Date</p>
                      <p className="text-lg font-bold text-slate-800">{appointment.date}</p>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Attending Doctor</p>
                      <div className="flex items-center space-x-2">
                         <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold border border-blue-200">Dr</div>
                         <p className="text-base font-bold text-slate-800">{appointment.doctor}</p>
                      </div>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Time (ER)</p>
                      <p className="text-base font-bold text-slate-800 flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         {appointment.timeER}
                      </p>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Time (Set)</p>
                      <p className="text-base font-bold text-slate-800 flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         {appointment.timeSet}
                      </p>
                  </div>
               </div>
            </div>

            {/* Demographics & History Card */}
            <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Patient Background</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                      <div className="flex items-center space-x-4 mb-4">
                         <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold font-outfit text-xl shadow-sm">
                            {appointment.patientName.charAt(0)}
                         </div>
                         <div>
                            <p className="text-lg font-bold text-slate-900">{appointment.patientName}</p>
                            <p className="text-sm font-medium text-slate-500 flex items-center">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                               {appointment.patientTel}
                            </p>
                         </div>
                      </div>
                  </div>
                  <div className="space-y-4 col-span-1 md:col-span-2">
                      <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50">
                         <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Underlying Disease (U/D)</p>
                         <p className="text-sm text-yellow-900 font-medium">{appointment.underlyingDisease || <span className="text-yellow-600/50 italic">No specific data</span>}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Medical Synopsis (Hx.)</p>
                         <p className="text-sm text-slate-700 leading-relaxed font-medium">{appointment.history || <span className="text-slate-400 italic">No specific data</span>}</p>
                      </div>
                  </div>
               </div>
            </div>

         </div>

         {/* Right Column (Lists) */}
         <div className="lg:col-span-1 space-y-6">
            
            {/* Medications Card */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                   <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" /></svg>
                     Medications
                   </h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Current Regime</h3>
                        {appointment.currentMedications.length > 0 ? (
                            <ul className="space-y-2">
                                {appointment.currentMedications.map((m, i) => (
                                    <li key={i} className="flex items-start text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-2 shrink-0"></div>
                                        <span className="text-slate-700 font-medium">{m.name} <span className="text-slate-400 text-xs ml-1">{m.dosage}</span></span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400 italic">None recorded</p>
                        )}
                    </div>
                    {appointment.withheldMedications.length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                                Must Withhold
                            </h3>
                            <ul className="space-y-2">
                                {appointment.withheldMedications.map((m, i) => (
                                    <li key={i} className="flex justify-between items-center bg-red-50/50 p-2 rounded border border-red-100 text-sm">
                                        <span className="text-red-700 font-bold">{m.name}</span>
                                        <span className="text-red-500/70 text-xs font-medium">{m.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Orders & Docs Card */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                   <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                     Directives
                   </h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pre-Cath Orders</h3>
                        {appointment.preCathOrders.length > 0 ? (
                           <ul className="list-decimal pl-4 space-y-1.5 text-sm text-slate-700 font-medium">
                            {appointment.preCathOrders.map((m, i) => (
                                <li key={i} className="pl-1 marker:text-slate-400">
                                   <span dangerouslySetInnerHTML={{ __html: m.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1.includes('ทิ้งหน้าที่ 3 ไป') ? `<span class="font-bold">**${p1}**</span>` : `<span class="font-bold text-red-600">**${p1}**</span>`) }}></span>
                                </li>
                            ))}
                           </ul>
                        ) : (
                           <p className="text-sm text-slate-400 italic">None recorded</p>
                        )}
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Required Documents</h3>
                        {appointment.requiredDocuments.length > 0 ? (
                           <ul className="space-y-2 text-sm text-slate-700 font-medium">
                            {appointment.requiredDocuments.map((m, i) => (
                                <li key={i} className="flex items-start bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                   <span dangerouslySetInnerHTML={{ __html: m.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1.includes('ทิ้งหน้าที่ 3 ไป') ? `<span class="font-bold">**${p1}**</span>` : `<span class="font-bold text-red-600">**${p1}**</span>`) }}></span>
                                </li>
                            ))}
                           </ul>
                        ) : (
                           <p className="text-sm text-slate-400 italic">None recorded</p>
                        )}
                    </div>
                </div>
            </div>

         </div>
      </div>
    </main>
  );
}
