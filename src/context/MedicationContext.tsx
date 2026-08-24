'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Medication } from '../types/medication';

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<void>;
  updateMedication: (id: string, updatedMedication: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const medicationsCollectionRef = collection(db, 'medications');

  useEffect(() => {
    const q = query(medicationsCollectionRef, orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Medication[];
      
      setMedications(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching Firestore medications:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addMedication = async (medication: Omit<Medication, 'id'>) => {
    try {
      await addDoc(medicationsCollectionRef, medication);
    } catch (error) {
      console.error("Error adding medication: ", error);
      throw error;
    }
  };

  const updateMedication = async (id: string, updatedMedication: Partial<Medication>) => {
    try {
      const docRef = doc(db, 'medications', id);
      await updateDoc(docRef, updatedMedication as any);
    } catch (error) {
      console.error("Error updating medication: ", error);
      throw error;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const docRef = doc(db, 'medications', id);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error("Error deleting medication: ", error);
      throw error;
    }
  };

  return (
    <MedicationContext.Provider value={{ medications, addMedication, updateMedication, deleteMedication }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};
