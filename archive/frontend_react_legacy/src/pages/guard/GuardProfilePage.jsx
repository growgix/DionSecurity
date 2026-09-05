import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDataStore } from '../../context/DataStoreContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const GuardProfilePage = () => {
  const { currentUser } = useAuth();
  const { gateLogs } = useDataStore();

  const officerLogs = gateLogs.filter(l => l.guard.includes('Miller') || l.guard.includes(currentUser?.name || ''));

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-4xl mx-auto pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-2xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
          Security Terminal User Profile
        </span>
        <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
          Guard Profile & Duty Shift
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Active duty session credentials, station assignment, and daily turnstile throughput metrics.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-2xl">
            {currentUser?.avatar || 'CM'}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-headline-sm text-2xl font-bold text-primary">{currentUser?.name || 'Officer C. Miller'}</h3>
              <StatusBadge status="active" text="Active On Duty" pulse={true} />
            </div>
            <p className="font-body-md text-secondary">
              ID: <strong className="font-code-sm text-primary">{currentUser?.id || 'GRD-1044'}</strong> • {currentUser?.title || 'Perimeter Security Officer'}
            </p>
            <p className="font-body-sm text-secondary">
              Duty Station: <strong className="text-on-surface">{currentUser?.station || 'Main Gate 01'}</strong> • Contact: {currentUser?.phone}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-body-sm">
          <div>
            <span className="text-secondary block text-xs">Active Shift</span>
            <span className="font-semibold text-on-surface">Morning (06:00 - 14:00)</span>
          </div>
          <div>
            <span className="text-secondary block text-xs">Gate Clearances Logged</span>
            <span className="font-code-sm font-bold text-primary">{officerLogs.length + 86} Today</span>
          </div>
          <div>
            <span className="text-secondary block text-xs">Security Clearance</span>
            <span className="font-semibold text-on-surface">Level 2 (Boom Barrier & Turnstiles)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
