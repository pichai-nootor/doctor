import { Appointment } from '../types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    caseNo: '3',
    procedure: 'CAG+/-PCI',
    date: '2026-03-06',
    timeER: '13:00',
    timeSet: 'on call',
    doctor: 'ทรงภพ',
    patientName: 'นางวิรัช มะลิสุวรรณ',
    patientTel: '099-254-9954 / 081-342-3525',
    underlyingDisease: '(ฝากซักประวัติเพิ่ม)',
    history: 'เหนื่อย แน่นหน้าอก (ฝากซักประวัติเพิ่ม)',
    currentMedications: [
      { name: 'ASA 81 mg', dosage: '1*1 pc.' },
      { name: 'Clopidogrel(75)', dosage: '1x1 po pc.' },
      { name: 'Nebilet(5)', dosage: '1x1 po pc.' },
      { name: 'Gabapantin(300)', dosage: '1x1 po hs.' },
      { name: 'Teonin(120)', dosage: '1x1 po pc.' },
      { name: 'Atorvastatin', dosage: '40 mg' },
      { name: 'Omeprazole 20 mg', dosage: '1*1 ac.' },
      { name: 'Forxiga(10)', dosage: '1x1 po pc.' },
      { name: 'Cetirizine', dosage: '1x1 po hs.' },
      { name: 'Symbicort', dosage: '1 puff bid เช้า-เย็น เวลาทีอาการ' },
      { name: 'Betahistine', dosage: '3x2 po pc.' },
      { name: 'Flexsa(1500)', dosage: '1x1 po ac.' },
    ],
    withheldMedications: [
      { name: 'Forxiga', date: '6/3/2569' },
    ],
    preCathOrders: [
      'Lab : CBC , BUN , Cr , E\'lyte , Trop-T , Anti-HIV',
      'NPO 6 hr',
      'EKG , CXR P',
      'On 0.9% NSS 1000 ml IV KVO',
    ],
    requiredDocuments: [
      'NSO-034 ใบแสดงความยินยอมผ่าตัด **ทิ้งหน้าที่ 3 ไป**',
      'NSO-005 หนังสือแสดงความยินยอมตรวจ HIV',
      'CCL-011-01 ใบยินยอมการฉีดสีและทำบอลลูนขยายหลอดเลือด',
      'CCL-012 Pre Cardiac Catheterization order',
      'ชุด Admit ปกติ',
    ],
  },
];
