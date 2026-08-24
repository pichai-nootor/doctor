'use client';

import { useAppointments } from '@/context/AppointmentContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PostCathViewPage() {
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
       <div className="text-xl font-bold text-slate-700">Record Not Found</div>
       <Link href="/post-cath" className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors">Return to Post-Cath</Link>
    </div>
  );

  const postCathData = appointment.postCathData;

  if (!postCathData) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
       <div className="text-slate-300">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
         </svg>
       </div>
       <div className="text-xl font-bold text-slate-700">No Post-Cath Data Available</div>
       <p className="text-slate-500">This appointment hasn't been recorded in Post-Cath yet.</p>
       <Link href="/post-cath" className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors">Return to Queue</Link>
    </div>
  );

  return (
    <main className="container mx-auto px-6 py-10 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions - Mimicking Appointment Page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
            <Link href="/post-cath" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 group-hover:text-slate-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            </Link>
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200">Case No. {appointment.caseNo}</span>
               <span className="text-sm font-medium text-slate-600">Patient: <strong className="text-slate-900">{appointment.patientName}</strong></span>
            </div>
        </div>

        <Link 
            href={`/print?id=${appointment.id}`} 
            target="_blank"
            className="inline-flex flex-1 md:flex-none items-center justify-center w-full md:w-auto px-6 py-3 font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm space-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Procedure Report</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column (Main Info) */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Procedure Result Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
               
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Procedure Overview</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="col-span-1 md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Performed Procedure</p>
                      <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-lg font-black border border-emerald-200 shadow-sm">
                         <span className="mr-2">{postCathData.procedure}</span>
                         {postCathData.procedureRemark && (
                           <span className="text-sm font-medium italic opacity-70">{postCathData.procedureRemark}</span>
                         )}
                      </div>
                  </div>
                  
                  <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Procedure Date</p>
                      <p className="text-base font-bold text-slate-800 flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                         {new Date(appointment.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric'})}
                      </p>
                  </div>
                  
                  <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Attending Physician</p>
                      <div className="flex items-center space-x-2">
                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold border border-blue-200">Dr</div>
                         <p className="text-base font-bold text-slate-800">Dr. {appointment.doctor}</p>
                      </div>
                  </div>
               </div>
            </div>

            {/* Intervention Details Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Intervention Results</h2>
               
               <div className="space-y-8">
                  {/* Lesions */}
                  <div>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.4503-.33l-5.903 3.542a2 2 0 00-.707 2.748L8.223 12l-3.89 2.333a2 2 0 00-.707 2.747l.894 1.49a2 2 0 002.747.707l3.89-2.334 3.89 2.334a2 2 0 002.747-.707l.894-1.49a2 2 0 00-.707-2.747L14.223 12l3.89-2.334a2 2 0 00.707-2.747l-.894-1.49a2 2 0 00-2.747-.707l-2.19 1.314V4.5a1 1 0 00-.605-.947z" clipRule="evenodd" />
                        </svg>
                        Target Lesions
                     </p>
                     {postCathData.lesions && postCathData.lesions.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                           {postCathData.lesions.map(l => (
                              <span key={l} className="px-5 py-2.5 bg-blue-50 text-blue-700 text-sm font-black rounded-xl border border-blue-100 shadow-sm uppercase">
                                 {l}
                              </span>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm font-medium text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">No specific lesions recorded</p>
                     )}
                  </div>

                  {/* Recommendations */}
                  <div>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Clinical Recommendations
                     </p>
                     {postCathData.recommendations && postCathData.recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {postCathData.recommendations.map(r => (
                              <div key={r} className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-800 text-sm font-bold rounded-xl border border-purple-100 shadow-sm">
                                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div>
                                 {r}
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm font-medium text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">No specific recommendations recorded</p>
                     )}
                  </div>
               </div>
            </div>

         </div>

         {/* Right Column (Lists) */}
         <div className="lg:col-span-1 space-y-8">
            

            {/* Clinical Remarks Card */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                   <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                     </svg>
                     Clinical Remarks
                   </h2>
                </div>
                <div className="p-6">
                    <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100/50 min-h-[100px]">
                       <p className="text-sm font-medium text-amber-900 leading-relaxed whitespace-pre-wrap">
                          {postCathData.remark || <span className="text-amber-600/50 italic font-medium">No additional procedural remarks provided.</span>}
                       </p>
                    </div>
                </div>
            </div>

         </div>
      </div>
    </main>
  );
}
