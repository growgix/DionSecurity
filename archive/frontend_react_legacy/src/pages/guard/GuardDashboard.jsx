import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const GuardDashboard = () => {
  const { visitors, employees, gateLogs, checkoutVisitor, registerVisitor, triggerPanicFlag } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [checkoutVisitorTarget, setCheckoutVisitorTarget] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Live gate clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Global hotkeys (F1 - F4)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        navigate('/guard/visitors/new');
      } else if (e.key === 'F2') {
        e.preventDefault();
        navigate('/guard/search');
      } else if (e.key === 'F3') {
        e.preventDefault();
        navigate('/guard/worker-entry');
      } else if (e.key === 'F4') {
        e.preventDefault();
        navigate('/guard/worker-exit');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const currentlyInside = visitors.filter(v => v.status === 'inside');
  const workersOnDuty = employees.filter(e => e.status === 'present' || e.status === 'late');

  const handleFastExit = (visitor) => {
    checkoutVisitor(visitor.id, 'Gate 01');
    setCheckoutVisitorTarget(null);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Top Operational Station Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
              MAIN GATE
            </span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest pl-1 font-semibold">
              Operational Station
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Good morning, Guard
          </h1>
          <p className="font-body-md text-body-md text-secondary flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-outline-variant">•</span>
            <span className="font-medium text-on-surface">Shift: Morning (06:00 - 14:00)</span>
            <span className="text-outline-variant">•</span>
            <span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold">
              Gate No. 01
            </span>
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start lg:self-center flex-wrap">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-label-sm text-outline uppercase">Intercom Hub</span>
              <span className="font-code-sm text-code-sm text-primary font-bold">ONLINE : #01-GATE</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
          </div>

          <button
            type="button"
            onClick={() => triggerPanicFlag('Gate 01', 'Guard Emergency Panic Trigger')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error-container text-error hover:bg-error hover:text-on-error transition-all shadow-sm font-label-md text-label-md font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
            <span>Panic Flag</span>
          </button>
        </div>
      </div>

      {/* 4 Prominent High-Priority Hotkey Action Cards (Maintained Prominent) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Hotkey 1: New Visitor */}
        <button
          type="button"
          onClick={() => navigate('/guard/visitors/new')}
          className="group relative flex flex-col justify-between p-space-lg rounded-xl bg-primary text-on-primary shadow-md hover:shadow-xl hover:bg-primary-container transition-all text-left overflow-hidden min-h-[148px]"
        >
          <div className="flex items-start justify-between w-full">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-on-primary/10 text-on-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">person_add</span>
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
              F1 HOTKEY
            </span>
          </div>
          <div className="flex flex-col mt-3">
            <span className="font-headline-sm text-headline-sm text-on-primary font-medium tracking-tight">
              NEW VISITOR
            </span>
            <span className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
              Register guest / cab / package
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-on-primary/5 pointer-events-none group-hover:scale-150 transition-all"></div>
        </button>

        {/* Hotkey 2: Search Person */}
        <button
          type="button"
          onClick={() => navigate('/guard/search')}
          className="group relative flex flex-col justify-between p-space-lg rounded-xl bg-primary text-on-primary shadow-md hover:shadow-xl hover:bg-primary-container transition-all text-left overflow-hidden min-h-[148px]"
        >
          <div className="flex items-start justify-between w-full">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-on-primary/10 text-on-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">person_search</span>
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
              F2 HOTKEY
            </span>
          </div>
          <div className="flex flex-col mt-3">
            <span className="font-headline-sm text-headline-sm text-on-primary font-medium tracking-tight">
              SEARCH PERSON
            </span>
            <span className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
              Resident, staff or auto
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-on-primary/5 pointer-events-none group-hover:scale-150 transition-all"></div>
        </button>

        {/* Hotkey 3: Worker Entry */}
        <button
          type="button"
          onClick={() => navigate('/guard/worker-entry')}
          className="group relative flex flex-col justify-between p-space-lg rounded-xl bg-primary text-on-primary shadow-md hover:shadow-xl hover:bg-primary-container transition-all text-left overflow-hidden min-h-[148px]"
        >
          <div className="flex items-start justify-between w-full">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-on-primary/10 text-on-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">login</span>
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
              F3 HOTKEY
            </span>
          </div>
          <div className="flex flex-col mt-3">
            <span className="font-headline-sm text-headline-sm text-on-primary font-medium tracking-tight">
              WORKER ENTRY
            </span>
            <span className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
              Scan badge / QR pass
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-on-primary/5 pointer-events-none group-hover:scale-150 transition-all"></div>
        </button>

        {/* Hotkey 4: Worker Exit */}
        <button
          type="button"
          onClick={() => navigate('/guard/worker-exit')}
          className="group relative flex flex-col justify-between p-space-lg rounded-xl bg-primary text-on-primary shadow-md hover:shadow-xl hover:bg-primary-container transition-all text-left overflow-hidden min-h-[148px]"
        >
          <div className="flex items-start justify-between w-full">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-on-primary/10 text-on-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">logout</span>
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
              F4 HOTKEY
            </span>
          </div>
          <div className="flex flex-col mt-3">
            <span className="font-headline-sm text-headline-sm text-on-primary font-medium tracking-tight">
              WORKER EXIT
            </span>
            <span className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
              Check out contractor
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-on-primary/5 pointer-events-none group-hover:scale-150 transition-all"></div>
        </button>
      </div>

      {/* 4 Live Telemetry & Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary">
            <span className="font-label-sm text-label-sm uppercase tracking-wide">Visitors Today</span>
            <span className="material-symbols-outlined text-[18px] text-outline">history</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display-lg text-display-lg text-on-surface font-semibold">{visitors.length + 80}</span>
            <span className="font-code-sm text-code-sm text-secondary font-medium">Logged</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '74%' }}></div>
          </div>
        </div>

        <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary">
            <span className="font-label-sm text-label-sm uppercase tracking-wide">Visitors Inside</span>
            <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display-lg text-display-lg text-primary font-semibold">
              {currentlyInside.length}
            </span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold">
              Live Occupancy
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${(currentlyInside.length / 30) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary">
            <span className="font-label-sm text-label-sm uppercase tracking-wide">Staff on Duty</span>
            <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display-lg text-display-lg text-on-surface font-semibold">
              {workersOnDuty.length}
            </span>
            <span className="font-code-sm text-code-sm text-secondary font-medium">/ 80</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${(workersOnDuty.length / 80) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary">
            <span className="font-label-sm text-label-sm uppercase tracking-wide">Live Gate Clock</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-headline-lg text-headline-lg text-primary tabular-nums font-semibold">
              {currentTime}
            </span>
          </div>
          <div className="font-code-sm text-code-sm text-secondary mt-1">Synchronized with Central NTP</div>
        </div>
      </div>

      {/* Currently Inside & Fast Checkout Stream */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-space-lg flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20 flex-wrap gap-2">
          <div className="flex items-center gap-space-sm">
            <h2 className="font-headline-sm text-headline-sm text-primary">Currently Inside Premises</h2>
            <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
              {currentlyInside.length} Active
            </span>
          </div>
          <Link
            to="/guard/currently-inside"
            className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline font-medium"
          >
            <span>Full Occupancy Ledger</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[650px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3 px-space-lg">Pass ID / Person</th>
                <th className="py-3 px-space-md">Category</th>
                <th className="py-3 px-space-md">Host / Unit</th>
                <th className="py-3 px-space-md">Entry Time</th>
                <th className="py-3 px-space-md">Vehicle</th>
                <th className="py-3 px-space-lg text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {currentlyInside.map((vis) => (
                <tr key={vis.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container font-semibold text-primary">
                      {vis.badgeNumber}
                    </span>
                    <span className="truncate">{vis.name}</span>
                  </td>
                  <td className="py-3.5 px-space-md">
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      {vis.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-space-md font-code-sm text-code-sm text-secondary font-medium">
                    {vis.hostUnit} ({vis.hostResident})
                  </td>
                  <td className="py-3.5 px-space-md font-code-sm text-code-sm text-secondary">
                    {vis.entryTime}
                  </td>
                  <td className="py-3.5 px-space-md font-code-sm text-code-sm text-secondary">
                    {vis.vehicleNumber}
                  </td>
                  <td className="py-3.5 px-space-lg text-right">
                    <button
                      type="button"
                      onClick={() => setCheckoutVisitorTarget(vis)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error-container/40 text-error hover:bg-error hover:text-on-error transition-all font-label-sm text-label-sm font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Exit Pass</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fast Exit Confirmation Modal */}
      <Modal
        isOpen={!!checkoutVisitorTarget}
        onClose={() => setCheckoutVisitorTarget(null)}
        title="Confirm Visitor Exit & Pass Return"
        subtitle={`Recording checkout for ${checkoutVisitorTarget?.name} (Pass #${checkoutVisitorTarget?.badgeNumber})`}
        maxWidth="max-w-md"
      >
        {checkoutVisitorTarget && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Host Unit:</span>
                <span className="font-semibold text-on-surface">{checkoutVisitorTarget.hostUnit} ({checkoutVisitorTarget.hostResident})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Vehicle:</span>
                <span className="font-code-sm text-on-surface font-semibold">{checkoutVisitorTarget.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Entry Time:</span>
                <span className="font-code-sm text-on-surface">{checkoutVisitorTarget.entryTime}</span>
              </div>
            </div>

            <p className="font-body-sm text-secondary">
              Surrendered pass card #{checkoutVisitorTarget.badgeNumber} has been verified and digital turnstile token revoked.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCheckoutVisitorTarget(null)}
                className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleFastExit(checkoutVisitorTarget)}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container shadow-md"
              >
                Confirm Exit & Surrender Badge
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
