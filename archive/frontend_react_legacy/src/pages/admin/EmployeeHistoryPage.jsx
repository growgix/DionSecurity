import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const EmployeeHistoryPage = () => {
  const { employees, auditLogs, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  const workforceAudits = auditLogs.filter(l => 
    l.actor.includes('Guard') || l.actor.includes('Technician') || l.actor.includes('Supervisor') || l.action.includes('ATTENDANCE') || l.action.includes('TASK') || l.action.includes('WORKER')
  );

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Workforce Management</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Service Ledger</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Employee Activity History
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Historical audit stream of workforce muster check-ins, station handovers, task executions, and supervisor sign-offs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            recordAudit('WORKFORCE_HISTORY_EXPORTED', 'Exported workforce activity audit history');
            addToast('Workforce service audit exported.', 'info');
          }}
          className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export Service Audit</span>
        </button>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Service Logs"
          value="1,420"
          icon="history"
          subtitle="All-time recorded duty events"
        />
        <MetricCard
          title="Shifts Completed"
          value="892"
          icon="check_circle"
          subtitle="Current calendar month"
        />
        <MetricCard
          title="Task Sign-offs"
          value="240"
          icon="verified"
          subtitle="Supervisor inspected"
        />
        <MetricCard
          title="Commendations"
          value="18"
          icon="military_tech"
          subtitle="Exemplary duty flags"
        />
      </section>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-primary">Service Audit Log</h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker, action..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Time</th>
                <th className="py-3.5 px-space-md">Actor / Personnel</th>
                <th className="py-3.5 px-space-md">Event Type</th>
                <th className="py-3.5 px-space-md">Details</th>
                <th className="py-3.5 px-space-lg text-right">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {workforceAudits.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-code-sm text-code-sm text-primary font-semibold">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-space-md font-semibold text-on-surface">
                    {log.actor}
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-label-sm px-2.5 py-0.5 rounded bg-surface-container font-mono text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {log.details}
                  </td>
                  <td className="py-4 px-space-lg text-right font-code-sm text-code-sm text-secondary">
                    {log.ip}
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
