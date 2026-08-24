'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CathLabProcedure } from '../types/cathlab';

interface CathLabContextType {
  procedures: CathLabProcedure[];
  addProcedure: (procedure: CathLabProcedure) => void;
  updateProcedure: (id: string, updatedProcedure: CathLabProcedure) => void;
  deleteProcedure: (id: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const CathLabContext = createContext<CathLabContextType | undefined>(undefined);

const mockProcedures: CathLabProcedure[] = [
  {
    id: '1',
    date: '2026-03-01',
    seq: 1,
    appointmentTime: '08:00',
    setTime: '09:00',
    patientName: 'นายธนชัย ตั้งจันทึก',
    priority: 'Elective',
    doctor: 'พลกฤษณ์',
    payer: 'UCEP',
    referralSource: 'เลิศสิน',
    caseStatus: 'ได้',
    procedure: 'CAG +- PCI',
    tel: '098-293-5936 / 095-936-1546',
    isConfirmed: true,
    remark: 'มาเอง',
    caseNo: 'CATH-001'
  },
  {
    id: '2',
    date: '2026-03-01',
    seq: 2,
    appointmentTime: '08:00',
    setTime: 'on call',
    patientName: 'นายมานิต บุญมา',
    age: 71,
    priority: 'Elective',
    doctor: 'พลกฤษณ์',
    payer: 'UCEP',
    referralSource: 'เลิศสิน',
    caseStatus: 'ได้',
    procedure: 'CAG +- PCI',
    tel: '096-269-0305 / 083-454-4550',
    isConfirmed: true,
    remark: 'ขอรถ',
    caseNo: 'CATH-002'
  },
  {
    id: '3',
    date: '2026-03-01',
    seq: 3,
    appointmentTime: '08:00',
    setTime: 'on call',
    patientName: 'นายธนชัย เอี่ยมวิมล',
    age: 73,
    priority: 'Elective',
    doctor: 'พลกฤษณ์',
    payer: 'UCEP',
    referralSource: 'เลิศสิน',
    caseStatus: 'ได้',
    procedure: 'CAG +- PCI',
    tel: '089-018-1839',
    isConfirmed: true,
    remark: 'ขอรถ',
    caseNo: ''
  }
];

export const CathLabProvider = ({ children }: { children: ReactNode }) => {
  const [procedures, setProcedures] = useState<CathLabProcedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Firestore Collection Reference
  const proceduresCollectionRef = collection(db, 'cathLabProcedures');

  useEffect(() => {
    // Set up real-time listener for Firestore collection
    const q = query(proceduresCollectionRef, orderBy('date', 'desc'), orderBy('seq', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Replace random ID with Firestore Document ID
      })) as CathLabProcedure[];
      
      setProcedures(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching Firestore data:", error);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const addProcedure = async (procedure: CathLabProcedure) => {
    try {
      // Omit the 'id' field as Firestore generates it automatically
      const { id, ...procedureData } = procedure;
      await addDoc(proceduresCollectionRef, procedureData);
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };

  const updateProcedure = async (id: string, updatedProcedure: CathLabProcedure) => {
    try {
      const docRef = doc(db, 'cathLabProcedures', id);
      const { id: _, ...updateData } = updatedProcedure;
      await updateDoc(docRef, updateData as any);
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  };

  const deleteProcedure = async (id: string) => {
    try {
      const docRef = doc(db, 'cathLabProcedures', id);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  };

  return (
    <CathLabContext.Provider value={{ 
      procedures, 
      addProcedure, 
      updateProcedure, 
      deleteProcedure,
      isSidebarOpen,
      setSidebarOpen
    }}>
      {children}
    </CathLabContext.Provider>
  );
}

export const useCathLab = () => {
  const context = useContext(CathLabContext);
  if (!context) {
    throw new Error('useCathLab must be used within a CathLabProvider');
  }
  return context;
};
