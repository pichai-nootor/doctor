'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Dosage } from '../types/dosage';

interface DosageContextType {
  dosages: Dosage[];
  addDosage: (dosage: Omit<Dosage, 'id'>) => Promise<void>;
  updateDosage: (id: string, updatedDosage: Partial<Dosage>) => Promise<void>;
  deleteDosage: (id: string) => Promise<void>;
}

const DosageContext = createContext<DosageContextType | undefined>(undefined);

export const DosageProvider = ({ children }: { children: ReactNode }) => {
  const [dosages, setDosages] = useState<Dosage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dosagesCollectionRef = collection(db, 'dosages');

  useEffect(() => {
    const q = query(dosagesCollectionRef, orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Dosage[];
      
      setDosages(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching Firestore dosages:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addDosage = async (dosage: Omit<Dosage, 'id'>) => {
    try {
      await addDoc(dosagesCollectionRef, dosage);
    } catch (error) {
      console.error("Error adding dosage: ", error);
      throw error;
    }
  };

  const updateDosage = async (id: string, updatedDosage: Partial<Dosage>) => {
    try {
      const docRef = doc(db, 'dosages', id);
      await updateDoc(docRef, updatedDosage as any);
    } catch (error) {
      console.error("Error updating dosage: ", error);
      throw error;
    }
  };

  const deleteDosage = async (id: string) => {
    try {
      const docRef = doc(db, 'dosages', id);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error("Error deleting dosage: ", error);
      throw error;
    }
  };

  return (
    <DosageContext.Provider value={{ dosages, addDosage, updateDosage, deleteDosage }}>
      {children}
    </DosageContext.Provider>
  );
};

export const useDosages = () => {
  const context = useContext(DosageContext);
  if (!context) {
    throw new Error('useDosages must be used within a DosageProvider');
  }
  return context;
};
