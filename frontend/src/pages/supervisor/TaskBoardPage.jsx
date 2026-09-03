import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const TaskBoardPage = () => {
  const { tasks, updateTaskStatus } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeMobileColumn, setActiveMobileColumn] = useState('all');

  const columns = [
    { key: 'created', title: 'Created', icon: 'note_add', bg: 'bg-surface-container-low' },
    { key: 'assigned', title: 'Assigned', icon: 'assignment_ind', bg: 'bg-surface-container-low' },
    { key: 'in_progress', title: 'In Progress', icon: 'pending_actions', bg: 'bg-[#FAF5EC]' },
    { key: 'completed', title: 'Completed', icon: 'task_alt', bg: 'bg-secondary-container/40' },
    { key: 'verified', title: 'Verified', icon: 'verified', bg: 'bg-surface-container-high' }
  ];

  const handleMoveStatus = (e, taskId, nextStatus) => {
    e.stopPropagation();
    updateTaskStatus(taskId, nextStatus);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Operational Workflow</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Interactive Kanban Board</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Task Board
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Visual task lifecycle progression from assignment to field execution and final supervisor sign-off.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <Link
            to="/admin/tasks"
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
            <span>Table View</span>
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

      {/* Mobile Column Switcher (Visible on small screens) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveMobileColumn('all')}
          className={`px-3.5 py-1.5 rounded-full font-label-sm text-xs font-semibold whitespace-nowrap ${
            activeMobileColumn === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container text-secondary'
          }`}
        >
          All Columns
        </button>
        {columns.map(col => (
          <button
            key={col.key}
            type="button"
            onClick={() => setActiveMobileColumn(col.key)}
            className={`px-3.5 py-1.5 rounded-full font-label-sm text-xs font-semibold whitespace-nowrap ${
              activeMobileColumn === col.key ? 'bg-primary text-on-primary' : 'bg-surface-container text-secondary'
            }`}
          >
            {col.title} ({tasks.filter(t => t.status === col.key).length})
          </button>
        ))}
      </div>

      {/* Kanban Board 5-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {columns.map(col => {
          if (activeMobileColumn !== 'all' && activeMobileColumn !== col.key) {
            return null;
          }

          const colTasks = tasks.filter(t => t.status === col.key);

          return (
            <div
              key={col.key}
              className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant/25 shadow-sm flex flex-col gap-3 min-w-[240px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">{col.icon}</span>
                  <span className="font-label-md font-bold text-on-surface">{col.title}</span>
                </div>
                <span className="font-code-sm text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container text-primary">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards in this Column */}
              <div className="space-y-3 min-h-[300px]">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/admin/tasks/${task.id}`)}
                    className="p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all border border-outline-variant/30 shadow-xs hover:shadow-md cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-code-sm text-xs font-bold text-primary">{task.id}</span>
                      <StatusBadge status={task.priority} text={task.priority} />
                    </div>

                    <h4 className="font-label-md font-semibold text-on-surface line-clamp-2 leading-snug">
                      {task.title}
                    </h4>

                    <div className="space-y-1 text-xs text-secondary">
                      <p className="flex items-center gap-1 truncate">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span>{task.location}</span>
                      </p>
                      <p className="flex items-center gap-1 truncate">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        <strong className="text-on-surface">{task.assignedToName}</strong>
                      </p>
                    </div>

                    {/* Quick Move Action Buttons */}
                    <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                      <span className="font-code-sm text-[10px] text-secondary">{task.dueDate}</span>
                      
                      <div className="flex items-center gap-1">
                        {col.key === 'created' && (
                          <button
                            type="button"
                            onClick={(e) => handleMoveStatus(e, task.id, 'assigned')}
                            className="p-1 rounded bg-surface-container hover:bg-primary hover:text-white text-xs font-bold"
                            title="Move to Assigned"
                          >
                            Assign →
                          </button>
                        )}
                        {col.key === 'assigned' && (
                          <button
                            type="button"
                            onClick={(e) => handleMoveStatus(e, task.id, 'in_progress')}
                            className="p-1 rounded bg-surface-container hover:bg-primary hover:text-white text-xs font-bold"
                            title="Start Task"
                          >
                            Start →
                          </button>
                        )}
                        {col.key === 'in_progress' && (
                          <button
                            type="button"
                            onClick={(e) => handleMoveStatus(e, task.id, 'completed')}
                            className="p-1 rounded bg-surface-container hover:bg-primary hover:text-white text-xs font-bold"
                            title="Complete Task"
                          >
                            Done ✓
                          </button>
                        )}
                        {col.key === 'completed' && (
                          <button
                            type="button"
                            onClick={(e) => handleMoveStatus(e, task.id, 'verified')}
                            className="p-1 rounded bg-primary text-white text-xs font-bold"
                            title="Verify Sign-off"
                          >
                            Verify ★
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="p-4 text-center text-secondary text-xs italic">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
