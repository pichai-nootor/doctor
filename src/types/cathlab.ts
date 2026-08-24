export type PriorityType = 'Elective' | 'Urgent' | 'Emergency';
export type PayerType = 'UCEP' | 'Cash' | 'Insurance' | 'Social Security' | 'Other';
export type CaseStatus = 'ได้' | 'ไม่ได้';

export interface CathLabProcedure {
  id: string;
  date: string; // YYYY-MM-DD
  seq: number;
  appointmentTime: string; // HH:mm
  setTime: string; // HH:mm or 'on call'
  patientName: string;
  age?: number;
  priority: PriorityType;
  doctor: string;
  payer: PayerType;
  referralSource: string;
  caseStatus: CaseStatus;
  procedure: string;
  tel: string;
  isConfirmed: boolean;
  remark: string;
  caseNo: string;
  underlyingDisease?: string;
  history?: string;
}
