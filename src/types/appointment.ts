export type ProcedureType = 'CAG+/-PCI' | 'CAG' | 'PCI' | 'PPM' | 'EPS' | 'EPS+/-RFA' | 'Other';

export interface Medication {
  name: string;
  dosage: string;
}

export interface WithheldMedication {
  name: string;
  date: string; // DD/MM/YYYY
}

export interface PostCathData {
  procedure: string;
  procedureRemark?: string;
  lesions: string[];
  recommendations: string[];
  finishTime?: string;
  remark?: string;
}

export type PostCathStatus = 'none' | 'pending' | 'completed';

export interface Appointment {
  id: string;
  caseNo: string;
  procedure: ProcedureType;
  date: string; // YYYY-MM-DD
  timeER: string; // HH:mm
  timeSet: string; // HH:mm or 'on call'
  doctor: string;
  patientName: string;
  patientTel: string;
  underlyingDisease: string;
  history: string;
  currentMedications: Medication[];
  withheldMedications: WithheldMedication[];
  preCathOrders: string[];
  requiredDocuments: string[];
  postCathStatus?: PostCathStatus;
  postCathData?: PostCathData;
}
