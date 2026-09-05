import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const EmployeeProfilePage = () => {
  const { id } = useParams();
  const { employees, tasks, payments, updateWorkerAttendance, recordAudit } = useDataStore();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const isSupervisor = currentUser?.role === 'supervisor';
  const backRoute = isSupervisor ? '/supervisor/workers' : '/admin/workforce';

  const employee = employees.find(e => e.id === id || e.badgeNo === id) || employees[0];
  const workerTasks = tasks.filter(t => t.assignedToId === employee.id || t.assignedToName === employee.name);
  const workerPayments = payments.filter(p => p.employeeId === employee.id || p.employeeName === employee.name);

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        backTo={backRoute}
        backLabel="Back to Workforce"
        items={[
          { label: 'Workforce', to: backRoute },
          { label: 'Employees', to: backRoute },
          { label: employee.name }
        ]}
      />

      {/* Hero Profile Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center font-display-lg text-2xl font-bold shrink-0">
              {employee.avatar}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display-lg text-display-lg sm:text-[32px] text-primary tracking-tight">
                  {employee.name}
                </h1>
                <StatusBadge status={employee.status} />
              </div>
              <p className="font-body-md text-secondary">
                Badge: <strong className="font-code-sm text-primary font-bold">{employee.badgeNo}</strong> • {employee.role} ({employee.department})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              type="button"
              onClick={() => setShowAttendanceModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md font-semibold transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>Update Attendance</span>
            </button>
            <Link
              to={`/supervisor/tasks/new?worker=${employee.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>Assign Task</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Ribbon for Employee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Daily Wage Rate"
          value={`₹${employee.dailyWage}`}
          icon="payments"
          subtitle={`₹${employee.monthlyWage.toLocaleString()}/month base`}
        />
        <MetricCard
          title="Performance Rating"
          value={`${employee.rating} ★`}
          icon="star"
          subtitle="Supervisor verified quality"
        />
        <MetricCard
          title="Tasks Completed"
          value={employee.tasksCompleted}
          icon="task_alt"
          subtitle="All-time work orders"
        />
        <MetricCard
          title="Duty Shift"
          value={employee.shift.split(' ')[0]}
          icon="schedule"
          subtitle={employee.shift}
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-label-md transition-colors whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-primary-container text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
            }`}
          >
            Overview & Verification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg font-label-md transition-colors whitespace-nowrap ${
              activeTab === 'tasks' ? 'bg-primary-container text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
            }`}
          >
            Assigned Tasks ({workerTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg font-label-md transition-colors whitespace-nowrap ${
              activeTab === 'payments' ? 'bg-primary-container text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
            }`}
          >
            Payments & Wages ({workerPayments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-label-md transition-colors whitespace-nowrap ${
              activeTab === 'history' ? 'bg-primary-container text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
            }`}
          >
            Muster & Gate History
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="p-space-lg space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-primary">Identity & Service Records</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-body-sm">
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-secondary block text-xs">Direct Mobile</span>
                <span className="font-semibold text-on-surface text-base">{employee.phone}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-secondary block text-xs">Aadhaar Card Ref</span>
                <span className="font-code-sm font-semibold text-on-surface text-base">{employee.aadhaar}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-secondary block text-xs">Assigned Work Station</span>
                <span className="font-semibold text-on-surface text-base">{employee.assignedLocation}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-secondary block text-xs">Joining Date</span>
                <span className="font-semibold text-on-surface text-base">{employee.joiningDate}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-secondary block text-xs">Today's In-Time</span>
                <span className="font-code-sm font-semibold text-primary text-base">{employee.todayAttendance.inTime}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low">
                <span className="text-secondary block text-xs">Security Clearance</span>
                <span className="font-semibold text-on-surface text-base">Verified & Biometric Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Assigned Tasks */}
        {activeTab === 'tasks' && (
          <div className="p-space-lg space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary">Assigned Work Orders</h3>
            {workerTasks.length > 0 ? (
              <div className="space-y-3">
                {workerTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/admin/tasks/${task.id}`)}
                    className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm font-bold text-primary">{task.id}</span>
                        <span className="font-semibold text-on-surface">{task.title}</span>
                      </div>
                      <p className="font-body-sm text-secondary mt-0.5">{task.location} • Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary italic">No operational tasks currently assigned to this worker.</p>
            )}
          </div>
        )}

        {/* Tab 3: Payments */}
        {activeTab === 'payments' && (
          <div className="p-space-lg space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary">Wage Settlements & Advances</h3>
            {workerPayments.length > 0 ? (
              <div className="space-y-2">
                {workerPayments.map(p => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-body-sm">
                    <div>
                      <p className="font-semibold text-on-surface">{p.type}</p>
                      <p className="text-secondary text-xs">{p.paymentDate} • Ref: {p.referenceNo}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-code-sm text-base font-bold text-primary">₹{p.amount.toLocaleString()}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary italic">No payment disbursements on record for this cycle.</p>
            )}
          </div>
        )}

        {/* Tab 4: Muster History */}
        {activeTab === 'history' && (
          <div className="p-space-lg space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary">Shift Attendance History</h3>
            <div className="space-y-2 text-body-sm">
              <div className="p-3 rounded-xl bg-surface-container-low flex justify-between items-center">
                <div>
                  <span className="font-semibold text-on-surface">Today's Muster Clearance</span>
                  <p className="text-secondary text-xs">Gate 01 Biometric • {employee.todayAttendance.inTime}</p>
                </div>
                <StatusBadge status={employee.status} />
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low flex justify-between items-center">
                <div>
                  <span className="font-semibold text-on-surface">Yesterday's Duty Roster</span>
                  <p className="text-secondary text-xs">Gate 01 Biometric • 06:00 AM - 02:00 PM</p>
                </div>
                <StatusBadge status="present" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title={`Update Attendance: ${employee.name}`}
        subtitle="Set today's muster status for this workforce member."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                updateWorkerAttendance(employee.id, 'present');
                setShowAttendanceModal(false);
              }}
              className="p-3 rounded-xl bg-secondary-container text-on-secondary-container font-semibold hover:opacity-90"
            >
              ✓ Mark Present
            </button>
            <button
              type="button"
              onClick={() => {
                updateWorkerAttendance(employee.id, 'late');
                setShowAttendanceModal(false);
              }}
              className="p-3 rounded-xl bg-[#FAF5EC] text-[#A67C37] font-semibold hover:opacity-90"
            >
              ⏱ Mark Late
            </button>
            <button
              type="button"
              onClick={() => {
                updateWorkerAttendance(employee.id, 'absent');
                setShowAttendanceModal(false);
              }}
              className="p-3 rounded-xl bg-error-container text-on-error-container font-semibold hover:opacity-90"
            >
              ✕ Mark Absent
            </button>
            <button
              type="button"
              onClick={() => {
                updateWorkerAttendance(employee.id, 'leave');
                setShowAttendanceModal(false);
              }}
              className="p-3 rounded-xl bg-surface-container-high text-on-surface font-semibold hover:opacity-90"
            >
              🏖 Approved Leave
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
