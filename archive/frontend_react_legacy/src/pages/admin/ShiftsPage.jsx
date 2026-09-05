import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const ShiftsPage = () => {
  const { employees, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [selectedShift, setSelectedShift] = useState('all');

  const morningCount = employees.filter(e => e.shift.includes('Morning')).length;
  const eveningCount = employees.filter(e => e.shift.includes('Evening')).length;
  const nightCount = employees.filter(e => e.shift.includes('Night')).length;

  const filteredEmployees = employees.filter(e => {
    if (selectedShift === 'all') return true;
    return e.shift.includes(selectedShift);
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Workforce Management</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Operational Roster</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Shift Rosters & Timings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            24/7 tri-shift rotation schedule, guard station allocations, and night patrol coverage quotas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            recordAudit('SHIFT_ROTATION_EXPORTED', 'Exported shift allocation roster');
            addToast('Shift roster schedule exported.', 'info');
          }}
          className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export Shift Roster</span>
        </button>
      </section>

      {/* 3 Primary Shift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase font-bold text-primary">Shift 01 • Morning</span>
            <StatusBadge status="active" text="Live Active" pulse={true} />
          </div>
          <h3 className="font-display-lg text-2xl text-on-surface font-bold">06:00 – 14:00</h3>
          <p className="font-body-sm text-secondary">
            Allocated: <strong className="text-primary font-bold">{morningCount} Workers</strong> • Supervisor: Inspector R. Thorne
          </p>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase font-bold text-secondary">Shift 02 • Evening</span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-secondary">Upcoming</span>
          </div>
          <h3 className="font-display-lg text-2xl text-on-surface font-bold">14:00 – 22:00</h3>
          <p className="font-body-sm text-secondary">
            Allocated: <strong className="text-on-surface font-semibold">{eveningCount} Workers</strong> • Supervisor: Officer K. Nair
          </p>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase font-bold text-secondary">Shift 03 • Night Patrol</span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-secondary">Armed Array</span>
          </div>
          <h3 className="font-display-lg text-2xl text-on-surface font-bold">22:00 – 06:00</h3>
          <p className="font-body-sm text-secondary">
            Allocated: <strong className="text-on-surface font-semibold">{nightCount} Workers</strong> • Supervisor: Commander M. Vance
          </p>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {/* Shift Personnel Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-primary">Shift Allocation Matrix</h3>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm"
          >
            <option value="all">All Shifts (80 Staff)</option>
            <option value="Morning">Morning Shift Only ({morningCount})</option>
            <option value="Evening">Evening Shift Only ({eveningCount})</option>
            <option value="Night">Night Shift Only ({nightCount})</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Employee</th>
                <th className="py-3.5 px-space-md">Role & Dept</th>
                <th className="py-3.5 px-space-md">Shift Timings</th>
                <th className="py-3.5 px-space-md">Station Assignment</th>
                <th className="py-3.5 px-space-md">Next Rotation</th>
                <th className="py-3.5 px-space-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs">
                      {emp.avatar}
                    </div>
                    <div>
                      <span className="font-semibold text-primary block">{emp.name}</span>
                      <span className="font-code-sm text-code-sm text-secondary">{emp.badgeNo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-label-md font-semibold text-on-surface">{emp.role}</p>
                    <p className="font-body-sm text-secondary text-xs">{emp.department}</p>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm font-semibold text-primary">
                    {emp.shift}
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-on-surface">
                    {emp.assignedLocation}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    Sep 15, 2026
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status={emp.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
