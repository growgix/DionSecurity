<?php
/**
 * Shared Left Navigation Sidebar Include
 * Dynamically renders role-appropriate navigation links matching Dion Security layout.
 */
require_once __DIR__ . '/../backend/config/auth.php';
$currentUser = getAuthenticatedUser();
$currentRole = $currentUser['role'] ?? 'guest';
$currentPath = $_SERVER['REQUEST_URI'] ?? '';
?>
<aside class="dion-sidebar" id="app-sidebar">
    <div class="sidebar-inner">
        <div class="sidebar-section-heading">Navigation</div>
        <nav class="sidebar-nav">
            <?php if ($currentRole === 'admin'): ?>
                <a href="/pages/admin/dashboard.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/dashboard') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">dashboard</span>
                    <span class="nav-label">Command Center</span>
                </a>
                <a href="/pages/admin/blocks.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/blocks') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">apartment</span>
                    <span class="nav-label">Blocks</span>
                </a>
                <a href="/pages/admin/houses.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/houses') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">home</span>
                    <span class="nav-label">Houses & Units</span>
                </a>
                <a href="/pages/admin/residents.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/residents') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">groups</span>
                    <span class="nav-label">Residents</span>
                </a>
                <a href="/pages/admin/family_members.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/family_members') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">family_restroom</span>
                    <span class="nav-label">Family Members</span>
                </a>
                <a href="/pages/admin/visitors.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/visitors') || str_starts_with($currentPath, '/pages/admin/expected') || str_starts_with($currentPath, '/pages/admin/regular') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">badge</span>
                    <span class="nav-label">Visitor Management</span>
                </a>
                <a href="/pages/admin/workforce.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/workforce') || str_starts_with($currentPath, '/pages/admin/employee') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">shield_person</span>
                    <span class="nav-label">Security Workforce</span>
                </a>
                <a href="/pages/admin/shifts.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/shifts') || str_starts_with($currentPath, '/pages/admin/assignments') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">schedule</span>
                    <span class="nav-label">Shifts & Posts</span>
                </a>
                <a href="/pages/admin/tasks.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/task') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">assignment</span>
                    <span class="nav-label">Master Tasks</span>
                </a>
                <a href="/pages/admin/payments.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/payment') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">payments</span>
                    <span class="nav-label">Financials & Dues</span>
                </a>
                <a href="/pages/admin/users.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/users') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">manage_accounts</span>
                    <span class="nav-label">User Accounts</span>
                </a>
                <a href="/pages/admin/audit.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/audit') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">history</span>
                    <span class="nav-label">Security Audit</span>
                </a>
                <a href="/pages/admin/reports.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/reports') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">analytics</span>
                    <span class="nav-label">Reports Center</span>
                </a>
                <a href="/pages/admin/settings.php" class="nav-item <?= str_starts_with($currentPath, '/pages/admin/settings') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">settings</span>
                    <span class="nav-label">Estate Settings</span>
                </a>

            <?php elseif ($currentRole === 'supervisor'): ?>
                <a href="/pages/supervisor/dashboard.php" class="nav-item <?= str_starts_with($currentPath, '/pages/supervisor/dashboard') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">dashboard</span>
                    <span class="nav-label">Supervisor Hub</span>
                </a>
                <a href="/pages/supervisor/attendance.php" class="nav-item <?= str_starts_with($currentPath, '/pages/supervisor/attendance') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">fact_check</span>
                    <span class="nav-label">Attendance Muster</span>
                </a>
                <a href="/pages/supervisor/task_board.php" class="nav-item <?= str_starts_with($currentPath, '/pages/supervisor/task_board') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">view_kanban</span>
                    <span class="nav-label">Task Board</span>
                </a>
                <a href="/pages/supervisor/task_create.php" class="nav-item <?= str_starts_with($currentPath, '/pages/supervisor/task_create') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">add_task</span>
                    <span class="nav-label">Create / Assign Task</span>
                </a>
                <a href="/pages/supervisor/task_remarks.php" class="nav-item <?= str_starts_with($currentPath, '/pages/supervisor/task_remarks') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">comment</span>
                    <span class="nav-label">Task Remarks</span>
                </a>
                <a href="/pages/supervisor/profile.php" class="nav-item <?= str_starts_with($currentPath, '/pages/supervisor/profile') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">account_circle</span>
                    <span class="nav-label">Supervisor Profile</span>
                </a>

            <?php elseif ($currentRole === 'guard'): ?>
                <a href="/pages/guard/dashboard.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/dashboard') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">shield</span>
                    <span class="nav-label">Guard Post Console</span>
                </a>
                <a href="/pages/guard/visitor_checkin.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/visitor_checkin') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">person_add</span>
                    <span class="nav-label">Visitor Check-In</span>
                </a>
                <a href="/pages/guard/search.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/search') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">person_search</span>
                    <span class="nav-label">Search Person</span>
                </a>
                <a href="/pages/guard/currently_inside.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/currently_inside') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">sensor_occupied</span>
                    <span class="nav-label">Currently Inside</span>
                </a>
                <a href="/pages/guard/visitor_exit.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/visitor_exit') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">logout</span>
                    <span class="nav-label">Visitor Exit</span>
                </a>
                <a href="/pages/guard/worker_entry.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/worker_entry') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">login</span>
                    <span class="nav-label">Worker Entry</span>
                </a>
                <a href="/pages/guard/worker_exit.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/worker_exit') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">badge</span>
                    <span class="nav-label">Worker Exit</span>
                </a>
                <a href="/pages/guard/residents_houses.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/residents_houses') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">apartment</span>
                    <span class="nav-label">Residents & Houses</span>
                </a>
                <a href="/pages/guard/gate_log.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/gate_log') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">assignment</span>
                    <span class="nav-label">Today's Gate Log</span>
                </a>
                <a href="/pages/guard/gate_operations.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/gate_operations') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">door_sliding</span>
                    <span class="nav-label">Gate Operations Hub</span>
                </a>
                <a href="/pages/guard/profile.php" class="nav-item <?= str_starts_with($currentPath, '/pages/guard/profile') ? 'active' : '' ?>">
                    <span class="material-symbols-outlined nav-icon">account_circle</span>
                    <span class="nav-label">My Profile</span>
                </a>
            <?php endif; ?>
        </nav>

        <div class="sidebar-footer">
            <div class="estate-brand-badge">
                <span class="material-symbols-outlined">verified_user</span>
                <div class="estate-info">
                    <span class="estate-name">Dion Estates</span>
                    <span class="estate-sub">Security Operations v2.0</span>
                </div>
            </div>
        </div>
    </div>
</aside>