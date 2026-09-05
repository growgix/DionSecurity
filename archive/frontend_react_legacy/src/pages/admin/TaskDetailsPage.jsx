import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const { tasks, updateTaskStatus, addTaskRemark, recordAudit } = useDataStore();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [newRemark, setNewRemark] = useState('');

  const isSupervisor = currentUser?.role === 'supervisor';
  const backRoute = isSupervisor ? '/supervisor/tasks/board' : '/admin/tasks';

  const task = tasks.find(t => t.id === id) || tasks[0];

  const handleStatusClick = (statusKey) => {
    updateTaskStatus(task.id, statusKey);
  };

  const handleAddRemark = (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;
    addTaskRemark(task.id, newRemark.trim());
    setNewRemark('');
  };

  const steps = [
    { key: 'created', label: '1. Created' },
    { key: 'assigned', label: '2. Assigned' },
    { key: 'in_progress', label: '3. In Progress' },
    { key: 'completed', label: '4. Completed' },
    { key: 'verified', label: '5. Verified & Closed' }
  ];

  const getStepIndex = (status) => steps.findIndex(s => s.key === status);
  const currentStepIdx = getStepIndex(task.status);

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        backTo={backRoute}
        backLabel="Back to Tasks"
        items={[
          { label: 'Tasks', to: backRoute },
          { label: 'Work Orders' },
          { label: task.id }
        ]}
      />

      {/* Task Hero Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-code-sm text-lg font-bold text-primary px-3 py-1 rounded bg-surface-container">
                {task.id}
              </span>
              <StatusBadge status={task.priority} text={task.priority} />
              <StatusBadge status={task.status} />
            </div>
            <h1 className="font-display-lg text-display-lg sm:text-[32px] text-primary tracking-tight mt-1">
              {task.title}
            </h1>
            <p className="font-body-md text-secondary">
              {task.category} • Location: <strong className="text-on-surface">{task.location}</strong>
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            {task.status !== 'verified' ? (
              <button
                type="button"
                onClick={() => handleStatusClick('verified')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Sign-off & Verify Task</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md font-semibold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Verified by {task.verifiedBy || 'Operations Lead'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="pt-3 border-t border-outline-variant/20">
          <span className="font-label-sm text-label-sm text-secondary uppercase block mb-2">
            Task Lifecycle Progression:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((s, idx) => {
              const isPastOrCurrent = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => handleStatusClick(s.key)}
                  className={`py-2 px-3 rounded-xl font-label-sm text-xs font-semibold text-center transition-all border ${
                    isCurrent
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : isPastOrCurrent
                      ? 'bg-secondary-container text-on-secondary-container border-secondary/30'
                      : 'bg-surface-container-low text-secondary border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Instructions & Remarks Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (7 cols): Details & Specs */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Protocol & Description */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary">Work Order Description</h3>
            <p className="font-body-md text-on-surface leading-relaxed">
              {task.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/15 text-body-sm">
              <div>
                <span className="text-secondary block text-xs">Assigned Personnel</span>
                <Link to={`/admin/workforce/${task.assignedToId}`} className="font-semibold text-primary hover:underline">
                  {task.assignedToName} ({task.assignedRole})
                </Link>
              </div>
              <div>
                <span className="text-secondary block text-xs">Target Due Date</span>
                <span className="font-code-sm font-semibold text-on-surface">{task.dueDate}</span>
              </div>
              <div>
                <span className="text-secondary block text-xs">Creation Timestamp</span>
                <span className="text-on-surface">{task.createdAt}</span>
              </div>
              <div>
                <span className="text-secondary block text-xs">Completion Timestamp</span>
                <span className="text-on-surface">{task.completedAt || 'In progress'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Remarks & Supervisor Timeline */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-primary">Field Remarks & Notes</h3>

          {/* Remarks Thread */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {task.remarks && task.remarks.length > 0 ? (
              task.remarks.map((rem, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary">{rem.author}</span>
                    <span className="font-code-sm text-secondary">{rem.time}</span>
                  </div>
                  <p className="font-body-sm text-on-surface">{rem.text}</p>
                </div>
              ))
            ) : (
              <p className="text-secondary text-body-sm italic">No remarks recorded yet for this task.</p>
            )}
          </div>

          {/* Add Remark Form */}
          <form onSubmit={handleAddRemark} className="space-y-2 pt-2 border-t border-outline-variant/20">
            <textarea
              rows={2}
              required
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
              placeholder="Add observation, status update or part requirement..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm"
            >
              Post Remark
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
