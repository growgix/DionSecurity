import React, { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className={`relative bg-surface-container-lowest rounded-2xl w-full ${maxWidth} p-5 sm:p-7 shadow-2xl border border-outline-variant/30 z-50 my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-outline-variant/20 shrink-0">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary tracking-tight font-normal">
              {title}
            </h3>
            {subtitle && (
              <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-high transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 pt-4 pb-2 pr-1 -mr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
