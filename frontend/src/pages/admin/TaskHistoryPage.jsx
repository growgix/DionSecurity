import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const TaskHistoryPage = () => {
  const { tasks, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'verified');

  const filtered = completedTasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignedToName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Operations Governance</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Historical Work Orders</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Task History & Sign-Offs
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Archive of completed work orders, maintenance logs, parts replacements, and inspector certifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            recordAudit('TASK_ARCHIVE_EXPORTED', 'Exported completed tasks archive');
            addToast('Task history archive exported.', 'info');
          }}
          className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export Archive</span>
        </button>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Completed Work Orders"
          value={completedTasks.length + 180}
          icon="verified"
          subtitle="Signed off by supervisors"
        />
        <MetricCard
          title="On-Time Resolution Rate"
          value="96.2%"
          icon="timer"
          subtitle="Resolved within SLA window"
        />
        <MetricCard
          title="Facilities & HVAC"
          value="112 Tasks"
          icon="construction"
          subtitle="Elevators, pumps & generators"
        />
        <MetricCard
          title="Security Interventions"
          value="68 Tasks"
          icon="shield"
          subtitle="Perimeter & sensor maintenance"
        />
      </section>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-primary">Archived Completed Tasks</h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Task ID & Title</th>
                <th className="py-3.5 px-space-md">Category</th>
                <th className="py-3.5 px-space-md">Completed By</th>
                <th className="py-3.5 px-space-md">Completion Date</th>
                <th className="py-3.5 px-space-md">Sign-off Officer</th>
                <th className="py-3.5 px-space-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filtered.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => navigate(`/admin/tasks/${task.id}`)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-space-lg font-medium text-on-surface">
                    <span className="font-code-sm text-code-sm font-bold text-primary mr-2">{task.id}</span>
                    <span className="font-semibold text-primary">{task.title}</span>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {task.category}
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-semibold text-on-surface">{task.assignedToName}</p>
                    <p className="font-body-sm text-secondary text-xs">{task.location}</p>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {task.completedAt || 'Sep 03, 2026'}
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-on-surface">
                    {task.verifiedBy || 'Inspector R. Thorne'}
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status="verified" text="Closed" />
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
