import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const GateLogPage = () => {
  const { gateLogs, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [gateFilter, setGateFilter] = useState('all');

  const totalTrips = gateLogs.length + 135;
  const entriesCount = gateLogs.filter(l => l.type === 'ENTRY').length + 80;
  const exitsCount = gateLogs.filter(l => l.type === 'EXIT').length + 55;

  const filteredLogs = gateLogs.filter(log => {
    const matchesSearch = log.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.guard.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesGate = gateFilter === 'all' || log.gate.includes(gateFilter);
    return matchesSearch && matchesType && matchesGate;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Perimeter Operations</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Gate Audit Ledger</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Today's Gate Log
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Chronological audit stream of pedestrian turnstile clearances, vehicle boom barrier trips, and officer authorizations.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_GATE_LOG', "Exported today's gate log CSV");
              addToast("Today's chronological gate log exported.", 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Gate Audit</span>
          </button>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Gate Throughput"
          value={totalTrips}
          icon="swap_vert"
          subtitle="Trips across all 4 estate gates"
        />
        <MetricCard
          title="Entry Clearances"
          value={entriesCount}
          icon="login"
          subtitle="Vehicles and pedestrian entries"
          badge="Inbound"
        />
        <MetricCard
          title="Exit Clearances"
          value={exitsCount}
          icon="logout"
          subtitle="Vehicles and pedestrian exits"
        />
        <MetricCard
          title="Peak Traffic Window"
          value="08:00 - 09:30 AM"
          icon="timeline"
          subtitle="Morning domestic & delivery peak"
        />
      </section>

      {/* Filter Toolbar */}
      <section className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by person name, unit, vehicle, officer..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Trips (Entry & Exit)</option>
              <option value="ENTRY">Inbound (ENTRY Only)</option>
              <option value="EXIT">Outbound (EXIT Only)</option>
            </select>

            <select
              value={gateFilter}
              onChange={(e) => setGateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Gates (1 - 4)</option>
              <option value="Gate 01">Gate 01 (Main North)</option>
              <option value="Gate 02">Gate 02 (East Service)</option>
              <option value="Gate 03">Gate 03 (West Exit)</option>
              <option value="Gate 04">Gate 04 (Clubhouse)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Gate Log Stream Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Time</th>
                <th className="py-3.5 px-space-md">Trip Type</th>
                <th className="py-3.5 px-space-md">Person / Category</th>
                <th className="py-3.5 px-space-md">Destination</th>
                <th className="py-3.5 px-space-md">Vehicle</th>
                <th className="py-3.5 px-space-md">Gate Station</th>
                <th className="py-3.5 px-space-md">Duty Officer</th>
                <th className="py-3.5 px-space-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-code-sm text-code-sm font-semibold text-primary">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-space-md">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-xs font-bold ${
                      log.type === 'ENTRY' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {log.type === 'ENTRY' ? 'login' : 'logout'}
                      </span>
                      <span>{log.type}</span>
                    </span>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-semibold text-on-surface">{log.person}</p>
                    <p className="font-body-sm text-secondary text-xs">{log.category}</p>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm font-bold text-primary">
                    {log.destination}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {log.vehicle}
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {log.gate}
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {log.guard}
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status="cleared" text={log.status} />
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
