'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast styling configuration
const toastStyles: Record<ToastType, { bg: string; border: string; icon: typeof CheckCircle; iconColor: string; textColor: string }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle,
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-900',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircle,
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: AlertCircle,
    iconColor: 'text-amber-600',
    textColor: 'text-amber-900',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
  },
};

// Individual Toast Item Component
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const style = toastStyles[toast.type];
  const Icon = style.icon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border
        ${style.bg} ${style.border}
        shadow-lg animate-slide-in-right
        min-w-[320px] max-w-[420px]
      `}
      role="alert"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${style.textColor}`}>{toast.title}</p>
        {toast.message && (
          <p className={`text-sm mt-0.5 ${style.textColor} opacity-80`}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className={`flex-shrink-0 p-1 rounded-lg transition-colors ${style.textColor} opacity-60 hover:opacity-100`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast Container Component
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration (default 3 seconds)
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
