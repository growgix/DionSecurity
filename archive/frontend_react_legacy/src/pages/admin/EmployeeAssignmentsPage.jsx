import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const EmployeeAssignmentsPage = () => {
  const { employees, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [locationFilter, setLocationFilter] = useState('all');

  const filteredEmployees = employees.filter(e => {
    if (locationFilter === 'all') return true;
    return e.assignedLocation.includes(locationFilter);
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Workforce Management</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Station Deployment</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Employee Assignments
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Location-based workforce assignments across perimeter boom gates, towers, basements, and amenity decks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            recordAudit('ASSIGNMENTS_EXPORTED', 'Exported station deployment assignments');
            addToast('Deployment matrix exported.', 'info');
          }}
          className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export Deployment Matrix</span>
        </button>
      </section>

      {/* 4 Location Stations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md font-semibold text-primary">Main Gate 01</span>
            <StatusBadge status="active" text="Full Quota" />
          </div>
          <p className="font-body-sm text-secondary">Perimeter boom barrier & turnstile desk</p>
          <p className="font-display-lg text-xl font-bold text-on-surface">20 Personnel</p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md font-semibold text-primary">Tower A & B Service Bay</span>
            <StatusBadge status="active" text="Active" />
          </div>
          <p className="font-body-sm text-secondary">Elevator maintenance & tower reception</p>
          <p className="font-display-lg text-xl font-bold text-on-surface">20 Personnel</p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md font-semibold text-primary">Central Amenity Deck</span>
            <StatusBadge status="active" text="Active" />
          </div>
          <p className="font-body-sm text-secondary">Clubhouse, swimming pool & parkway</p>
          <p className="font-display-lg text-xl font-bold text-on-surface">20 Personnel</p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md font-semibold text-primary">Basement -1 & -2 Bay</span>
            <StatusBadge status="active" text="Active" />
          </div>
          <p className="font-body-sm text-secondary">Pump room, generator & CCTV hub</p>
          <p className="font-display-lg text-xl font-bold text-on-surface">20 Personnel</p>
        </div>
      </div>

      {/* Deployment Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-primary">Station Assignment Table</h3>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm"
          >
            <option value="all">All Deployment Stations</option>
            <option value="Main Gate 01">Main Gate 01</option>
            <option value="Tower A & B">Tower A & B Service Bay</option>
            <option value="Central Garden">Central Amenity Deck</option>
            <option value="Basement">Basement Level -1 & -2</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Employee</th>
                <th className="py-3.5 px-space-md">Role & Dept</th>
                <th className="py-3.5 px-space-md">Station Assignment</th>
                <th className="py-3.5 px-space-md">Shift Schedule</th>
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
                  <td className="py-4 px-space-md font-semibold text-on-surface">
                    {emp.assignedLocation}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {emp.shift}
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
