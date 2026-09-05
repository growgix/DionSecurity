import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AllTasksPage = () => {
  const { tasks, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState(
    location.pathname.includes('/pending') ? 'assigned' :
    location.pathname.includes('/in-progress') ? 'in_progress' :
    location.pathname.includes('/completed') ? 'completed' : 'all'
  );

  const pendingCount = tasks.filter(t => t.status === 'created' || t.status === 'assigned').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed' || t.status === 'verified').length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent').length;

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.assignedToName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter ||
                          (statusFilter === 'pending' && (t.status === 'created' || t.status === 'assigned'));
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Operations Governance</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Task Stream</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Work Orders & Tasks
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Central operational queue for facility maintenance, emergency repairs, security sensor calibrations, and supervisor inspections.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <Link
            to="/supervisor/tasks/board"
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">view_kanban</span>
            <span>Task Board (Kanban)</span>
          </Link>
          <Link
            to="/supervisor/tasks/new"
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>+ Assign Task</span>
          </Link>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Active Tasks"
          value={tasks.length}
          icon="task_alt"
          subtitle="All categories combined"
        />
        <MetricCard
          title="In Progress"
          value={inProgressCount}
          icon="pending_actions"
          subtitle="Under active execution"
          badge="Live Action"
          pulse={true}
        />
        <MetricCard
          title="Pending Assignment"
          value={pendingCount}
          icon="assignment_late"
          subtitle="Queued for dispatch"
        />
        <MetricCard
          title="Urgent Priority"
          value={urgentCount}
          icon="priority_high"
          subtitle="Immediate response protocol"
          deltaType="error"
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
              placeholder="Search tasks by title, ID, assignee, location..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Task Statuses</option>
              <option value="assigned">Assigned / Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="verified">Verified & Signed Off</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tasks Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Task ID & Title</th>
                <th className="py-3.5 px-space-md">Category</th>
                <th className="py-3.5 px-space-md">Assigned Worker</th>
                <th className="py-3.5 px-space-md">Location</th>
                <th className="py-3.5 px-space-md">Due Date</th>
                <th className="py-3.5 px-space-md">Priority</th>
                <th className="py-3.5 px-space-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => navigate(`/admin/tasks/${task.id}`)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-space-lg font-medium text-on-surface">
                    <span className="font-code-sm text-code-sm font-bold text-primary mr-2">
                      {task.id}
                    </span>
                    <span className="font-semibold text-primary">{task.title}</span>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {task.category}
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-semibold text-on-surface">{task.assignedToName}</p>
                    <p className="font-body-sm text-secondary text-xs">{task.assignedRole}</p>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {task.location}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {task.dueDate}
                  </td>
                  <td className="py-4 px-space-md">
                    <StatusBadge status={task.priority} text={task.priority} />
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status={task.status} />
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
