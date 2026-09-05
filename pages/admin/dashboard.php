<?php
/**
 * Dion Security — Admin Command Center (Dashboard)
 * Functional and visual parity replacement for React AdminDashboard.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Authoritative server-side role guard: only 'admin' role allowed
$currentUser = requirePageRole('admin');

$pageTitle = 'Command Center';
$pageCss = [
    '/public/css/pages/admin/dashboard.css'
];
$pageScripts = [
    '/public/js/pages/admin/dashboard.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';

$formattedDate = date('l, F j, Y');
$userName = htmlspecialchars($currentUser['name'] ?? 'Admin', ENT_QUOTES, 'UTF-8');
?>

<main class="dion-main-content">
    <div class="dashboard-wrapper">
        
        <!-- Error Alert Banner (Hidden by default) -->
        <div id="dashboard-error-banner" class="state-box error" style="display: none;"></div>

        <!-- Section A: Top Greeting & Executive Oversight Ribbon -->
        <section class="dashboard-header" aria-labelledby="page-title">
            <div class="dashboard-header-left">
                <div class="oversight-pill-row">
                    <span>Estate Executive Control</span>
                    <span>•</span>
                    <span class="live-indicator-pill">
                        <span class="pulse-dot"></span>
                        <span>Greenwood Estates — Live Monitoring active</span>
                    </span>
                </div>
                <h1 class="dashboard-title" id="page-title">Good morning, <?= $userName ?></h1>
                <p class="dashboard-subtitle"><?= $formattedDate ?></p>
            </div>

            <div class="dashboard-header-right">
                <div class="live-protocol-badge">
                    <span class="material-symbols-outlined">calendar_today</span>
                    <span>Live Day Protocol</span>
                </div>
                <button type="button" class="btn btn-primary" id="export-brief-btn">
                    <span class="material-symbols-outlined" style="font-size: 18px;">download</span>
                    <span>Export Brief</span>
                </button>
            </div>
        </section>

        <!-- Section B: Primary KPI Metrics Grid -->
        <section class="kpi-grid" aria-label="Key Operational Performance Indicators">
            <!-- 1. Visitors Today -->
            <div class="kpi-card" id="card-visitors-today">
                <div class="kpi-top">
                    <span class="kpi-label">Visitors Today</span>
                    <div class="kpi-icon-box">
                        <span class="material-symbols-outlined">sensor_door</span>
                    </div>
                </div>
                <div class="kpi-middle">
                    <div class="kpi-value" id="kpi-visitors-today">
                        <span class="skeleton skeleton-value"></span>
                    </div>
                    <span class="kpi-badge info">
                        <span class="material-symbols-outlined" style="font-size: 14px;">arrow_upward</span>
                        <span>12% vs yest.</span>
                    </span>
                </div>
                <div class="kpi-subtitle">Total throughput at pedestrian and perimeter gates</div>
            </div>

            <!-- 2. Currently Inside -->
            <div class="kpi-card" id="card-currently-inside">
                <div class="kpi-top">
                    <span class="kpi-label">Currently Inside</span>
                    <div class="kpi-icon-box">
                        <span class="material-symbols-outlined">groups</span>
                    </div>
                </div>
                <div class="kpi-middle">
                    <div class="kpi-value" id="kpi-currently-inside">
                        <span class="skeleton skeleton-value"></span>
                    </div>
                    <span class="kpi-badge info">
                        <span class="pulse-dot" style="width: 6px; height: 6px;"></span>
                        <span>Active on premises</span>
                    </span>
                </div>
                <div class="kpi-subtitle">Guests, contractors & delivery logistics</div>
            </div>

            <!-- 3. Employees Present -->
            <div class="kpi-card" id="card-employees-present">
                <div class="kpi-top">
                    <span class="kpi-label">Employees Present</span>
                    <div class="kpi-icon-box">
                        <span class="material-symbols-outlined">badge</span>
                    </div>
                </div>
                <div class="kpi-middle">
                    <div class="kpi-value" id="kpi-employees-present">
                        <span class="skeleton skeleton-value"></span>
                    </div>
                    <span class="kpi-badge neutral" id="kpi-employees-badge">
                        <span>--% quota</span>
                    </span>
                </div>
                <div class="kpi-subtitle" id="kpi-employees-subtitle">Verified staff rostered today</div>
            </div>

            <!-- 4. Pending Tasks -->
            <div class="kpi-card" id="card-pending-tasks">
                <div class="kpi-top">
                    <span class="kpi-label">Pending Tasks</span>
                    <div class="kpi-icon-box">
                        <span class="material-symbols-outlined">task_alt</span>
                    </div>
                </div>
                <div class="kpi-middle">
                    <div class="kpi-value" id="kpi-pending-tasks">
                        <span class="skeleton skeleton-value"></span>
                    </div>
                    <span class="kpi-badge urgent" id="kpi-tasks-badge">
                        <span>0 priority</span>
                    </span>
                </div>
                <div class="kpi-subtitle">Facilities, patrols & resident requisitions</div>
            </div>
        </section>

        <!-- Section C & D: Operational Grid (65% Left / 35% Right) -->
        <div class="dashboard-grid">
            
            <!-- Left Column: Activity Table & Perimeter Telemetry -->
            <div class="dashboard-col-left">
                
                <!-- Panel 1: Current Activity / Realtime Stream -->
                <section class="panel" aria-labelledby="panel-activity-heading">
                    <header class="panel-header">
                        <div class="panel-title-wrap">
                            <h2 class="panel-title" id="panel-activity-heading">Current Activity</h2>
                            <span class="panel-tag">Realtime Stream</span>
                        </div>
                        <a href="/pages/admin/gate.php" class="panel-link">
                            <span>View All Logs</span>
                            <span class="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </header>

                    <div class="table-container" style="border: none; border-radius: 0;">
                        <table class="dion-table" id="recent-activity-table">
                            <thead>
                                <tr>
                                    <th>Person</th>
                                    <th>Classification</th>
                                    <th>Location</th>
                                    <th>Entry</th>
                                    <th style="text-align: right;">Status</th>
                                </tr>
                            </thead>
                            <tbody id="recent-activity-tbody">
                                <tr>
                                    <td colspan="5">
                                        <div class="state-box">
                                            <span class="skeleton skeleton-text" style="width: 80%;"></span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Panel 2: Perimeter Array Telemetry -->
                <section class="panel" aria-labelledby="panel-telemetry-heading">
                    <header class="panel-header">
                        <div class="panel-title-wrap">
                            <h2 class="panel-title" id="panel-telemetry-heading">Perimeter Array Telemetry</h2>
                            <span class="panel-tag">4 Automated Gates, 14 Biometric Sensors</span>
                        </div>
                        <span class="kpi-badge info">
                            <span class="pulse-dot" style="width: 6px; height: 6px;"></span>
                            <span>Gate Net v4.2 Synchronized</span>
                        </span>
                    </header>

                    <div class="telemetry-grid">
                        <div class="telemetry-card">
                            <div class="telemetry-header">
                                <span class="telemetry-name">Gate 01 (Main North)</span>
                                <span class="badge badge-success">Online</span>
                            </div>
                            <div class="telemetry-meta">
                                <span>Guard on duty: Officer C. Miller</span>
                                <span class="font-mono text-xs" id="gate1-throughput">Throughput: 86</span>
                            </div>
                            <div class="telemetry-progress-bar">
                                <div class="telemetry-progress-fill" style="width: 75%;"></div>
                            </div>
                        </div>

                        <div class="telemetry-card">
                            <div class="telemetry-header">
                                <span class="telemetry-name">Gate 02 (East Service)</span>
                                <span class="badge badge-success">Online</span>
                            </div>
                            <div class="telemetry-meta">
                                <span>Guard on duty: Officer D. Kadam</span>
                                <span class="font-mono text-xs" id="gate2-throughput">Throughput: 34</span>
                            </div>
                            <div class="telemetry-progress-bar">
                                <div class="telemetry-progress-fill" style="width: 40%;"></div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            <!-- Right Column: Quick Dispatch Actions & Occupancy Ledger -->
            <div class="dashboard-col-right">
                
                <!-- Quick Operational Dispatch Panel -->
                <section class="panel" aria-labelledby="dispatch-heading">
                    <header class="panel-header">
                        <h2 class="panel-title" id="dispatch-heading">Operational Dispatch</h2>
                    </header>

                    <div class="dispatch-list">
                        <!-- Action 1: Estate Broadcast Modal Trigger -->
                        <button type="button" class="dispatch-item" id="open-broadcast-btn">
                            <div class="dispatch-icon-wrap">
                                <div class="dispatch-icon primary">
                                    <span class="material-symbols-outlined">campaign</span>
                                </div>
                                <div class="dispatch-info">
                                    <span class="dispatch-label">Estate Broadcast</span>
                                    <span class="dispatch-desc">Dispatch alert to all gates</span>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-muted">chevron_right</span>
                        </button>

                        <!-- Action 2: Workforce Task Assignment Link -->
                        <a href="/pages/admin/workforce.php" class="dispatch-item">
                            <div class="dispatch-icon-wrap">
                                <div class="dispatch-icon secondary">
                                    <span class="material-symbols-outlined">add_task</span>
                                </div>
                                <div class="dispatch-info">
                                    <span class="dispatch-label">Assign Workforce Task</span>
                                    <span class="dispatch-desc">Allocate staff to task</span>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-muted">chevron_right</span>
                        </a>

                        <!-- Action 3: Estate Infrastructure Link -->
                        <a href="/pages/admin/estate.php" class="dispatch-item">
                            <div class="dispatch-icon-wrap">
                                <div class="dispatch-icon accent">
                                    <span class="material-symbols-outlined">domain</span>
                                </div>
                                <div class="dispatch-info">
                                    <span class="dispatch-label">Estate Infrastructure</span>
                                    <span class="dispatch-desc">Manage 6 blocks & 255 units</span>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-muted">chevron_right</span>
                        </a>
                    </div>
                </section>

                <!-- Occupancy Ledger Panel -->
                <section class="panel" aria-labelledby="occupancy-heading">
                    <header class="panel-header">
                        <h2 class="panel-title" id="occupancy-heading">Occupancy Ledger</h2>
                        <span class="font-mono text-sm font-semibold text-primary" id="overall-occupancy-rate">
                            <span class="skeleton skeleton-text" style="width: 60px;"></span>
                        </span>
                    </header>

                    <div class="occupancy-body">
                        <div id="occupancy-list" style="display: flex; flex-direction: column; gap: var(--space-3);">
                            <div class="occupancy-item">
                                <span class="skeleton skeleton-text" style="width: 100%; height: 24px;"></span>
                            </div>
                        </div>

                        <a href="/pages/admin/estate.php" class="occupancy-footer-link">
                            View Full Society Roster & Wings →
                        </a>
                    </div>
                </section>

            </div>

        </div>

    </div>
</main>

<!-- Estate Broadcast Modal -->
<div class="modal-backdrop" id="broadcast-modal" role="dialog" aria-modal="true" aria-labelledby="broadcast-modal-title">
    <div class="modal-dialog">
        <header class="modal-header">
            <div>
                <h2 class="modal-title" id="broadcast-modal-title">Send Estate Broadcast</h2>
                <p class="text-xs text-muted" style="margin-top: 2px;">Transmit priority operational notice to gate guards & facility personnel.</p>
            </div>
            <button type="button" class="modal-close-btn" data-modal-close aria-label="Close modal">
                <span class="material-symbols-outlined">close</span>
            </button>
        </header>
        
        <form id="broadcast-form">
            <div class="modal-body">
                <div class="form-group">
                    <label for="broadcast-target" class="form-label">Target Audience</label>
                    <select id="broadcast-target" name="target" class="form-select">
                        <option value="all">All Gate Terminals & Facility Stations</option>
                        <option value="Gate 01 & Gate 02 Only">Main Gates (Gate 01 & 02)</option>
                        <option value="Security Personnel">Security Guards Only</option>
                        <option value="Facilities & Engineering">Facilities Crew Only</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="broadcast-message" class="form-label">Broadcast Message</label>
                    <textarea
                        id="broadcast-message"
                        name="message"
                        rows="3"
                        class="form-textarea"
                        placeholder="e.g. Mandatory vehicle trunk inspection protocol active for all delivery logistics."
                        required
                    ></textarea>
                </div>
            </div>

            <footer class="modal-footer">
                <button type="button" class="btn btn-outline" data-modal-close>Cancel</button>
                <button type="submit" class="btn btn-primary" id="broadcast-submit-btn">Dispatch Broadcast</button>
            </footer>
        </form>
    </div>
</div>

<?php
require_once __DIR__ . '/../../includes/footer.php';
?>