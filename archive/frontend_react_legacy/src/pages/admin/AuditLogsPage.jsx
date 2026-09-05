import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AuditLogsPage = () => {
  const { auditLogs, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.ip.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Compliance & Forensics</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Immutable Ledger</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Security & System Audit Logs
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Cryptographically sealed timeline of all gate passes, biometric verifications, task mutations, and privileged user actions.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_AUDIT_LOGS', 'Exported forensic system audit trail CSV');
              addToast('Audit trail ledger exported.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Forensic Log</span>
          </button>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Audit Events"
          value={auditLogs.length + 380}
          icon="fingerprint"
          subtitle="Recorded in active ledger"
        />
        <MetricCard
          title="Perimeter Gate Actions"
          value="240"
          icon="sensor_door"
          subtitle="Passes, entries & exits"
        />
        <MetricCard
          title="Privileged System Edits"
          value="84"
          icon="manage_accounts"
          subtitle="Admin & supervisor overrides"
        />
        <MetricCard
          title="Integrity Status"
          value="100% Sealed"
          icon="verified_user"
          subtitle="Zero ledger tampering"
          badge="Verified"
        />
      </section>

      {/* Filter Toolbar */}
      <section className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by actor, action, details, IP..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
          >
            <option value="all">All Action Categories</option>
            <option value="VISITOR">Visitor Operations</option>
            <option value="GATE">Gate Clearances</option>
            <option value="ATTENDANCE">Workforce Attendance</option>
            <option value="TASK">Task Lifecycle</option>
            <option value="USER">User Management</option>
            <option value="EXPORT">Data Exports</option>
          </select>
        </div>
      </section>

      {/* Audit Logs Stream Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Timestamp</th>
                <th className="py-3.5 px-space-md">Actor</th>
                <th className="py-3.5 px-space-md">Action Code</th>
                <th className="py-3.5 px-space-md">Forensic Details</th>
                <th className="py-3.5 px-space-lg text-right">Terminal / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-code-sm text-code-sm font-semibold text-primary">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-space-md font-semibold text-on-surface">
                    {log.actor}
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-code-sm text-xs font-bold px-2 py-0.5 rounded bg-surface-container text-primary">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-on-surface">
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
