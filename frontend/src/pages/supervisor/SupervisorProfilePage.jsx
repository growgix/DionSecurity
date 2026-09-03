import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDataStore } from '../../context/DataStoreContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SupervisorProfilePage = () => {
  const { currentUser } = useAuth();
  const { employees, tasks } = useDataStore();

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-4xl mx-auto pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-2xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
          Operations Lead Profile
        </span>
        <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
          Field Supervisor Profile
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Field supervision credential, workforce management quota, and operational authority scope.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-2xl">
            {currentUser?.avatar || 'RT'}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-headline-sm text-2xl font-bold text-primary">{currentUser?.name || 'Inspector R. Thorne'}</h3>
              <StatusBadge status="active" text="Active On Duty" pulse={true} />
            </div>
            <p className="font-body-md text-secondary">
              ID: <strong className="font-code-sm text-primary">{currentUser?.id || 'SUP-2081'}</strong> • {currentUser?.title || 'Workforce & Facilities Supervisor'}
            </p>
            <p className="font-body-sm text-secondary">
              Station: <strong className="text-on-surface">{currentUser?.station || 'Facility Operations Hub'}</strong> • Contact: {currentUser?.phone}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-body-sm">
          <div>
            <span className="text-secondary block text-xs">Workforce Headcount Supervised</span>
            <span className="font-semibold text-on-surface">80 Enrolled Personnel</span>
          </div>
          <div>
            <span className="text-secondary block text-xs">Active Tasks in Stream</span>
            <span className="font-code-sm font-bold text-primary">{tasks.length} Operational Tasks</span>
          </div>
          <div>
            <span className="text-secondary block text-xs">Operational Authority</span>
            <span className="font-semibold text-on-surface">Muster, Dispatch & Wage Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};
