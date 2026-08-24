'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserPermissions {
  dashboard: boolean;
  cathLab: boolean;
  appointments: boolean;
  postCath: boolean;
  masterData: boolean;
  [key: string]: boolean; // For future extensibility
}

const defaultPermissions: UserPermissions = {
  dashboard: true, // Everyone can see dashboard by default
  cathLab: false,
  appointments: false,
  postCath: false,
  masterData: false,
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  permissions: UserPermissions;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  permissions: defaultPermissions,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);

  useEffect(() => {
    const fetchUserPermissions = async (email: string) => {
      try {
        const userDocRef = doc(db, 'users', email);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.permissions) {
            setPermissions((prev) => ({ ...prev, ...data.permissions }));
          }
        } else {
          console.warn(`No permissions found for user ${email}. Creating default permissions.`);
          // Create default permissions in Firestore for new user
          try {
            await setDoc(userDocRef, {
              email: email,
              permissions: defaultPermissions,
              createdAt: new Date().toISOString()
            });
            console.log(`Successfully created default permissions for ${email}`);
          } catch (setDocError) {
             console.error("Failed to set default permissions in Firestore:", setDocError);
          }
          setPermissions(defaultPermissions);
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        setPermissions(defaultPermissions);
      }
    };

    // Removed checkExpiration logic as per user request for no auto-logout

    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        await fetchUserPermissions(currentUser.email);
      } else {
        setPermissions(defaultPermissions);
      }
      
      setIsLoading(false);
    });

    // Periodically check removed

    // Safety timeout: Ensure we don't hang in a loading state forever
    // if Firebase Auth initialization takes too long or fails to fire
    const safetyTimeout = setTimeout(() => {
      setIsLoading(prev => {
        if (prev) {
          console.warn('Auth state loading timed out after 3s');
          return false;
        }
        return prev;
      });
    }, 3000);

    // Cleanup subscription and timeout on unmount
    return () => {
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  // INACTIVITY LOGOUT: Log out after 30 minutes of no interaction
  useEffect(() => {
    if (!user) return;

    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log('User inactive for 30 minutes. Signing out.');
        signOut(auth);
      }, INACTIVITY_LIMIT);
    };

    // Events to track user activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Start initial timer
    resetTimer();

    // Cleanup listeners and timer on unmount or user logout
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, permissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
