import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const SupervisorDashboard = () => {
  const { employees, tasks, updateWorkerAttendance, updateTaskStatus, addTaskRemark } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [workerSearch, setWorkerSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [remarkText, setRemarkText] = useState('');
  const [activeShift, setActiveShift] = useState('Morning (06:00 - 14:00)');

  // 80 Workers metrics
  const totalWorkers = employees.length; // 80
  const presentWorkers = employees.filter(e => e.status === 'present').length;
  const absentWorkers = employees.filter(e => e.status === 'absent').length;
  const leaveWorkers = employees.filter(e => e.status === 'leave').length;
  const lateWorkers = employees.filter(e => e.status === 'late').length;

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
                          emp.badgeNo.toLowerCase().includes(workerSearch.toLowerCase()) ||
                          emp.role.toLowerCase().includes(workerSearch.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleRemarkSubmit = (e) => {
    e.preventDefault();
    if (!remarkText.trim()) return;
    if (tasks.length > 0) {
      addTaskRemark(tasks[0].id, remarkText.trim());
    }
    addToast('Supervisor operational remark recorded.', 'info');
    setRemarkText('');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Top Operational Banner & Greetings */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-space-xs gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="inline-flex items-center gap-space-xs self-start px-space-sm py-0.5 rounded bg-surface-container-high text-secondary">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            <span className="font-code-sm text-code-sm">
              Estate Facility & Operations • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight mt-1">
            Good morning, Supervisor
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Here's today's workforce overview, muster attendance, and task allocation matrix across all 80 personnel.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start lg:self-center flex-wrap">
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Shift: <strong className="text-primary font-medium">{activeShift}</strong>
            </span>
          </div>
          <Link
            to="/supervisor/tasks/new"
            className="inline-flex items-center gap-space-xs px-space-md py-2 bg-primary text-on-primary rounded-xl shadow-sm hover:bg-primary-container transition-colors font-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>Assign Task</span>
          </Link>
        </div>
      </div>

      {/* Workforce Attendance KPI Ribbon (6 Reflowing Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
        {/* Card 1: Total Workers */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary">Total Roster</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">groups</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-2xs">
            <span className="font-display-lg text-display-lg text-primary leading-none">{totalWorkers}</span>
            <span className="font-code-sm text-code-sm text-secondary">workers</span>
          </div>
          <div className="mt-space-xs font-label-sm text-label-sm text-on-surface-variant">Enrolled headcount</div>
        </div>

        {/* Card 2: Present */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary">Present</span>
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary"></span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-2xs">
            <span className="font-display-lg text-display-lg text-primary leading-none">{presentWorkers}</span>
            <span className="font-code-sm text-code-sm text-secondary">/ {totalWorkers}</span>
          </div>
          <div className="mt-space-xs inline-flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span className="font-label-sm text-label-sm font-medium">{((presentWorkers / totalWorkers) * 100).toFixed(0)}% Rate</span>
          </div>
        </div>

        {/* Card 3: Absent */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary">Absent</span>
            <span className="w-2 h-2 rounded-full bg-error"></span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-2xs">
            <span className="font-display-lg text-display-lg text-error leading-none">{absentWorkers}</span>
            <span className="font-code-sm text-code-sm text-outline">unexcused</span>
          </div>
          <div className="mt-space-xs inline-flex items-center gap-1 text-error">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span className="font-label-sm text-label-sm font-medium">Uncovered</span>
          </div>
        </div>

        {/* Card 4: On Leave */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary">On Leave</span>
            <span className="material-symbols-outlined text-secondary text-[16px]">event_busy</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-2xs">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">{leaveWorkers}</span>
            <span className="font-code-sm text-code-sm text-secondary">approved</span>
          </div>
          <div className="mt-space-xs font-label-sm text-label-sm text-secondary">Scheduled leave</div>
        </div>

        {/* Card 5: Late Arrivals */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary">Late Entry</span>
            <span className="material-symbols-outlined text-tertiary-container text-[16px]">schedule</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-2xs">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">{lateWorkers}</span>
            <span className="font-code-sm text-code-sm text-secondary">&gt;15 min</span>
          </div>
          <div className="mt-space-xs inline-flex items-center gap-1 text-[#A67C37]">
            <span className="font-label-sm text-label-sm font-medium">Gate 01 Record</span>
          </div>
        </div>

        {/* Card 6: Active Tasks */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary">Active Tasks</span>
            <span className="material-symbols-outlined text-primary text-[18px]">assignment_turned_in</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-2xs">
            <span className="font-display-lg text-display-lg text-primary leading-none">
              {tasks.filter(t => t.status !== 'verified').length}
            </span>
            <span className="font-code-sm text-code-sm text-secondary">in stream</span>
          </div>
          <div className="mt-space-xs font-label-sm text-label-sm text-primary font-medium">
            {tasks.filter(t => t.priority === 'urgent').length} High Priority
          </div>
        </div>
      </div>

      {/* Workforce Muster Live Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-space-md sm:p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/20">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary">Workforce Duty Muster (80 Workers)</h2>
            <p className="font-body-sm text-body-sm text-secondary">Instant 1-click status update & roster verification</p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="search"
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                placeholder="Search by worker name, ID..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Departments</option>
              <option value="Security & Surveillance">Security & Surveillance</option>
              <option value="Facilities & Engineering">Facilities & Engineering</option>
              <option value="Housekeeping & Sanitization">Housekeeping & Sanitization</option>
              <option value="Landscaping & Horticulture">Landscaping & Horticulture</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3 px-space-lg">Employee</th>
                <th className="py-3 px-space-md">Role & Dept</th>
                <th className="py-3 px-space-md">Station</th>
                <th className="py-3 px-space-md">Check In</th>
                <th className="py-3 px-space-md">Status</th>
                <th className="py-3 px-space-lg text-right">Muster Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredEmployees.slice(0, 10).map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-sm font-semibold text-primary shrink-0">
                      {emp.avatar}
                    </div>
                    <div>
                      <Link to={`/supervisor/workers/${emp.id}`} className="hover:text-primary hover:underline font-semibold block">
                        {emp.name}
                      </Link>
                      <span className="font-code-sm text-code-sm text-secondary">{emp.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-space-md">
                    <p className="font-label-md text-on-surface">{emp.role}</p>
                    <p className="font-body-sm text-secondary">{emp.department}</p>
                  </td>
                  <td className="py-3.5 px-space-md font-body-sm text-secondary">
                    {emp.assignedLocation}
                  </td>
                  <td className="py-3.5 px-space-md font-code-sm text-code-sm text-secondary">
                    {emp.todayAttendance.inTime}
                  </td>
                  <td className="py-3.5 px-space-md">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="py-3.5 px-space-lg text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateWorkerAttendance(emp.id, 'present')}
                        title="Mark Present"
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          emp.status === 'present' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary hover:text-primary'
                        }`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => updateWorkerAttendance(emp.id, 'late')}
                        title="Mark Late"
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          emp.status === 'late' ? 'bg-[#A67C37] text-white' : 'bg-surface-container-high text-secondary hover:text-on-surface'
                        }`}
                      >
                        L
                      </button>
                      <button
                        type="button"
                        onClick={() => updateWorkerAttendance(emp.id, 'absent')}
                        title="Mark Absent"
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          emp.status === 'absent' ? 'bg-error text-on-error' : 'bg-surface-container-high text-secondary hover:text-error'
                        }`}
                      >
                        A
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-space-md border-t border-outline-variant/20 flex items-center justify-between text-body-sm text-secondary">
          <span>Showing 10 of {totalWorkers} rostered workers</span>
          <Link to="/supervisor/attendance" className="text-primary font-label-md font-semibold hover:underline">
            View Complete 80-Worker Roster →
          </Link>
        </div>
      </div>

      {/* Two Column Grid: Today's Tasks & Quick Remark Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Tasks Queue (8 Cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 flex flex-col gap-space-md">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary">Live Task Queue</h3>
              <p className="font-body-sm text-body-sm text-secondary">Active facilities & patrol assignments</p>
            </div>
            <Link
              to="/supervisor/tasks/board"
              className="inline-flex items-center gap-1 text-primary font-label-md text-label-md font-semibold hover:underline"
            >
              <span>Open Task Board (Kanban)</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={() => navigate(`/supervisor/tasks/${task.id}`)}
                className="p-3.5 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors border border-outline-variant/20 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-code-sm text-code-sm font-bold text-primary">{task.id}</span>
                    <span className="text-outline">•</span>
                    <span className="font-label-md font-semibold text-on-surface">{task.title}</span>
                  </div>
                  <p className="font-body-sm text-secondary">
                    Assigned to: <strong className="text-on-surface">{task.assignedToName}</strong> • {task.location}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <StatusBadge status={task.priority} text={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Remarks Log (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-headline-sm text-primary">Supervisor Field Log</h3>
          <p className="font-body-sm text-body-sm text-secondary">Record shift observations, contractor remarks, or incident flags.</p>

          <form onSubmit={handleRemarkSubmit} className="space-y-3">
            <textarea
              rows={3}
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="e.g. Morning muster completed with 90% attendance. Gate 02 sensor recalibration in progress."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm"
            >
              Post Field Remark
            </button>
          </form>

          <div className="border-t border-outline-variant/20 pt-3">
            <Link to="/supervisor/remarks" className="font-label-sm text-label-sm text-primary font-semibold hover:underline block text-center">
              View All Field Remarks Log →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
