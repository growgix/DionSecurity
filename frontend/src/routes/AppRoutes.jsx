import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

// Auth
import { LoginRoleSelection } from '../pages/auth/LoginRoleSelection';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { BlocksPage } from '../pages/admin/BlocksPage';
import { BlockDetailsPage } from '../pages/admin/BlockDetailsPage';
import { HousesPage } from '../pages/admin/HousesPage';
import { HouseDetailsPage } from '../pages/admin/HouseDetailsPage';
import { ResidentsPage } from '../pages/admin/ResidentsPage';
import { FamilyMembersPage } from '../pages/admin/FamilyMembersPage';
import { AllVisitorsPage } from '../pages/admin/AllVisitorsPage';
import { VisitorDetailsPage } from '../pages/admin/VisitorDetailsPage';
import { RegularVisitorsPage } from '../pages/admin/RegularVisitorsPage';
import { ExpectedVisitorsPage } from '../pages/admin/ExpectedVisitorsPage';
import { EmployeesPage } from '../pages/admin/EmployeesPage';
import { EmployeeProfilePage } from '../pages/admin/EmployeeProfilePage';
import { ShiftsPage } from '../pages/admin/ShiftsPage';
import { EmployeeAssignmentsPage } from '../pages/admin/EmployeeAssignmentsPage';
import { EmployeeHistoryPage } from '../pages/admin/EmployeeHistoryPage';
import { AttendanceHistoryPage } from '../pages/admin/AttendanceHistoryPage';
import { AllTasksPage } from '../pages/admin/AllTasksPage';
import { TaskDetailsPage } from '../pages/admin/TaskDetailsPage';
import { TaskHistoryPage } from '../pages/admin/TaskHistoryPage';
import { PaymentsPage } from '../pages/admin/PaymentsPage';
import { AddPaymentPage } from '../pages/admin/AddPaymentPage';
import { ReportsCenterPage } from '../pages/admin/ReportsCenterPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';

// Guard Pages
import { GuardDashboard } from '../pages/guard/GuardDashboard';
import { NewVisitorPage } from '../pages/guard/NewVisitorPage';
import { SearchPersonPage } from '../pages/guard/SearchPersonPage';
import { CurrentlyInsidePage } from '../pages/guard/CurrentlyInsidePage';
import { VisitorExitPage } from '../pages/guard/VisitorExitPage';
import { GateLogPage } from '../pages/guard/GateLogPage';
import { WorkerEntryPage } from '../pages/guard/WorkerEntryPage';
import { WorkerExitPage } from '../pages/guard/WorkerExitPage';
import { ResidentsHousesPage } from '../pages/guard/ResidentsHousesPage';
import { GuardProfilePage } from '../pages/guard/GuardProfilePage';

// Supervisor Pages
import { SupervisorDashboard } from '../pages/supervisor/SupervisorDashboard';
import { AttendancePage } from '../pages/supervisor/AttendancePage';
import { TaskBoardPage } from '../pages/supervisor/TaskBoardPage';
import { CreateAssignTaskPage } from '../pages/supervisor/CreateAssignTaskPage';
import { RemarksPage } from '../pages/supervisor/RemarksPage';
import { SupervisorProfilePage } from '../pages/supervisor/SupervisorProfilePage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root & Auth */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginRoleSelection />} />

      {/* SUPER ADMIN PORTAL (/admin/*) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Society & Estate */}
        <Route path="blocks" element={<BlocksPage />} />
        <Route path="blocks/:id" element={<BlockDetailsPage />} />
        <Route path="houses" element={<HousesPage />} />
        <Route path="houses/:id" element={<HouseDetailsPage />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route path="family-members" element={<FamilyMembersPage />} />
        
        {/* Visitors */}
        <Route path="visitors" element={<AllVisitorsPage />} />
        <Route path="visitors/all" element={<AllVisitorsPage />} />
        <Route path="visitors/regular" element={<RegularVisitorsPage />} />
        <Route path="visitors/expected" element={<ExpectedVisitorsPage />} />
        <Route path="visitors/:id" element={<VisitorDetailsPage />} />
        
        {/* Workforce */}
        <Route path="workforce" element={<EmployeesPage />} />
        <Route path="workforce/:id" element={<EmployeeProfilePage />} />
        <Route path="shifts" element={<ShiftsPage />} />
        <Route path="assignments" element={<EmployeeAssignmentsPage />} />
        <Route path="history" element={<EmployeeHistoryPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="attendance/history" element={<AttendanceHistoryPage />} />
        
        {/* Tasks */}
        <Route path="tasks" element={<AllTasksPage />} />
        <Route path="tasks/pending" element={<AllTasksPage />} />
        <Route path="tasks/in-progress" element={<AllTasksPage />} />
        <Route path="tasks/completed" element={<AllTasksPage />} />
        <Route path="tasks/history" element={<TaskHistoryPage />} />
        <Route path="tasks/:id" element={<TaskDetailsPage />} />
        
        {/* Payments & Financial */}
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="payments/add" element={<AddPaymentPage />} />
        
        {/* System, Reports & Governance */}
        <Route path="reports" element={<ReportsCenterPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* MAIN GATE GUARD PORTAL (/guard/*) */}
      <Route
        path="/guard"
        element={
          <ProtectedRoute allowedRoles={['guard', 'admin']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/guard/dashboard" replace />} />
        <Route path="dashboard" element={<GuardDashboard />} />
        <Route path="visitors/new" element={<NewVisitorPage />} />
        <Route path="search" element={<SearchPersonPage />} />
        <Route path="visitors/inside" element={<CurrentlyInsidePage />} />
        <Route path="visitors/exit" element={<VisitorExitPage />} />
        <Route path="gate-log" element={<GateLogPage />} />
        <Route path="expected" element={<ExpectedVisitorsPage />} />
        <Route path="regular" element={<RegularVisitorsPage />} />
        <Route path="worker-entry" element={<WorkerEntryPage />} />
        <Route path="worker-exit" element={<WorkerExitPage />} />
        <Route path="residents" element={<ResidentsHousesPage />} />
        <Route path="profile" element={<GuardProfilePage />} />
      </Route>

      {/* FIELD SUPERVISOR PORTAL (/supervisor/*) */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/supervisor/dashboard" replace />} />
        <Route path="dashboard" element={<SupervisorDashboard />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="attendance/history" element={<AttendanceHistoryPage />} />
        <Route path="workers" element={<EmployeesPage />} />
        <Route path="workers/:id" element={<EmployeeProfilePage />} />
        <Route path="shifts" element={<ShiftsPage />} />
        <Route path="tasks/board" element={<TaskBoardPage />} />
        <Route path="tasks/new" element={<CreateAssignTaskPage />} />
        <Route path="tasks/all" element={<AllTasksPage />} />
        <Route path="remarks" element={<RemarksPage />} />
        <Route path="profile" element={<SupervisorProfilePage />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
