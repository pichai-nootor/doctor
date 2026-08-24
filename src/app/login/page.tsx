'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let success = false;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      success = true;
      router.push('/'); // Redirect to dashboard on success
    } catch (err: any) {
      console.error('Login error:', err);
      // Map common Firebase errors to user-friendly messages
      const errorCode = err.code || '';
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setError('Incorrect Email or Password.');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (errorCode === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled.');
      } else {
        setError(`An error occurred: ${errorCode || 'Please try again'}`);
      }
    } finally {
      if (!success) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 items-center justify-center">
      
      {/* Centered Form */}
      <div className="w-full max-w-md p-8 bg-white z-10 shadow-2xl rounded-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Logo & Header */}
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="relative flex items-center justify-center shrink-0">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-auto text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                  fill="none" 
                  viewBox="0 0 32 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l1.5-6 2.5 12 1.5-6h2l1.5-8 2 16 1.5-8h4.5" />
                  <circle cx="28" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col whitespace-nowrap min-w-0 pt-1">
                <h1 className="font-outfit text-3xl tracking-tighter leading-none text-slate-900">
                  <span className="font-black">Cath</span>
                  <span className="font-light text-emerald-500">Lab</span>
                </h1>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5 opacity-90 truncate text-left">Management</span>
              </div>
            </div>
          </div>
          {/* Form */}
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl animate-shake">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium text-slate-800 transition-all placeholder:text-slate-400"
                placeholder="doctor@hospital.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium text-slate-800 transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-4 px-4 rounded-2xl shadow-[0_8px_30px_rgb(16,185,129,0.3)] text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform active:scale-95 transition-all mt-8 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : 'Sign in to workspace'}
            </button>
          </form>

      </div>
    </div>
  );
}
