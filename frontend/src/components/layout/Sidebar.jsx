import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ onItemClick, isMobile = false }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const role = currentUser?.role || 'admin';

  const linkBaseClass = "flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all font-body-md text-body-md";
  const activeClass = "bg-primary-container text-on-primary font-medium rounded-lg shadow-sm";
  const inactiveClass = "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface";

  const subLinkBaseClass = "flex items-center px-space-sm py-1.5 rounded-lg transition-all font-body-sm text-body-sm";

  return (
    <aside className={`${isMobile ? 'w-full' : 'w-64'} bg-surface-container-lowest flex flex-col justify-between h-full overflow-y-auto`}>
      <div className="p-space-md flex flex-col gap-space-md">
        
        {/* ===================================================
            1. SUPER ADMIN SIDEBAR NAVIGATION
           =================================================== */}
        {role === 'admin' && (
          <>
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/admin/dashboard"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                <span>Super Admin Dashboard</span>
              </NavLink>
            </nav>

            {/* Society Group */}
            <div className="flex flex-col gap-space-2xs">
              <span className="font-label-sm text-label-sm text-outline uppercase px-space-sm mb-1 tracking-wider">
                Society
              </span>
              <nav className="flex flex-col gap-0.5 pl-space-xs border-l border-outline-variant/30 ml-space-sm">
                <NavLink
                  to="/admin/blocks"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive || location.pathname.startsWith('/admin/blocks') ? activeClass : inactiveClass}`}
                >
                  Blocks
                </NavLink>
                <NavLink
                  to="/admin/houses"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive || location.pathname.startsWith('/admin/houses') ? activeClass : inactiveClass}`}
                >
                  Houses
                </NavLink>
                <NavLink
                  to="/admin/residents"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive || location.pathname.startsWith('/admin/residents') ? activeClass : inactiveClass}`}
                >
                  Residents
                </NavLink>
                <NavLink
                  to="/admin/family-members"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Family Members
                </NavLink>
              </nav>
            </div>

            {/* Visitors Group */}
            <div className="flex flex-col gap-space-2xs">
              <span className="font-label-sm text-label-sm text-outline uppercase px-space-sm mb-1 tracking-wider">
                Visitors
              </span>
              <nav className="flex flex-col gap-0.5 pl-space-xs border-l border-outline-variant/30 ml-space-sm">
                <NavLink
                  to="/admin/visitors"
                  end
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  All Visitors
                </NavLink>
                <NavLink
                  to="/admin/visitors/current"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Current Visitors
                </NavLink>
                <NavLink
                  to="/admin/visitors/regular"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Regular Visitors
                </NavLink>
                <NavLink
                  to="/admin/visitors/expected"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Expected Visitors
                </NavLink>
                <NavLink
                  to="/admin/visitors/history"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Visitor History
                </NavLink>
              </nav>
            </div>

            {/* Security Group */}
            <div className="flex flex-col gap-space-2xs">
              <span className="font-label-sm text-label-sm text-outline uppercase px-space-sm mb-1 tracking-wider">
                Security
              </span>
              <nav className="flex flex-col gap-0.5 pl-space-xs border-l border-outline-variant/30 ml-space-sm">
                <NavLink
                  to="/admin/security/gate-activity"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Gate Activity
                </NavLink>
                <NavLink
                  to="/admin/security/currently-inside"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Currently Inside
                </NavLink>
                <NavLink
                  to="/admin/security/entry-records"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Entry Records
                </NavLink>
                <NavLink
                  to="/admin/security/exit-records"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Exit Records
                </NavLink>
              </nav>
            </div>

            {/* Workforce Group */}
            <div className="flex flex-col gap-space-2xs">
              <span className="font-label-sm text-label-sm text-outline uppercase px-space-sm mb-1 tracking-wider">
                Workforce
              </span>
              <nav className="flex flex-col gap-0.5 pl-space-xs border-l border-outline-variant/30 ml-space-sm">
                <NavLink
                  to="/admin/workforce"
                  end
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive || (location.pathname.startsWith('/admin/workforce') && !location.pathname.includes('attendance') && !location.pathname.includes('shifts') && !location.pathname.includes('assignments') && !location.pathname.includes('history')) ? activeClass : inactiveClass}`}
                >
                  Employees
                </NavLink>
                <NavLink
                  to="/admin/workforce/attendance"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Attendance
                </NavLink>
                <NavLink
                  to="/admin/workforce/shifts"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Shifts
                </NavLink>
                <NavLink
                  to="/admin/workforce/assignments"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Assignments
                </NavLink>
                <NavLink
                  to="/admin/workforce/history"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Employee History
                </NavLink>
              </nav>
            </div>

            {/* Tasks Group */}
            <div className="flex flex-col gap-space-2xs">
              <span className="font-label-sm text-label-sm text-outline uppercase px-space-sm mb-1 tracking-wider">
                Tasks
              </span>
              <nav className="flex flex-col gap-0.5 pl-space-xs border-l border-outline-variant/30 ml-space-sm">
                <NavLink
                  to="/admin/tasks"
                  end
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  All Tasks
                </NavLink>
                <NavLink
                  to="/admin/tasks/pending"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Pending
                </NavLink>
                <NavLink
                  to="/admin/tasks/in-progress"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  In Progress
                </NavLink>
                <NavLink
                  to="/admin/tasks/completed"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Completed
                </NavLink>
                <NavLink
                  to="/admin/tasks/history"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Task History
                </NavLink>
              </nav>
            </div>

            {/* Payments Group */}
            <div className="flex flex-col gap-space-2xs">
              <span className="font-label-sm text-label-sm text-outline uppercase px-space-sm mb-1 tracking-wider">
                Payments
              </span>
              <nav className="flex flex-col gap-0.5 pl-space-xs border-l border-outline-variant/30 ml-space-sm">
                <NavLink
                  to="/admin/payments"
                  end
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Payment Records
                </NavLink>
                <NavLink
                  to="/admin/payments/pending"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Pending Payments
                </NavLink>
                <NavLink
                  to="/admin/payments/history"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Payment History
                </NavLink>
              </nav>
            </div>

            {/* System Group */}
            <div className="flex flex-col gap-space-2xs pt-space-xs border-t border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-outline uppercase px-space-sm mb-1 tracking-wider">
                System
              </span>
              <nav className="flex flex-col gap-1">
                <NavLink
                  to="/admin/reports"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Reports
                </NavLink>
                <NavLink
                  to="/admin/users"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Users
                </NavLink>
                <NavLink
                  to="/admin/audit-logs"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Audit Logs
                </NavLink>
                <NavLink
                  to="/admin/settings"
                  onClick={onItemClick}
                  className={({ isActive }) => `${subLinkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  Settings
                </NavLink>
              </nav>
            </div>
          </>
        )}

        {/* ===================================================
            2. MAIN GATE GUARD SIDEBAR NAVIGATION
           =================================================== */}
        {role === 'guard' && (
          <>
            <div className="flex items-center gap-space-xs px-space-sm py-2 rounded-lg bg-surface-container-low text-primary font-semibold font-label-md">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span>Main Gate Terminal A</span>
            </div>

            <nav className="flex flex-col gap-1">
              <NavLink
                to="/guard/dashboard"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/guard/visitors/new"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                <span>New Visitor</span>
              </NavLink>
              <NavLink
                to="/guard/search"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">person_search</span>
                <span>Search Person</span>
              </NavLink>
              <NavLink
                to="/guard/currently-inside"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">sensor_occupied</span>
                <span>Current Visitors</span>
              </NavLink>
              <NavLink
                to="/guard/expected-visitors"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">schedule</span>
                <span>Expected Visitors</span>
              </NavLink>
              <NavLink
                to="/guard/regular-visitors"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <span>Regular Visitors</span>
              </NavLink>
              <NavLink
                to="/guard/worker-entry"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                <span>Worker Entry</span>
              </NavLink>
              <NavLink
                to="/guard/worker-exit"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Worker Exit</span>
              </NavLink>
              <NavLink
                to="/guard/residents-houses"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">apartment</span>
                <span>Residents & Houses</span>
              </NavLink>
              <NavLink
                to="/guard/gate-log"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">assignment</span>
                <span>Today's Gate Log</span>
              </NavLink>
              <NavLink
                to="/guard/profile"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                <span>My Profile</span>
              </NavLink>
            </nav>
          </>
        )}

        {/* ===================================================
            3. FIELD SUPERVISOR SIDEBAR NAVIGATION
           =================================================== */}
        {role === 'supervisor' && (
          <>
            <div className="flex items-center gap-space-xs px-space-sm py-2 rounded-lg bg-surface-container-low text-primary font-semibold font-label-md">
              <span className="material-symbols-outlined text-[20px]">supervisor_account</span>
              <span>Field Operations Hub</span>
            </div>

            <nav className="flex flex-col gap-1">
              <NavLink
                to="/supervisor/dashboard"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/supervisor/workers"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <span>Workers (80)</span>
              </NavLink>
              <NavLink
                to="/supervisor/attendance"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                <span>Today's Attendance</span>
              </NavLink>
              <NavLink
                to="/supervisor/tasks"
                end
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
                <span>Tasks List</span>
              </NavLink>
              <NavLink
                to="/supervisor/tasks/board"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                <span>Task Board</span>
              </NavLink>
              <NavLink
                to="/supervisor/tasks/new"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">add_task</span>
                <span>Assign Task</span>
              </NavLink>
              <NavLink
                to="/supervisor/remarks"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Field Remarks</span>
              </NavLink>
              <NavLink
                to="/supervisor/payments"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">payments</span>
                <span>Payments & Wages</span>
              </NavLink>
              <NavLink
                to="/supervisor/reports"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">summarize</span>
                <span>Reports</span>
              </NavLink>
              <NavLink
                to="/supervisor/profile"
                onClick={onItemClick}
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                <span>My Profile</span>
              </NavLink>
            </nav>
          </>
        )}

      </div>

      {/* Footer Pill: Gate Net v4.2 SECURE */}
      <div className="p-space-md border-t border-outline-variant/30 flex flex-col gap-space-xs">
        <div className="px-space-sm py-space-xs rounded bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-secondary">Gate Net v4.2</span>
          </div>
          <span className="font-code-sm text-code-sm text-outline font-semibold">SECURE</span>
        </div>
      </div>
    </aside>
  );
};
