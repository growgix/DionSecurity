import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AttendancePage = () => {
  const { employees, updateWorkerAttendance, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalWorkers = employees.length; // 80
  const presentCount = employees.filter(e => e.status === 'present').length;
  const absentCount = employees.filter(e => e.status === 'absent').length;
  const leaveCount = employees.filter(e => e.status === 'leave').length;
  const lateCount = employees.filter(e => e.status === 'late').length;

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.badgeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Workforce Management</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Live Muster Roster</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Today's Attendance Muster
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Live workforce check-in ledger across all 80 personnel with instant 1-click status adjustments and biometric verification.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_ATTENDANCE', "Exported today's attendance muster CSV");
              addToast('Today’s attendance muster report exported.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Daily Muster</span>
          </button>
        </div>
      </section>

      {/* 6-Card Attendance KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
        <MetricCard title="Total Roster" value={totalWorkers} icon="groups" subtitle="Enrolled staff" />
        <MetricCard title="Present" value={presentCount} icon="check_circle" subtitle={`${((presentCount / totalWorkers) * 100).toFixed(0)}% Rate`} badge="On Duty" pulse={true} />
        <MetricCard title="Absent" value={absentCount} icon="warning" subtitle="Unexcused" deltaType="error" />
        <MetricCard title="On Leave" value={leaveCount} icon="event_busy" subtitle="Scheduled leave" />
        <MetricCard title="Late Entry" value={lateCount} icon="schedule" subtitle=">15 min" />
        <MetricCard title="Attendance Rate" value={`${(((presentCount + lateCount) / totalWorkers) * 100).toFixed(0)}%`} icon="pie_chart" subtitle="Target: 90%" />
      </div>

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
              placeholder="Search by worker name, badge #, role..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Departments</option>
              <option value="Security & Surveillance">Security & Surveillance</option>
              <option value="Facilities & Engineering">Facilities & Engineering</option>
              <option value="Housekeeping & Sanitization">Housekeeping & Sanitization</option>
              <option value="Landscaping & Horticulture">Landscaping & Horticulture</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Attendance Statuses</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="leave">On Leave</option>
            </select>
          </div>
        </div>
      </section>

      {/* Live Muster Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Employee</th>
                <th className="py-3.5 px-space-md">Role & Dept</th>
                <th className="py-3.5 px-space-md">In Time</th>
                <th className="py-3.5 px-space-md">Out Time</th>
                <th className="py-3.5 px-space-md">Gate / Terminal</th>
                <th className="py-3.5 px-space-md">Status</th>
                <th className="py-3.5 px-space-lg text-right">Quick Muster Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-sm font-semibold shrink-0">
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
                    {emp.todayAttendance.inTime}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {emp.todayAttendance.outTime}
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {emp.todayAttendance.gate}
                  </td>
                  <td className="py-4 px-space-md">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateWorkerAttendance(emp.id, 'present')}
                        title="Mark Present"
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          emp.status === 'present' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-secondary'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => updateWorkerAttendance(emp.id, 'late')}
                        title="Mark Late"
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          emp.status === 'late' ? 'bg-[#A67C37] text-white shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-secondary'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => updateWorkerAttendance(emp.id, 'absent')}
                        title="Mark Absent"
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          emp.status === 'absent' ? 'bg-error text-on-error shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-secondary'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => updateWorkerAttendance(emp.id, 'leave')}
                        title="Mark Leave"
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          emp.status === 'leave' ? 'bg-surface-container-highest text-on-surface shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-secondary'
                        }`}
                      >
                        Leave
                      </button>
                    </div>
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
