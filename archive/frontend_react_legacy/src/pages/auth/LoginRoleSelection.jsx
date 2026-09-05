import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginRoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin@dionsecurity.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [station, setStation] = useState('Gate 01 - Main North Terminal');

  const { login, currentUser, isAuthenticated, isLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // If already authenticated, redirect to portal dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser) {
      if (currentUser.role === 'guard') {
        navigate('/guard/dashboard', { replace: true });
      } else if (currentUser.role === 'supervisor') {
        navigate('/supervisor/dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, currentUser, navigate]);

  const handleRoleSelect = (roleKey, defaultEmail) => {
    setSelectedRole(roleKey);
    setEmail(defaultEmail);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      addToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email.trim(), password);
      setLoading(false);

      if (result.success) {
        const userRole = result.user?.role || selectedRole;
        addToast(`Authenticated successfully as ${userRole.toUpperCase()}. Welcome back!`, 'success');

        if (userRole === 'guard') {
          navigate('/guard/dashboard');
        } else if (userRole === 'supervisor') {
          navigate('/supervisor/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        if (result.status === 401) {
          addToast('Invalid email or password. Please verify your credentials.', 'error');
        } else if (result.status === 403) {
          addToast('Account is inactive or suspended. Please contact security administration.', 'error');
        } else {
          addToast(result.error || 'Authentication failed. Please verify credentials.', 'error');
        }
      }
    } catch (err) {
      setLoading(false);
      addToast('Unable to connect to authentication gateway.', 'error');
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-gutter-mobile md:p-gutter-desktop bg-background">
      <div className="flex flex-col w-full max-w-6xl mx-auto py-space-md sm:py-space-xl md:py-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-center">
          
          {/* Left Column: Brand Presentation & Estate Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-space-lg sm:space-y-space-xl pr-0 lg:pr-space-lg">
            {/* Standard Overline Badge */}
            <div className="inline-flex items-center space-x-space-xs self-start px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
              <span className="tracking-widest uppercase font-semibold">Enterprise Estate Operations v2.4</span>
              <span className="text-outline-variant">•</span>
              <span className="font-code-sm text-code-sm">ISO 27001 Certified</span>
            </div>

            {/* Identity & Master Title Lockup */}
            <div className="space-y-space-sm">
              <div className="flex items-center space-x-space-sm">
                <img
                  src="/src/assets/logo.svg"
                  alt="Dion Ventures Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="pt-space-xs">
                <h1 className="font-headline-lg text-headline-lg sm:text-[34px] lg:font-display-lg lg:text-display-lg text-primary tracking-tight font-normal leading-tight">
                  Society Security & Workforce Management
                </h1>
              </div>
              <p className="font-body-lg text-body-lg text-secondary leading-relaxed pt-space-2xs max-w-lg">
                Simple, secure management for society operations, security checkpoints, and community workforce telemetry. Crafted for uncompromising operational poise.
              </p>
            </div>

            {/* Technical Telemetry / Status Ledger Mosaic */}
            <div className="grid grid-cols-2 gap-space-md pt-space-xs">
              <div className="bg-surface-container-low p-space-md rounded-xl shadow-sm space-y-space-2xs">
                <div className="flex items-center space-x-1.5 text-secondary">
                  <span className="material-symbols-outlined text-[16px]">shield</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Perimeter Array</span>
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">14 Gates Active</p>
                <p className="font-body-sm text-body-sm text-secondary">Zero telemetry latency</p>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-xl shadow-sm space-y-space-2xs">
                <div className="flex items-center space-x-1.5 text-secondary">
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Duty Roster</span>
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">42 Guards Deployed</p>
                <p className="font-body-sm text-body-sm text-secondary">Synchronized shift logs</p>
              </div>
            </div>

            {/* Architecture Footnote */}
            <div className="flex items-center space-x-space-sm pt-space-xs text-secondary">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span className="font-body-sm text-body-sm">
                Restricted administrative access. Biometric & MFA session audit enabled.
              </span>
            </div>
          </div>

          {/* Right Column: Architectural Login Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-outline-variant/30">
              {/* Header */}
              <div className="space-y-1 mb-space-lg">
                <h2 className="font-headline-md text-headline-md text-primary font-normal tracking-tight">
                  Welcome back
                </h2>
                <p className="font-body-md text-body-md text-secondary">
                  Please select your operational role to continue
                </p>
              </div>

              {/* Role Selector Segments */}
              <div className="mb-space-lg">
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-space-xs font-semibold">
                  Operational Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-container-high rounded-xl" role="tablist">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('admin', 'admin@dionsecurity.com')}
                    className={`role-btn py-2 px-3 rounded-lg font-label-md text-label-md text-center transition-all duration-150 flex items-center justify-center space-x-1 ${
                      selectedRole === 'admin'
                        ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                        : 'text-secondary hover:text-on-surface hover:bg-surface-container-lowest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('guard', 'c.miller@dionventures.internal')}
                    className={`role-btn py-2 px-3 rounded-lg font-label-md text-label-md text-center transition-all duration-150 flex items-center justify-center space-x-1 ${
                      selectedRole === 'guard'
                        ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                        : 'text-secondary hover:text-on-surface hover:bg-surface-container-lowest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">local_police</span>
                    <span>Guard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('supervisor', 'r.thorne.sup@dionventures.internal')}
                    className={`role-btn py-2 px-3 rounded-lg font-label-md text-label-md text-center transition-all duration-150 flex items-center justify-center space-x-1 ${
                      selectedRole === 'supervisor'
                        ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                        : 'text-secondary hover:text-on-surface hover:bg-surface-container-lowest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">supervisor_account</span>
                    <span>Supervisor</span>
                  </button>
                </div>
              </div>

              {/* Sign-In Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-space-md">
                {/* Corporate Email Input Field */}
                <div className="space-y-1.5">
                  <label className="block font-label-md text-label-md text-on-surface font-medium" htmlFor="emailInput">
                    Corporate Email / Account Reference
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none">
                      person
                    </span>
                    <input
                      id="emailInput"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@dionsecurity.com, c.miller@dionventures.internal"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface font-body-md text-body-md placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Password / Access Key Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block font-label-md text-label-md text-on-surface font-medium" htmlFor="passwordInput">
                      Passcode / Biometric Key
                    </label>
                    <span className="font-label-sm text-label-sm text-secondary hover:text-primary cursor-pointer">
                      Forgot key?
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none">
                      lock
                    </span>
                    <input
                      id="passwordInput"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface font-body-md text-body-md placeholder:text-outline/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Security Station selection for Guard */}
                {selectedRole === 'guard' && (
                  <div className="space-y-1.5">
                    <label className="block font-label-md text-label-md text-on-surface font-medium">
                      Guard Station Assignment
                    </label>
                    <select
                      value={station}
                      onChange={(e) => setStation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    >
                      <option value="Gate 01 - Main North Terminal">Gate 01 - Main North Terminal</option>
                      <option value="Gate 02 - East Service Entrance">Gate 02 - East Service Entrance</option>
                      <option value="Gate 03 - West Resident Exit">Gate 03 - West Resident Exit</option>
                      <option value="Gate 04 - Clubhouse & Sector 4">Gate 04 - Clubhouse & Sector 4</option>
                    </select>
                  </div>
                )}

                {/* Authenticate Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-70 mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Enter Secure Workspace</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Quick Select Hint */}
              <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center">
                <p className="font-body-sm text-body-sm text-secondary">
                  Ready-to-use corporate roles. Click any role tab to prefill account email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
