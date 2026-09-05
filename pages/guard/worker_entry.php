<?php
/**
 * Dion Security — Guard Worker Entry & Badge Scanner
 * Functional parity replacement for WorkerEntryPage.jsx.
 * Authoritative Server-side Role Check: 'guard' and 'admin'.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard and admin
$currentUser = requirePageRole('guard', 'admin');

$pageTitle = 'Worker Entry & Badge Scanner';
$pageCss = [
    '/public/css/pages/guard/worker_entry.css'
];
$pageScripts = [
    '/public/js/pages/guard/worker_entry.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="worker-entry-wrapper">

        <!-- Top Operational Banner -->
        <section class="terminal-banner">
            <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
                <span class="terminal-badge">
                    <span class="terminal-pulse"></span>
                    GUARD CHECKPOINT • TURNSTILE CHECK-IN
                </span>
                <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-on-surface-muted);">
                    TERMINAL: GATE 01 RFID INTERFACE
                </span>
            </div>
            <a href="/pages/guard/dashboard.php" class="terminal-kbd">
                <kbd style="padding: 2px 6px; border-radius: 4px; background: var(--color-surface-lowest); box-shadow: var(--shadow-sm); font-weight: 700;">Esc</kbd>
                <span>Dashboard</span>
            </a>
        </section>

        <!-- Header -->
        <div class="page-header">
            <span class="subheading">Guard Checkpoint • Turnstile Check-In</span>
            <h1 class="heading">Worker Entry & Badge Scanner</h1>
            <p class="description">Scan worker RFID badge card or QR pass to record shift entry and verify duty roster location.</p>
        </div>

        <!-- Scanner Card -->
        <div class="scanner-card">
            <form id="scanner-form" class="scanner-form">
                <label for="scan-input" class="scanner-label">
                    Scan Employee RFID or Enter Badge ID / Name
                </label>
                <div class="scanner-input-group">
                    <div class="input-with-icon">
                        <span class="material-symbols-outlined input-icon">badge</span>
                        <input
                            type="text"
                            id="scan-input"
                            autofocus
                            placeholder="e.g. DION-E101, WRK-1001, or Ramesh Kumar..."
                            class="scan-input"
                        />
                    </div>
                    <button type="submit" class="btn-scan" id="btn-scan">
                        <span class="material-symbols-outlined" style="font-size: 18px;">qr_code_scanner</span>
                        <span>Scan Badge</span>
                    </button>
                </div>
            </form>

            <!-- Quick Select Roster -->
            <div class="quick-roster-section">
                <span class="quick-roster-title">Rostered Personnel (Click for fast selection):</span>
                <div id="quick-roster-chips" class="quick-chips-container">
                    <span class="loading-text">Loading rostered personnel...</span>
                </div>
            </div>
        </div>

        <!-- Selected Worker Preview -->
        <div id="worker-preview-card" class="worker-card" style="display: none;">
            <div class="worker-card-header">
                <div class="worker-identity">
                    <div id="w-avatar" class="worker-avatar">--</div>
                    <div>
                        <h3 id="w-name" class="worker-name">Employee Name</h3>
                        <p class="worker-role-dept">
                            <span id="w-role">Role</span> • <strong id="w-department" class="worker-dept">Department</strong>
                        </p>
                    </div>
                </div>
                <div id="w-status-badge"></div>
            </div>

            <div class="worker-details-grid">
                <div class="detail-item">
                    <span class="detail-label">Badge Number</span>
                    <span id="w-badge" class="detail-val mono font-bold">--</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Assigned Station</span>
                    <span id="w-location" class="detail-val font-semibold">--</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duty Shift</span>
                    <span id="w-shift" class="detail-val mono">--</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Aadhaar Verified</span>
                    <span id="w-aadhaar" class="detail-val mono text-muted">--</span>
                </div>
            </div>

            <div class="worker-card-actions">
                <span class="verification-note">
                    <span class="material-symbols-outlined" style="font-size: 16px; color: var(--color-success);">verified</span>
                    <span>Biometric & RFID verified at Gate 01 Terminal.</span>
                </span>
                <div class="action-buttons">
                    <button type="button" id="btn-cancel-worker" class="btn-secondary">Cancel</button>
                    <button type="button" id="btn-confirm-checkin" class="btn-primary">
                        <span class="material-symbols-outlined" style="font-size: 18px;">how_to_reg</span>
                        <span>Confirm Check-In & Grant Access</span>
                    </button>
                </div>
            </div>
        </div>

    </div>
</main>

<div id="toast-container" class="toast-container"></div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>