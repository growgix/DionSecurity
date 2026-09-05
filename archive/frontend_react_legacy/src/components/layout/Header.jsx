import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDataStore } from '../../context/DataStoreContext';
import { useToast } from '../../context/ToastContext';

export const Header = ({ onOpenMobileMenu }) => {
  const { currentUser, switchRole, logout } = useAuth();
  const { triggerPanicFlag, resetToDefaults, visitors, tasks } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);

  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (currentUser?.role === 'guard') {
        navigate(`/guard/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/admin/residents?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const insideVisitorsCount = visitors.filter(v => v.status === 'inside').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'created' || t.status === 'assigned' || t.status === 'in_progress').length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-4 sm:px-6 lg:px-margin-page">
        {/* Left: Mobile hamburger & Logo Lockup */}
        <div className="flex items-center gap-2 sm:gap-space-md">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Logo */}
          <div
            onClick={() => {
              if (currentUser?.role === 'guard') navigate('/guard/dashboard');
              else if (currentUser?.role === 'supervisor') navigate('/supervisor/dashboard');
              else navigate('/admin/dashboard');
            }}
            className="flex items-center gap-2 sm:gap-space-sm cursor-pointer"
          >
            <img
              src="/src/assets/logo.svg"
              alt="Dion Ventures Logo"
              className="h-7 sm:h-8 w-auto object-contain"
            />
            <div className="flex flex-col hidden sm:flex">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">
                Dion Ventures
              </span>
              <span className="font-label-sm text-label-sm text-secondary uppercase leading-none mt-1">
                Security & Workforce
              </span>
            </div>
          </div>

          <div className="hidden md:block h-4 w-px bg-outline-variant/40 mx-space-xs"></div>

          {/* Estate Active Status Badge */}
          <div className="hidden xl:inline-flex items-center gap-space-xs px-space-sm py-space-2xs bg-secondary-container/40 rounded border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-secondary-container font-medium">
              Greenwood Heights Estate • Active
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-space-sm text-outline text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentUser?.role === 'guard' ? "Search person, flat, badge, vehicle..." : "Search guards, gate entries, residents, incident logs..."}
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-space-md py-1.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </form>
        </div>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-2 sm:gap-space-md">
          {/* Quick Panic Flag (Guard & Supervisor) */}
          {currentUser?.role === 'guard' && (
            <button
              type="button"
              onClick={() => setShowPanicConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-error-container text-error hover:bg-error hover:text-on-error transition-all shadow-sm font-label-sm text-label-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">e911_emergency</span>
              <span className="hidden sm:inline">Panic Flag</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifMenuRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none rounded-lg hover:bg-surface-container-high"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error border-2 border-surface-container-lowest"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-outline-variant/20 flex items-center justify-between">
                  <span className="font-headline-sm text-headline-sm text-primary">Live Alerts</span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                    3 unread
                  </span>
                </div>
                <div className="divide-y divide-outline-variant/15 max-h-72 overflow-y-auto">
                  <div className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => navigate('/admin/tasks')}>
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-error font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Urgent Task
                      </span>
                      <span className="font-code-sm text-code-sm text-outline">Just now</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-1 font-medium">
                      Elevator #02 Optical Sensor Recalibration assigned
                    </p>
                  </div>
                  <div className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => navigate('/guard/currently-inside')}>
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Gate Entry
                      </span>
                      <span className="font-code-sm text-code-sm text-outline">11:23 AM</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-1 font-medium">
                      Zomato Delivery entered Gate 01 for Unit A-202
                    </p>
                  </div>
                  <div className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => navigate('/supervisor/attendance')}>
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-[#A67C37] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A67C37]"></span> Roster Alert
                      </span>
                      <span className="font-code-sm text-code-sm text-outline">08:00 AM</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-1 font-medium">
                      5 workers absent from Morning Shift muster
                    </p>
                  </div>
                </div>
                <div className="p-2 border-t border-outline-variant/20 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/admin/audit-logs');
                    }}
                    className="font-label-sm text-label-sm text-primary hover:underline font-medium"
                  >
                    View All Security & Audit Logs →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-outline-variant/30"></div>

          {/* User Profile & Role Switcher Popover */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 sm:gap-space-sm pl-space-xs p-1 rounded-xl hover:bg-surface-container-high transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-md font-bold shadow-sm">
                {currentUser?.avatar || 'MV'}
              </div>
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="font-label-md text-label-md text-on-surface leading-none font-medium">
                  {currentUser?.name || 'Commander M. Vance'}
                </span>
                <span className="font-label-sm text-label-sm text-secondary leading-tight mt-0.5">
                  {currentUser?.roleLabel || currentUser?.title || 'Estate Lead'}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">unfold_more</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-outline-variant/20">
                  <p className="font-label-md text-label-md font-semibold text-primary">{currentUser?.name}</p>
                  <p className="font-body-sm text-body-sm text-secondary truncate">{currentUser?.email}</p>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-[10px] uppercase font-bold">
                    {currentUser?.roleLabel || currentUser?.role}
                  </div>
                </div>

                <div className="py-1 px-2">
                  <span className="block px-3 py-1 font-label-sm text-label-sm text-outline uppercase">
                    {currentUser?.role === 'admin' ? 'Portal Navigation' : 'Active Portal'}
                  </span>
                  {currentUser?.role === 'admin' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin/dashboard');
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-left transition-colors ${
                          location.pathname.startsWith('/admin') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        <span>Super Admin Portal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/guard/dashboard');
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-left transition-colors ${
                          location.pathname.startsWith('/guard') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">shield</span>
                        <span>Guard Operations Portal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/supervisor/dashboard');
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-left transition-colors ${
                          location.pathname.startsWith('/supervisor') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">supervisor_account</span>
                        <span>Field Supervisor Portal</span>
                      </button>
                    </>
                  ) : currentUser?.role === 'guard' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/guard/dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-left bg-secondary-container text-on-secondary-container font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px]">shield</span>
                        <span>Main Gate Guard Portal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/guard/profile');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-left hover:bg-surface-container-high text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                        <span>Duty Officer Profile</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/supervisor/dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-left bg-secondary-container text-on-secondary-container font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px]">supervisor_account</span>
                        <span>Field Supervisor Portal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/supervisor/profile');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-left hover:bg-surface-container-high text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                        <span>Supervisor Profile</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="border-t border-outline-variant/20 pt-1 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetToDefaults();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm text-secondary hover:text-on-surface hover:bg-surface-container-high text-left transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    <span>Reset Demo State</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setShowProfileMenu(false);
                      await logout();
                      navigate('/login');
                      addToast('Signed out of session.', 'info');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm text-error hover:bg-error-container/40 text-left transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Panic Confirmation Dialog */}
      {showPanicConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-error/30 space-y-4">
            <div className="flex items-center gap-3 text-error">
              <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">e911_emergency</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Confirm Emergency Panic Flag
                </h3>
                <p className="font-body-sm text-body-sm text-secondary">Gate 01 Main Perimeter Station</p>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              This will broadcast an immediate high-priority alarm to central command, lock down automated turnstiles, and alert all active patrol guards.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPanicConfirm(false)}
                className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerPanicFlag('Gate 01', 'Manual Emergency Panic');
                  setShowPanicConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-error text-on-error font-label-md font-semibold hover:bg-error/90 shadow-md"
              >
                Trigger Panic Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
