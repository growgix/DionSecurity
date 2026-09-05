import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AllVisitorsPage = () => {
  const { visitors, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const currentlyInsideCount = visitors.filter(v => v.status === 'inside').length;
  const expectedCount = visitors.filter(v => v.status === 'expected').length;
  const exitedCount = visitors.filter(v => v.status === 'exited').length;

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.hostUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || v.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Perimeter Gate Registry</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Visitor Stream</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Visitor Registry
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Live turnstile audit, visitor passes, host resident approvals, and vehicular access logs.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_VISITORS', 'Exported visitor telemetry log CSV');
              addToast('Visitor registry exported successfully.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Log</span>
          </button>
          <Link
            to="/guard/visitors/new"
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ New Visitor</span>
          </Link>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Visitors Logged Today"
          value={visitors.length + 80}
          icon="sensor_door"
          subtitle="Total pedestrian & cab throughput"
        />
        <MetricCard
          title="Currently Inside"
          value={currentlyInsideCount}
          icon="groups"
          subtitle="Live on estate premises"
          badge="Active"
          pulse={true}
        />
        <MetricCard
          title="Expected Visitors"
          value={expectedCount}
          icon="schedule"
          subtitle="Pre-authorized arrival codes"
        />
        <MetricCard
          title="Completed Exits"
          value={exitedCount + 65}
          icon="logout"
          subtitle="Badge cards surrendered"
        />
      </section>

      {/* Filter & Search Bar */}
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
              placeholder="Search by visitor name, pass ID, host unit, vehicle..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Categories</option>
              <option value="guest">Guest / Family</option>
              <option value="cab">Cab / Taxi</option>
              <option value="delivery">Delivery / Courier</option>
              <option value="food">Food Delivery</option>
              <option value="domestic">Domestic Staff</option>
              <option value="contractor">Contractor / Technician</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Statuses</option>
              <option value="inside">Currently Inside</option>
              <option value="expected">Expected</option>
              <option value="exited">Exited</option>
            </select>
          </div>
        </div>
      </section>

      {/* Visitors Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Pass ID & Visitor</th>
                <th className="py-3.5 px-space-md">Category</th>
                <th className="py-3.5 px-space-md">Host / Unit</th>
                <th className="py-3.5 px-space-md">Vehicle</th>
                <th className="py-3.5 px-space-md">Gate / Guard</th>
                <th className="py-3.5 px-space-md">Entry Time</th>
                <th className="py-3.5 px-space-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredVisitors.map((vis) => (
                <tr
                  key={vis.id}
                  onClick={() => navigate(`/admin/visitors/${vis.id}`)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <span className="font-code-sm text-code-sm font-bold text-primary px-2 py-0.5 rounded bg-surface-container">
                      {vis.badgeNumber}
                    </span>
                    <div>
                      <span className="font-semibold text-primary block">{vis.name}</span>
                      <span className="font-body-sm text-secondary text-xs">{vis.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      {vis.category}
                    </span>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-code-sm text-code-sm font-bold text-primary">{vis.hostUnit}</p>
                    <p className="font-body-sm text-secondary text-xs">{vis.hostResident}</p>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {vis.vehicleNumber}
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {vis.gate} ({vis.guardId})
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {vis.entryTime}
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status={vis.status} />
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
