import React from 'react';
import { useToast } from '../../contexts/ToastContext.jsx';

export function ToastContainer() {
  const { toasts } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
