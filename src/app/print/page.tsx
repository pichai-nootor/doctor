'use client';

import { useAppointments } from '@/context/AppointmentContext';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

function PrintContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { appointments } = useAppointments();
  const printRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const appointment = appointments.find((a: any) => a.id === id);

  if (!appointment) return <div className="p-8">Appointment not found</div>;

  const currentMeds = appointment.currentMedications || [];
  const withheldMeds = appointment.withheldMedications || [];
  const preCathOrders = appointment.preCathOrders || [];
  const requiredDocs = appointment.requiredDocuments || [];

  const getProcedureStyle = (proc: string) => {
    switch (proc) {
      case 'CAG': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PCI': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CAG+/-PCI': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'PPM': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EPS': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'EPS+/-RFA': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Other': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleDownloadImage = async () => {
    if (!printRef.current) return;
    setIsCapturing(true);

    // Save original styles
    const originalWidth = printRef.current.style.width;
    const originalMaxWidth = printRef.current.style.maxWidth;

    // Force layout to desktop size for capture
    printRef.current.style.width = '1050px';
    printRef.current.style.maxWidth = '1050px';

    // Brief timeout to ensure DOM layout updates before clone
    await new Promise(r => setTimeout(r, 50));

    try {
      // Force it to capture the full structural width (1050px) regardless of viewport
      const dataUrl = await toPng(printRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: 1050,
        style: {
          margin: '0',
          transform: 'scale(1)'
        }
      });

      const fileName = `appointment-case-${appointment.caseNo || 'new'}.png`;

      // Attempt to use native Web Share API (Mobile Devices & Safari)
      if (typeof navigator !== 'undefined' && navigator.canShare) {
        try {
          // Convert base64 dataUrl to a Blob to share it as a file
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], fileName, { type: 'image/png' });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `Cath Lab Table: Case ${appointment.caseNo}`,
            });
            // Successfully shared or saved to album natively
            return; 
          }
        } catch (shareErr: any) {
          // If user cancels the share sheet, it throws an AbortError.
          // We don't want to auto-fallback to downloading in this case.
          if (shareErr.name === 'AbortError') {
             return;
          }
          console.log('Share API error (falling back to download)', shareErr);
        }
      }

      // Fallback for desktop browsers (downloads to Downloads folder)
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture image', err);
    } finally {
      // Revert to original responsive layout
      printRef.current.style.width = originalWidth;
      printRef.current.style.maxWidth = originalMaxWidth;
      setIsCapturing(false);
    }
  };

  const getDoctorStyle = (doc: string) => {
    switch (doc) {
      case 'ปริชาพล': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'ทรงภพ': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'พลกฤษณ์': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ชวัล': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'พัฒวรินทร์': return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
      case 'สุรเชษฐ์': return 'bg-lime-100 text-lime-800 border-lime-200';
      case 'ปิยวัฒน์': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
      if (p1.includes('ทิ้งหน้าที่ 3 ไป')) {
        return `<span class="font-bold">**${p1}**</span>`;
      }
      return `<span class="font-bold text-red-600">**${p1}**</span>`;
    });
  };

  return (
    <div className="bg-white min-h-screen text-[14px] leading-tight font-sans text-black flex flex-col items-center justify-start py-10 px-4 print:p-0 print:py-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @page { 
          size: landscape; 
          margin: 10mm; 
        }
        @media print {
          body { 
            -webkit-print-color-adjust: exact; 
          }
          .print-container {
            margin: auto !important;
            padding: 0 !important;
            width: 100% !important;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: calc(100vh - 20mm);
          }
        }
      ` }} />
      <div ref={printRef} className="max-w-[1050px] w-full mx-auto p-4 print:p-0 print-container bg-white">
        <div className="border-2 border-black shadow-lg">
        
        <div className="flex items-center justify-between border-b border-black p-2">
          <div className="flex items-center">
            <img 
              src="/ekc-logo.png" 
              alt="EKC Logo" 
              className="h-12 w-auto"
            />
          </div>
          <div className="font-bold text-lg flex-grow text-center">
            ตารางนัดผู้ป่วยมาทำหัตถการ แผนก Cath Lab
          </div>
        </div>

        <div className="flex border-b border-black">
          <div className="w-[10%] border-r border-black p-1 flex flex-col justify-center items-center text-center font-bold">
            <div>Case</div>
            <div>No.{appointment.caseNo}</div>
          </div>
          <div className="w-[12%] border-r border-black p-1 flex items-center justify-center relative">
             <div className={`px-1 py-1 rounded w-full text-center text-[12px] font-bold border transition-colors ${getProcedureStyle(appointment.procedure || '')}`}>
               {appointment.procedure}
             </div>
          </div>
          <div className="w-[7%] border-r border-black p-1 flex items-center justify-center font-bold">
            Date
          </div>
          <div className="w-[11%] border-r border-black p-1 bg-yellow-100 flex items-center justify-center font-bold text-[13px] text-center">
            {new Date(appointment.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div className="w-[12%] border-r border-black flex flex-col">
            <div className="border-b border-black text-center font-bold py-1">Time</div>
            <div className="flex border-b border-black text-[12px]">
               <div className="w-1/2 border-r border-black text-center py-0.5 font-bold">ER</div>
               <div className="w-1/2 text-center py-0.5 font-bold">Set</div>
            </div>
            <div className="flex">
               <div className="w-1/2 border-r border-black text-center py-1">{appointment.timeER}</div>
               <div className="w-1/2 text-center py-1">{appointment.timeSet}</div>
            </div>
          </div>
          <div className="w-[15%] border-r border-black flex flex-col items-center justify-center relative">
             <div className="font-bold absolute top-1">Doctor</div>
             <div className={`mt-4 text-[12px] px-2 py-0.5 rounded flex items-center justify-center w-[90%] border font-semibold ${getDoctorStyle(appointment.doctor || '')}`}>
                {appointment.doctor}
             </div>
          </div>
          <div className="w-[33%] flex flex-col">
            <div className="flex border-b border-black flex-1 items-center">
              <div className="font-bold w-[25%] px-1 text-center">Name</div>
               <div className="w-[75%] px-2 font-bold text-base text-center">{appointment.patientName}</div>
            </div>
            <div className="flex flex-1 items-center">
              <div className="font-bold w-[25%] px-1 text-center">Tel.</div>
               <div className="w-[75%] px-2 text-center text-[12px]">{appointment.patientTel}</div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-black">
          <div className="w-[8%] border-r border-black p-1 font-bold text-center">U/D</div>
          <div className="w-[92%] p-1 font-bold">{appointment.underlyingDisease || '(ฝากซักประวัติเพิ่ม)'}</div>
        </div>

        <div className="flex border-b border-black">
          <div className="w-[8%] border-r border-black p-1 font-bold text-center">Hx.</div>
          <div className="w-[92%] p-1">{appointment.history || 'เหนื่อย แน่นหน้าอก (ฝากซักประวัติเพิ่ม)'}</div>
        </div>

        <div className="flex border-b border-black text-center font-bold">
           <div className="w-[70%] border-r border-black p-1">ยาเดิม</div>
           <div className="w-[20%] border-r border-black p-1">ยาที่งด</div>
           <div className="w-[10%] p-1">วันที่</div>
        </div>

        <div className="flex border-b border-black min-h-[120px]">
           <div className="w-[70%] border-r border-black flex flex-col p-1.5 text-[12px] font-bold">
             <div className="flex flex-wrap w-full">
               {currentMeds.map((med: any, i: number) => (
                  <div key={`m-${i}`} className="w-1/2 px-1 py-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                    {i + 1}. {med.name} {med.dosage}
                  </div>
               ))}
             </div>
           </div>
           <div className="w-[30%] flex relative bg-white z-10">
              <div className="w-2/3 border-r border-black flex flex-col pt-1 pb-10">
                 <div className="flex flex-col items-center justify-start flex-1">
                    {withheldMeds.length > 0 ? (
                       withheldMeds.map((wm: any, i: number) => (
                          <div key={`w-${i}`} className="text-red-600 font-bold leading-5 w-full text-center text-[16px] whitespace-nowrap overflow-hidden text-ellipsis">
                             {wm.name}
                          </div>
                       ))
                    ) : (
                       <div className="text-red-600 font-bold text-xl mt-2 font-outfit">ไม่มี</div>
                    )}
                 </div>
                 
                 <div className="text-purple-600 text-[13px] text-center font-bold mt-4 leading-tight z-20 px-1">
                   *ให้คนไข้ทานยาโรคประจำตัว<br/>
                   ให้ครบทุกตัว ยกเว้นยาที่แจ้งงด<br/>
                   ก่อนส่งขึ้น Cath Lab***
                 </div>
              </div>
              <div className="w-1/3 flex flex-col items-center pt-1 pb-10">
                 {withheldMeds.map((wm: any, i: number) => (
                    <div key={`wd-${i}`} className="text-black leading-5 w-full text-center whitespace-nowrap overflow-hidden text-ellipsis">
                       {wm.date}
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex border-b border-black font-bold text-center">
            <div className="w-[40%] border-r border-black p-1">Pre-Cath Order</div>
            <div className="w-[60%] p-1">เอกสารที่ต้องใช้</div>
        </div>

        <div className="flex border-b border-black min-h-[100px] text-[13px]">
             <div className="w-[40%] border-r border-black flex flex-col p-1.5 pt-1">
                {preCathOrders.map((order: string, i: number) => (
                   <div key={`po-${i}`} className="py-0.5 flex">
                      <span className="mr-1">{i + 1}.</span>
                      <span dangerouslySetInnerHTML={{ __html: renderMarkdown(order) }}></span>
                   </div>
                ))}
             </div>
             <div className="w-[60%] flex flex-col p-1.5 pt-1">
                {requiredDocs.map((doc: string, i: number) => (
                   <div key={`doc-${i}`} className="py-0.5 flex">
                      <span className="mr-1">{i + 1}.</span> 
                      <span dangerouslySetInnerHTML={{ __html: renderMarkdown(doc) }}></span>
                   </div>
                ))}
             </div>
        </div>

        <div className="p-1 text-center font-bold text-red-600 text-sm leading-tight">
          ***ไม่ใช้ใบ Standing MI และไม่ใช้ใบตารางเวลา MI***<br/>
          <span className="text-[13px]" dangerouslySetInnerHTML={{ __html: renderMarkdown("**หมายเหตุ** ฝากสอบถามคนไข้ว่าทานยาโรคประจำตัวมาหรือยัง โดยเฉพาะ ASA , Plavix ถ้ายังไม่ทานฝาก โทรแจ้ง Cath Lab 9253 ขอบคุณค่ะ") }}></span>
        </div>

       </div>
      </div>

      <div className="flex justify-center mt-8 space-x-4 print:hidden">
         <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-colors">
            Print Now
         </button>
         <button onClick={handleDownloadImage} disabled={isCapturing} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2">
            {isCapturing ? (
               <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Saving...
               </>
            ) : (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                 </svg>
                 Save as Image
               </>
            )}
         </button>
         <button onClick={() => window.close()} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-2 rounded-lg font-bold shadow-md transition-colors">
            Close
         </button>
      </div>

    </div>
  );
}

export default function PrintAppointmentClient() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Print View...</div>}>
      <PrintContent />
    </Suspense>
  );
}
