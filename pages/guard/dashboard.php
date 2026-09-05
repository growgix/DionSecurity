<?php
/**
 * Dion Security — Guard Command Center (Dashboard)
 * Parity replacement for React GuardDashboard.jsx.
 * Authoritative Server-side Role Check: 'guard' role only.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard only
$currentUser = requirePageRole('guard');

$pageTitle = 'Guard Command Center';
$pageCss = [
    '/public/css/pages/guard/dashboard.css'
];
$pageScripts = [
    '/public/js/pages/guard/dashboard.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';

$formattedDate = date('l, F j, Y');
$guardName = htmlspecialchars($currentUser['name'] ?? 'Guard', ENT_QUOTES, 'UTF-8');
?>

<main class="dion-main-content">
    <div class="guard-dashboard-wrapper">
        
        <!-- Error Alert Banner (Hidden by default) -->
        <div id="dashboard-error-banner" class="state-box error" style="display: none;"></div>

        <!-- Section 1: Operational Station Header -->
        <section class="station-header" aria-labelledby="station-title">
            <div class="station-header-left">
                <div class="station-badge-row">
                    <span class="station-tag">
                        <span class="station-tag-pulse"></span>
                        MAIN GATE
                    </span>
                    <span class="station-subtitle-tag">Operational Station</span>
                </div>
                <h1 class="station-title" id="station-title">Good morning, <?= $guardName ?></h1>
                <div class="station-meta">
                    <span><?= $formattedDate ?></span>
                    <span class="station-meta-dot">•</span>
                    <span class="station-meta-shift">Shift: Morning (06:00 - 14:00)</span>
                    <span class="station-meta-dot">•</span>
                    <span class="station-gate-pill">Gate No. 01</span>
                </div>
            </div>

            <div class="station-header-right">
                <div class="intercom-card">
                    <div class="intercom-text">
                        <span class="intercom-label">Intercom Hub</span>
                        <span class="intercom-status">ONLINE : #01-GATE</span>
                    </div>
                    <div class="intercom-dot"></div>
                </div>

                <button type="button" class="btn-panic" id="open-panic-btn">
                    <span class="material-symbols-outlined" style="font-size: 18px;">e911_emergency</span>
                    <span>Panic Flag</span>
                </button>
            </div>
        </section>

        <!-- Section 2: 4 High-Priority Action Hotkey Cards (F1 - F4) -->
        <section class="hotkey-grid" aria-label="Quick Action Hotkeys">
            <!-- F1: New Visitor -->
            <a href="/pages/guard/visitor_checkin.php" class="hotkey-card">
                <div class="hotkey-card-top">
                    <div class="hotkey-icon-wrap">
                        <span class="material-symbols-outlined" style="font-size: 28px;">person_add</span>
                    </div>
                    <span class="hotkey-pill">F1 HOTKEY</span>
                </div>
                <div class="hotkey-card-body">
                    <span class="hotkey-title">NEW VISITOR</span>
                    <span class="hotkey-desc">Register guest / cab / package</span>
                </div>
                <div class="hotkey-watermark"></div>
            </a>

            <!-- F2: Search Person -->
            <a href="/pages/guard/search.php" class="hotkey-card">
                <div class="hotkey-card-top">
                    <div class="hotkey-icon-wrap">
                        <span class="material-symbols-outlined" style="font-size: 28px;">person_search</span>
                    </div>
                    <span class="hotkey-pill">F2 HOTKEY</span>
                </div>
                <div class="hotkey-card-body">
                    <span class="hotkey-title">SEARCH PERSON</span>
                    <span class="hotkey-desc">Resident, staff or auto</span>
                </div>
                <div class="hotkey-watermark"></div>
            </a>

            <!-- F3: Worker Entry -->
            <a href="/pages/guard/worker_entry.php" class="hotkey-card">
                <div class="hotkey-card-top">
                    <div class="hotkey-icon-wrap">
                        <span class="material-symbols-outlined" style="font-size: 28px;">login</span>
                    </div>
                    <span class="hotkey-pill">F3 HOTKEY</span>
                </div>
                <div class="hotkey-card-body">
                    <span class="hotkey-title">WORKER ENTRY</span>
                    <span class="hotkey-desc">Scan badge / QR pass</span>
                </div>
                <div class="hotkey-watermark"></div>
            </a>

            <!-- F4: Worker Exit -->
            <a href="/pages/guard/worker_exit.php" class="hotkey-card">
                <div class="hotkey-card-top">
                    <div class="hotkey-icon-wrap">
                        <span class="material-symbols-outlined" style="font-size: 28px;">logout</span>
                    </div>
                    <span class="hotkey-pill">F4 HOTKEY</span>
                </div>
                <div class="hotkey-card-body">
                    <span class="hotkey-title">WORKER EXIT</span>
                    <span class="hotkey-desc">Check out contractor</span>
                </div>
                <div class="hotkey-watermark"></div>
            </a>
        </section>

        <!-- Section 3: 4 Live Telemetry & Counter Cards -->
        <section class="telemetry-grid" aria-label="Gate Telemetry Cards">
            <!-- Metric 1: Visitors Today -->
            <div class="telemetry-card">
                <div class="telemetry-header">
                    <span class="telemetry-label">Visitors Today</span>
                    <span class="material-symbols-outlined telemetry-header-icon">history</span>
                </div>
                <div class="telemetry-value-row">
                    <span class="telemetry-value" id="count-visitors-today">86</span>
                    <span class="telemetry-badge">Logged</span>
                </div>
                <div class="telemetry-progress-track">
                    <div class="telemetry-progress-fill secondary" style="width: 74%;"></div>
                </div>
            </div>

            <!-- Metric 2: Visitors Inside -->
            <div class="telemetry-card">
                <div class="telemetry-header">
                    <span class="telemetry-label">Visitors Inside</span>
                    <span class="material-symbols-outlined telemetry-header-icon" style="color: var(--color-primary);">groups</span>
                </div>
                <div class="telemetry-value-row">
                    <span class="telemetry-value accent" id="count-visitors-inside">--</span>
                    <span class="telemetry-badge active">Live Occupancy</span>
                </div>
                <div class="telemetry-progress-track">
                    <div class="telemetry-progress-fill" id="bar-visitors-inside" style="width: 20%;"></div>
                </div>
            </div>

            <!-- Metric 3: Staff on Duty -->
            <div class="telemetry-card">
                <div class="telemetry-header">
                    <span class="telemetry-label">Staff on Duty</span>
                    <span class="material-symbols-outlined telemetry-header-icon" style="color: var(--color-primary);">badge</span>
                </div>
                <div class="telemetry-value-row">
                    <span class="telemetry-value" id="count-staff-duty">--</span>
                    <span class="telemetry-badge">/ 80</span>
                </div>
                <div class="telemetry-progress-track">
                    <div class="telemetry-progress-fill" id="bar-staff-duty" style="width: 15%;"></div>
                </div>
            </div>

            <!-- Metric 4: Live Gate Clock -->
            <div class="telemetry-card">
                <div class="telemetry-header">
                    <span class="telemetry-label">Live Gate Clock</span>
                    <span class="material-symbols-outlined telemetry-header-icon">schedule</span>
                </div>
                <div class="telemetry-value-row">
                    <span class="telemetry-clock" id="gate-clock-display">--:--:--</span>
                </div>
                <div class="telemetry-clock-subtext">Synchronized with Central NTP</div>
            </div>
        </section>

        <!-- Section 4: Currently Inside Premises Ledger -->
        <section class="inside-card" aria-labelledby="inside-table-heading">
            <div class="inside-header">
                <div class="inside-title-wrap">
                    <h2 class="inside-title" id="inside-table-heading">Currently Inside Premises</h2>
                    <span class="inside-active-badge" id="inside-active-badge">Loading...</span>
                </div>
                <a href="/pages/guard/currently_inside.php" class="inside-link">
                    <span>Full Occupancy Ledger</span>
                    <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
                </a>
            </div>

            <div class="table-container" style="border: none; border-radius: 0;">
                <table class="dion-table">
                    <thead>
                        <tr>
                            <th style="padding-left: var(--space-5);">Pass ID / Person</th>
                            <th>Category</th>
                            <th>Host / Unit</th>
                            <th>Entry Time</th>
                            <th>Vehicle</th>
                            <th style="padding-right: var(--space-5); text-align: right;">Quick Action</th>
                        </tr>
                    </thead>
                    <tbody id="inside-visitors-tbody">
                        <tr>
                            <td colspan="6" class="text-center py-6 text-secondary">
                                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                                    <span class="material-symbols-outlined spin" style="font-size: 20px;">progress_activity</span>
                                    <span>Syncing active visitors...</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>
</main>

<!-- Modal 1: Fast Exit Confirmation Modal -->
<div class="modal-backdrop" id="fast-exit-modal" role="dialog" aria-modal="true" aria-labelledby="exit-modal-title">
    <div class="modal-dialog">
        <div class="modal-header">
            <div>
                <h3 class="modal-title" id="exit-modal-title">Confirm Visitor Exit & Pass Return</h3>
                <p class="text-xs text-secondary" style="margin-top: 2px;">
                    Recording checkout for <strong id="exit-visitor-name">—</strong> (<span id="exit-badge-number">—</span>)
                </p>
            </div>
            <button type="button" class="modal-close-btn" data-close-modal aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="modal-visitor-details">
                <div class="detail-row">
                    <span class="detail-label">Host Unit:</span>
                    <span class="detail-value" id="exit-host-unit">—</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Vehicle:</span>
                    <span class="detail-value mono" id="exit-vehicle">—</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Entry Time:</span>
                    <span class="detail-value mono" id="exit-entry-time">—</span>
                </div>
            </div>

            <p class="modal-notice">
                Surrendered pass card has been verified and digital turnstile token will be revoked.
            </p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" data-close-modal>Cancel</button>
            <button type="button" class="btn btn-primary" id="confirm-exit-btn">
                <span class="material-symbols-outlined" style="font-size: 18px;">check</span>
                <span>Confirm Exit & Surrender Badge</span>
            </button>
        </div>
    </div>
</div>

<!-- Modal 2: Emergency Panic Trigger Modal -->
<div class="modal-backdrop" id="panic-modal" role="dialog" aria-modal="true" aria-labelledby="panic-modal-title">
    <div class="modal-dialog">
        <div class="modal-header panic-modal-header">
            <h3 class="modal-title" id="panic-modal-title">
                <span class="material-symbols-outlined" style="font-size: 24px;">e911_emergency</span>
                <span>EMERGENCY PANIC PROTOCOL</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="panic-warning-box">
                <strong>CRITICAL WARNING:</strong> Activating this protocol triggers high-priority audio sirens at the gate, seals turnstiles, and automatically dispatches alert notifications to Supervisors and Police dispatch.
            </div>

            <div class="form-group" style="margin-bottom: var(--space-4);">
                <label for="panic-location-input" class="form-label">Gate / Facility Location</label>
                <input type="text" id="panic-location-input" class="form-input" value="Main Gate 01" required>
            </div>

            <div class="form-group">
                <label for="panic-reason-input" class="form-label">Incident Reason / Assessment</label>
                <input type="text" id="panic-reason-input" class="form-input" value="Guard Emergency Panic Trigger" placeholder="Reason for emergency dispatch">
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" data-close-modal>Cancel</button>
            <button type="button" class="btn btn-danger" id="confirm-panic-btn">
                <span class="material-symbols-outlined" style="font-size: 18px;">warning</span>
                <span>TRIGGER EMERGENCY PROTOCOL</span>
            </button>
        </div>
    </div>
</div>

<!-- Global Notification Container -->
<div id="toast-container" class="toast-container"></div>

<?php
require_once __DIR__ . '/../../includes/footer.php';