import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
  error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
};

const BORDER_COLORS = {
  success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/90 text-emerald-900',
  error: 'border-rose-200 dark:border-rose-800 bg-rose-50/90 text-rose-900',
  warning: 'border-amber-200 dark:border-amber-800 bg-amber-50/90 text-amber-900',
  info: 'border-sky-200 dark:border-sky-800 bg-sky-50/90 text-sky-900',
};

export function ToastItem({ toast, onRemove }) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 200);
  };

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
      }, toast.duration - 200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 ${
        BORDER_COLORS[toast.type] || BORDER_COLORS.info
      } ${isLeaving ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}
      style={{ minWidth: '320px', maxWidth: '420px' }}
    >
      {ICONS[toast.type] || ICONS.info}
      <div className="flex-1 text-sm font-medium leading-relaxed">
        {toast.message}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Close notification"
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  );
}

export default ToastContainer;
