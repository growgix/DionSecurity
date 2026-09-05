import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AttendanceHistoryPage = () => {
  const { employees, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [dateFilter, setDateFilter] = useState('September 2026');
  const [deptFilter, setDeptFilter] = useState('all');

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Workforce Governance</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Historical Muster</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Attendance History & Audit
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Monthly attendance trends, biometric muster logs, wage reconciliation reports, and historical shift sign-offs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            recordAudit('EXPORT_MONTHLY_ATTENDANCE', 'Exported monthly attendance ledger');
            addToast('Monthly attendance report exported.', 'info');
          }}
          className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export Monthly Audit</span>
        </button>
      </section>

      {/* Monthly Metrics Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Monthly Average Attendance"
          value="92.4%"
          icon="check_circle"
          subtitle="Across 80 enrolled workers"
          delta="1.4% vs Aug"
          deltaType="up"
        />
        <MetricCard
          title="Total Shifts Logged"
          value="2,480"
          icon="schedule"
          subtitle="Tri-shift perimeter coverage"
        />
        <MetricCard
          title="Overtime Hours Logged"
          value="184 hrs"
          icon="more_time"
          subtitle="Security & facilities interventions"
        />
        <MetricCard
          title="Approved Sick / Annual Leave"
          value="48 Days"
          icon="event_available"
          subtitle="Reconciled with payroll"
        />
      </section>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-primary">Historical Attendance Roster (September 2026)</h3>
          <div className="flex items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm"
            >
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Employee</th>
                <th className="py-3.5 px-space-md">Department</th>
                <th className="py-3.5 px-space-md">Days Present</th>
                <th className="py-3.5 px-space-md">Days Absent</th>
                <th className="py-3.5 px-space-md">Approved Leave</th>
                <th className="py-3.5 px-space-md">Compliance Rate</th>
                <th className="py-3.5 px-space-lg text-right">Payroll Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {employees.slice(0, 12).map((emp, index) => (
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
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {emp.department}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm font-semibold text-primary">
                    {28 - (index % 3)} / 30 Days
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-error">
                    {index % 3} Days
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {index % 2} Days
                  </td>
                  <td className="py-4 px-space-md">
                    <div className="flex items-center gap-2">
                      <span className="font-code-sm font-semibold">{95 - (index % 4) * 2}%</span>
                      <div className="w-12 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${95 - (index % 4) * 2}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status="cleared" text="Verified" />
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
