import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Auto-close on route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Prevent background scrolling while mobile drawer is open
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
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out drawer panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-surface-container-lowest shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
        {/* Mobile drawer header */}
        <div className="h-16 px-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/src/assets/logo.svg" alt="Dion Ventures" className="h-7 w-auto" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Sidebar content in drawer */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar onItemClick={onClose} isMobile={true} />
        </div>
      </div>
    </div>
  );
};
