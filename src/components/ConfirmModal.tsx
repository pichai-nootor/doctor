'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isLoading ? onCancel : undefined}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-6 text-center">
          <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
            {isLoading ? (
              <div className="w-7 h-7 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : isDestructive ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 font-bold leading-relaxed">{message}</p>
        </div>
        
        <div className="flex border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="flex-1 px-4 py-4 text-sm font-black text-slate-400 hover:bg-slate-50 transition-colors border-r border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 px-4 py-4 text-sm font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDestructive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
