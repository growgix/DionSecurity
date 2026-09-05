import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map(toast => {
          let bgClass = 'bg-primary-container text-on-primary border-outline-variant/30';
          let icon = 'check_circle';
          
          if (toast.type === 'error') {
            bgClass = 'bg-error-container text-on-error-container border-error/30';
            icon = 'error';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-[#FAF5EC] text-[#A67C37] border-[#A67C37]/30';
            icon = 'warning';
          } else if (toast.type === 'info') {
            bgClass = 'bg-surface-container-high text-on-surface border-outline-variant/40';
            icon = 'info';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-lg border text-body-sm font-body-sm transition-all duration-200 transform translate-y-0 ${bgClass}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">{icon}</span>
                <span className="font-medium truncate">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
