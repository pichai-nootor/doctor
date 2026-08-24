'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Appointment } from '../types/appointment';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updatedAppointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Firestore Collection Reference
  const appointmentsCollectionRef = collection(db, 'appointments');

  useEffect(() => {
    // Set up real-time listener for Firestore collection
    const q = query(appointmentsCollectionRef, orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Replace random ID with Firestore Document ID
      })) as Appointment[];
      
      setAppointments(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching Firestore appointments:", error);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const addAppointment = async (appointment: Appointment) => {
    try {
      const { id, ...appointmentData } = appointment;
      await addDoc(appointmentsCollectionRef, appointmentData);
    } catch (error) {
      console.error("Error adding appointment: ", error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, updatedAppointment: Appointment) => {
    try {
      const docRef = doc(db, 'appointments', id);
      const { id: _, ...updateData } = updatedAppointment;
      await updateDoc(docRef, updateData as any);
    } catch (error) {
      console.error("Error updating appointment: ", error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const docRef = doc(db, 'appointments', id);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error("Error deleting appointment: ", error);
      throw error;
    }
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, updateAppointment, deleteAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
