<?php
/**
 * Dion Security — Supervisor Command Center (Dashboard)
 * Functional and visual parity replacement for React SupervisorDashboard.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Authoritative server-side role guard: only 'supervisor' role allowed
$currentUser = requirePageRole('supervisor');

$pageTitle = 'Supervisor Command Center';
$pageCss = [
    '/public/css/pages/supervisor/dashboard.css'
];
$pageScripts = [
    '/public/js/pages/supervisor/dashboard.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';

$formattedDate = date('l, F j, Y');
$userName = htmlspecialchars($currentUser['name'] ?? 'Supervisor', ENT_QUOTES, 'UTF-8');
?>

<main class="dion-main-content">
    <div class="supervisor-dashboard-wrapper">
        
        <!-- Error Alert Banner (Hidden by default) -->
        <div id="dashboard-error-banner" class="state-box error" style="display: none;"></div>

        <!-- Section 1: Operational Header & Shift Ribbon -->
        <section class="supervisor-header" aria-labelledby="page-title">
            <div class="supervisor-header-left">
                <div class="operational-date-pill">
                    <span class="material-symbols-outlined" style="font-size: 14px;">calendar_today</span>
                    <span>Estate Facility & Operations • <?= $formattedDate ?></span>
                </div>
                <h1 class="supervisor-title" id="page-title">Good morning, <?= $userName ?></h1>
                <p class="supervisor-subtitle">
                    Here's today's workforce overview, muster attendance, and task allocation matrix across security & facility staff.
                </p>
            </div>

            <div class="supervisor-header-right">
                <div class="shift-status-badge">
                    <span class="pulse-dot"></span>
                    <span>Shift: <strong class="text-primary">Morning (06:00 - 14:00)</strong></span>
                </div>
                <button type="button" class="btn btn-primary" id="open-task-modal-btn">
                    <span class="material-symbols-outlined" style="font-size: 18px;">add_task</span>
                    <span>Assign Task</span>
                </button>
            </div>
        </section>

        <!-- Section 2: Workforce Attendance KPI Ribbon (6 Reflowing Cards) -->
        <section class="kpi-ribbon-grid" aria-label="Workforce Attendance KPIs">
            <!-- 1. Total Roster -->
            <div class="kpi-ribbon-card">
                <div class="kpi-ribbon-top">
                    <span class="kpi-ribbon-label">Total Roster</span>
                    <span class="material-symbols-outlined">groups</span>
                </div>
                <div class="kpi-ribbon-value-row">
                    <span class="kpi-ribbon-value" id="kpi-total-roster">
                        <span class="skeleton skeleton-value"></span>
                    </span>
                    <span class="kpi-ribbon-unit">workers</span>
                </div>
                <div class="kpi-ribbon-footer">Enrolled headcount</div>
            </div>

            <!-- 2. Present -->
            <div class="kpi-ribbon-card">
                <div class="kpi-ribbon-top">
                    <span class="kpi-ribbon-label">Present</span>
                    <span class="pulse-dot" style="width: 6px; height: 6px;"></span>
                </div>
                <div class="kpi-ribbon-value-row">
                    <span class="kpi-ribbon-value" id="kpi-present-count">
                        <span class="skeleton skeleton-value"></span>
                    </span>
                    <span class="kpi-ribbon-unit" id="kpi-present-total">/ --</span>
                </div>
                <div class="kpi-ribbon-footer primary">
                    <span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span>
                    <span id="kpi-present-rate">--% Rate</span>
                </div>
            </div>

            <!-- 3. Absent -->
            <div class="kpi-ribbon-card">
                <div class="kpi-ribbon-top">
                    <span class="kpi-ribbon-label">Absent</span>
                    <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--color-danger);"></span>
                </div>
                <div class="kpi-ribbon-value-row">
                    <span class="kpi-ribbon-value danger" id="kpi-absent-count">
                        <span class="skeleton skeleton-value"></span>
                    </span>
                    <span class="kpi-ribbon-unit">unexcused</span>
                </div>
                <div class="kpi-ribbon-footer danger">
                    <span class="material-symbols-outlined" style="font-size: 14px;">warning</span>
                    <span>Uncovered</span>
                </div>
            </div>

            <!-- 4. On Leave -->
            <div class="kpi-ribbon-card">
                <div class="kpi-ribbon-top">
                    <span class="kpi-ribbon-label">On Leave</span>
                    <span class="material-symbols-outlined">event_busy</span>
                </div>
                <div class="kpi-ribbon-value-row">
                    <span class="kpi-ribbon-value" id="kpi-leave-count">
                        <span class="skeleton skeleton-value"></span>
                    </span>
                    <span class="kpi-ribbon-unit">approved</span>
                </div>
                <div class="kpi-ribbon-footer">Scheduled leave</div>
            </div>

            <!-- 5. Late Entry -->
            <div class="kpi-ribbon-card">
                <div class="kpi-ribbon-top">
                    <span class="kpi-ribbon-label">Late Entry</span>
                    <span class="material-symbols-outlined">schedule</span>
                </div>
                <div class="kpi-ribbon-value-row">
                    <span class="kpi-ribbon-value" id="kpi-late-count">
                        <span class="skeleton skeleton-value"></span>
                    </span>
                    <span class="kpi-ribbon-unit">&gt;15 min</span>
                </div>
                <div class="kpi-ribbon-footer warning">
                    <span>Gate 01 Record</span>
                </div>
            </div>

            <!-- 6. Active Tasks -->
            <div class="kpi-ribbon-card">
                <div class="kpi-ribbon-top">
                    <span class="kpi-ribbon-label">Active Tasks</span>
                    <span class="material-symbols-outlined">assignment_turned_in</span>
                </div>
                <div class="kpi-ribbon-value-row">
                    <span class="kpi-ribbon-value" id="kpi-active-tasks">
                        <span class="skeleton skeleton-value"></span>
                    </span>
                    <span class="kpi-ribbon-unit">in stream</span>
                </div>
                <div class="kpi-ribbon-footer primary">
                    <span id="kpi-urgent-tasks">0 High Priority</span>
                </div>
            </div>
        </section>

        <!-- Section 3: Workforce Duty Muster Table Panel -->
        <section class="muster-panel" aria-labelledby="muster-heading">
            <header class="muster-toolbar">
                <div class="muster-toolbar-left">
                    <h2 class="muster-title" id="muster-heading">Workforce Duty Muster</h2>
                    <p class="muster-subtitle">Instant 1-click status update & roster verification</p>
                </div>

                <div class="muster-filters">
                    <div class="search-input-wrap">
                        <span class="material-symbols-outlined search-icon">search</span>
                        <input
                            type="search"
                            id="worker-search-input"
                            class="search-input"
                            placeholder="Search worker by name, ID..."
                            aria-label="Search worker by name or ID"
                        >
                    </div>

                    <select id="dept-select" class="dept-select" aria-label="Filter by department">
                        <option value="all">All Departments</option>
                        <option value="Security & Surveillance">Security & Surveillance</option>
                        <option value="Facilities & Engineering">Facilities & Engineering</option>
                        <option value="Housekeeping & Sanitization">Housekeeping & Sanitization</option>
                        <option value="Landscaping & Horticulture">Landscaping & Horticulture</option>
                    </select>
                </div>
            </header>

            <div class="table-container" style="border: none; border-radius: 0;">
                <table class="dion-table" id="muster-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Role & Dept</th>
                            <th>Station</th>
                            <th>Check In</th>
                            <th>Status</th>
                            <th style="text-align: right;">Muster Action</th>
                        </tr>
                    </thead>
                    <tbody id="muster-tbody">
                        <tr>
                            <td colspan="6">
                                <div class="state-box">
                                    <span class="skeleton skeleton-text" style="width: 80%;"></span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <footer class="muster-footer">
                <span id="muster-footer-count">Loading workforce muster roster...</span>
                <a href="/pages/supervisor/guard_monitoring.php" class="text-primary font-semibold hover:underline">
                    View Complete Roster & Guard Console →
                </a>
            </footer>
        </section>

        <!-- Section 4 & 5: Live Tasks & Supervisor Field Remark -->
        <div class="supervisor-grid">
            <!-- Left Column (8 cols): Live Task Queue -->
            <div class="supervisor-col-tasks">
                <section class="panel" aria-labelledby="tasks-heading">
                    <header class="panel-header">
                        <div class="panel-title-wrap">
                            <h3 class="panel-title" id="tasks-heading">Live Task Queue</h3>
                            <span class="panel-tag">Facilities & Patrol Assignments</span>
                        </div>
                        <a href="/pages/supervisor/patrol_dispatch.php" class="panel-link">
                            <span>Open Task Board</span>
                            <span class="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </header>

                    <div id="task-queue-container" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
                        <div class="task-item-card">
                            <span class="skeleton skeleton-text" style="width: 100%; height: 20px;"></span>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Right Column (4 cols): Supervisor Field Remarks -->
            <div class="supervisor-col-remarks">
                <section class="panel" aria-labelledby="remarks-heading">
                    <header class="panel-header">
                        <h3 class="panel-title" id="remarks-heading">Supervisor Field Log</h3>
                    </header>

                    <div class="remarks-card-body">
                        <p class="text-xs text-muted">
                            Record shift observations, contractor remarks, or perimeter incident flags.
                        </p>

                        <form id="supervisor-remark-form" style="display: flex; flex-direction: column; gap: var(--space-3);">
                            <textarea
                                id="supervisor-remark-text"
                                rows="3"
                                class="form-textarea"
                                placeholder="e.g. Morning muster completed with 90% attendance. Gate 02 sensor recalibration in progress."
                                required
                            ></textarea>

                            <button type="submit" class="btn btn-primary btn-block" id="remark-submit-btn">
                                Post Field Remark
                            </button>
                        </form>

                        <a href="/pages/supervisor/incident_management.php" class="remark-footer-link">
                            View All Field Remarks & Incidents →
                        </a>
                    </div>
                </section>
            </div>
        </div>

    </div>
</main>

<!-- Assign Workforce Task Modal -->
<div class="modal-backdrop" id="assign-task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
    <div class="modal-dialog">
        <header class="modal-header">
            <div>
                <h2 class="modal-title" id="task-modal-title">Assign Workforce Task</h2>
                <p class="text-xs text-muted" style="margin-top: 2px;">Allocate facilities, patrol, or inspection duties to on-duty personnel.</p>
            </div>
            <button type="button" class="modal-close-btn" data-modal-close aria-label="Close modal">
                <span class="material-symbols-outlined">close</span>
            </button>
        </header>

        <form id="assign-task-form">
            <div class="modal-body">
                <div class="form-group">
                    <label for="task-title" class="form-label">Task Title</label>
                    <input
                        type="text"
                        id="task-title"
                        name="title"
                        class="form-input"
                        placeholder="e.g. Perimeter Gate 02 Sensor Diagnostic"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="task-assignee" class="form-label">Assignee</label>
                    <select id="task-assignee" name="assignee" class="form-select" required>
                        <option value="">Loading rostered staff...</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="task-priority" class="form-label">Priority</label>
                    <select id="task-priority" name="priority" class="form-select">
                        <option value="low">Low Priority</option>
                        <option value="medium" selected>Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="task-location" class="form-label">Location / Gate</label>
                    <input
                        type="text"
                        id="task-location"
                        name="location"
                        class="form-input"
                        placeholder="e.g. Sector 4 East Wing / Gate 02"
                    >
                </div>

                <div class="form-group">
                    <label for="task-description" class="form-label">Operational Brief</label>
                    <textarea
                        id="task-description"
                        name="description"
                        rows="2"
                        class="form-textarea"
                        placeholder="Provide field instructions or safety requisitions..."
                    ></textarea>
                </div>
            </div>

            <footer class="modal-footer">
                <button type="button" class="btn btn-outline" data-modal-close>Cancel</button>
                <button type="submit" class="btn btn-primary" id="task-submit-btn">Dispatch Task</button>
            </footer>
        </form>
    </div>
</div>

<?php
require_once __DIR__ . '/../../includes/footer.php';
?>