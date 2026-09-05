<?php
/**
 * Dion Security — Supervisor Attendance Muster
 * Parity replacement for frontend/src/pages/supervisor/AttendancePage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

$currentUser = requirePageRole('supervisor', 'admin');

$pageTitle = 'Workforce Attendance Muster';
$pageCss = [
    '/public/css/pages/supervisor/attendance.css'
];
$pageScripts = [
    '/public/js/pages/supervisor/attendance.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';

$todayFormatted = date('l, F j, Y');
?>

<main class="dion-main-content">
    <div class="attendance-page-container">
        
        <!-- Header -->
        <header class="page-header-block">
            <div class="header-titles">
                <span class="eyebrow-text">Shift Muster & Verification</span>
                <h1 class="page-heading">Security Personnel Attendance</h1>
                <p class="page-description">
                    Daily roll call, shift presence verification, and one-click muster status updating for field personnel.
                </p>
            </div>
            <div class="header-actions">
                <span class="date-badge">
                    <span class="material-symbols-outlined" style="font-size: 16px;">calendar_month</span>
                    <span><?= $todayFormatted ?></span>
                </span>
                <button type="button" class="btn btn-secondary" id="btn-refresh-attendance">
                    <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
                    <span>Refresh Roster</span>
                </button>
            </div>
        </header>

        <!-- KPI Summary Ribbon -->
        <section class="kpi-grid" aria-label="Attendance KPIs">
            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-total">
                    <span class="material-symbols-outlined">badge</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Total Roster</span>
                    <span class="kpi-value" id="kpi-total">--</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-present">
                    <span class="material-symbols-outlined">check_circle</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Present / On Post</span>
                    <span class="kpi-value" id="kpi-present">--</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-absent">
                    <span class="material-symbols-outlined">cancel</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Absent / Off Duty</span>
                    <span class="kpi-value" id="kpi-absent">--</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-leave">
                    <span class="material-symbols-outlined">event_busy</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">On Leave</span>
                    <span class="kpi-value" id="kpi-leave">--</span>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-late">
                    <span class="material-symbols-outlined">schedule</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Late / Delayed</span>
                    <span class="kpi-value" id="kpi-late">--</span>
                </div>
            </div>
        </section>

        <!-- Notification Banner -->
        <div id="attendance-toast" class="attendance-toast" style="display: none;" role="alert"></div>

        <!-- Filter & Control Toolbar -->
        <div class="toolbar-card">
            <div class="search-input-group">
                <span class="material-symbols-outlined search-icon">search</span>
                <input type="text" id="filter-search" class="form-control" placeholder="Search by personnel name, badge, or role..." autocomplete="off">
            </div>

            <div class="filter-dropdowns">
                <select id="filter-department" class="form-select" aria-label="Filter by department">
                    <option value="all">All Departments</option>
                    <option value="Security">Security</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Administration">Administration</option>
                </select>

                <select id="filter-status" class="form-select" aria-label="Filter by muster status">
                    <option value="all">All Statuses</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">On Leave</option>
                    <option value="late">Late</option>
                </select>
            </div>
        </div>

        <!-- Attendance Muster Table Card -->
        <div class="table-card">
            <div class="table-header">
                <div class="table-header-left">
                    <h2 class="table-title">Personnel Muster Registry</h2>
                    <span class="badge badge-neutral" id="roster-count-badge">0 Personnel</span>
                </div>
            </div>

            <div class="table-responsive">
                <table class="data-table" id="attendance-table">
                    <thead>
                        <tr>
                            <th>Personnel</th>
                            <th>Designation / Role</th>
                            <th>Department</th>
                            <th>Shift Schedule</th>
                            <th>Contact Phone</th>
                            <th>Muster Status</th>
                            <th class="text-right">Quick Update</th>
                        </tr>
                    </thead>
                    <tbody id="attendance-tbody">
                        <tr>
                            <td colspan="7" class="loading-cell">
                                <div class="loading-state">
                                    <span class="material-symbols-outlined spinner">progress_activity</span>
                                    <span>Loading workforce roster...</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</main>

<?php
require_once __DIR__ . '/../../includes/footer.php';
?>