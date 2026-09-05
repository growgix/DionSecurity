<?php
/**
 * Dion Security — Guard Visitor Check-in & Registration
 * Functional parity replacement for NewVisitorPage.jsx.
 * Authoritative Server-side Role Check: 'guard' role only.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard only
$currentUser = requirePageRole('guard');

$pageTitle = 'Visitor Check-in & Registration';
$pageCss = [
    '/public/css/pages/guard/visitor_checkin.css'
];
$pageScripts = [
    '/public/js/pages/guard/visitor_checkin.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="checkin-wrapper">

        <!-- Top Operational Banner & Cancel Hotkey -->
        <section class="terminal-banner">
            <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
                <span class="terminal-badge">
                    <span class="terminal-pulse"></span>
                    TERMINAL GATE 01 • VISITOR ONBOARDING
                </span>
                <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-on-surface-muted);">
                    CHANNEL: SECURE RELAY ENCRYPTED
                </span>
            </div>
            <a href="/pages/guard/dashboard.php" class="terminal-kbd">
                <kbd style="padding: 2px 6px; border-radius: 4px; background: var(--color-surface-lowest); box-shadow: var(--shadow-sm); font-weight: 700;">Esc</kbd>
                <span>to Cancel</span>
            </a>
        </section>

        <!-- Page Header & Live Clock -->
        <section class="checkin-header">
            <div class="checkin-title-wrap">
                <span class="text-xs uppercase font-semibold text-secondary" style="letter-spacing: 0.08em;">
                    Guard Security Operations
                </span>
                <h1 class="text-2xl font-bold text-primary" style="letter-spacing: -0.02em;">
                    New Visitor Registration
                </h1>
                <p class="text-sm text-secondary">
                    Register incoming visitor, verify resident authorization, and generate digital turnstile badge.
                </p>
            </div>

            <div class="checkin-clock-card">
                <div>
                    <span class="text-xs uppercase text-secondary block" style="font-size: 0.7rem;">Gate Clock</span>
                    <span class="font-mono text-lg font-bold text-primary tabular-nums" id="gate-clock-display">--:--:--</span>
                </div>
                <div style="width: 1px; height: 32px; background-color: var(--color-outline-variant);"></div>
                <div>
                    <span class="text-xs uppercase text-secondary block" style="font-size: 0.7rem;">Terminal</span>
                    <span class="font-bold text-secondary text-sm">GATE 01</span>
                </div>
            </div>
        </section>

        <!-- Stepper Bar (Step 1 -> Step 2 -> Step 3) -->
        <section class="stepper-bar">
            <div class="step-item active" id="step-item-1">
                <div class="step-num">1</div>
                <div class="step-text">
                    <span class="step-label">Step 01</span>
                    <span class="step-title">Host Resident</span>
                </div>
            </div>
            <div class="step-item" id="step-item-2">
                <div class="step-num">2</div>
                <div class="step-text">
                    <span class="step-label">Step 02</span>
                    <span class="step-title">Visitor Details</span>
                </div>
            </div>
            <div class="step-item" id="step-item-3">
                <div class="step-num">3</div>
                <div class="step-text">
                    <span class="step-label">Step 03</span>
                    <span class="step-title">Confirm & Issue Badge</span>
                </div>
            </div>
        </section>

        <!-- 2-Column Grid: Form Steps on Left, Live Pass Preview on Right -->
        <div class="checkin-grid">

            <!-- Left: Step Panels -->
            <div>
                <!-- Step 1 Panel: Select Host Resident -->
                <div class="form-panel" id="step-panel-1">
                    <h3 class="text-lg font-bold text-primary">Select Host Resident</h3>
                    
                    <div class="form-group">
                        <label for="unit-select" class="form-label">Flat / Unit Number</label>
                        <select id="unit-select" class="form-select">
                            <option value="">Loading resident directory...</option>
                        </select>
                    </div>

                    <!-- Selected Resident Snapshot -->
                    <div class="resident-snapshot" id="resident-snapshot-card">
                        <div class="resident-avatar" id="snapshot-avatar">RH</div>
                        <div>
                            <h4 class="font-bold text-on-surface" id="snapshot-resident-name">Loading Resident...</h4>
                            <p class="text-xs text-secondary" id="snapshot-unit-phone">Unit — • Phone —</p>
                            <span style="display: inline-flex; align-items: center; gap: 4px; color: var(--color-primary); font-size: var(--text-xs); font-weight: 600; margin-top: 4px;">
                                <span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span>
                                <span>Intercom Line Connected</span>
                            </span>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; margin-top: var(--space-2);">
                        <button type="button" class="btn btn-primary" id="step1-next-btn">
                            <span>Proceed to Visitor Details</span>
                            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
                        </button>
                    </div>
                </div>

                <!-- Step 2 Panel: Visitor Details -->
                <div class="form-panel" id="step-panel-2" style="display: none;">
                    <h3 class="text-lg font-bold text-primary">Visitor Information</h3>

                    <div class="form-group">
                        <label for="visitor-name-input" class="form-label">Visitor Full Name *</label>
                        <input type="text" id="visitor-name-input" class="form-input" placeholder="e.g. Sunil Gavaskar" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                        <div class="form-group">
                            <label for="visitor-category-select" class="form-label">Category</label>
                            <select id="visitor-category-select" class="form-select">
                                <option value="Guest / Family">Guest / Family</option>
                                <option value="Cab / Taxi">Cab / Taxi (Uber/Ola)</option>
                                <option value="Delivery / Courier">Delivery / Courier</option>
                                <option value="Food Delivery">Food Delivery (Zomato/Swiggy)</option>
                                <option value="Contractor / Service">Contractor / Service</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="visitor-phone-input" class="form-label">Phone Number</label>
                            <input type="tel" id="visitor-phone-input" class="form-input" placeholder="+91 98000 00000">
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                        <div class="form-group">
                            <label for="visitor-vehicle-input" class="form-label">Vehicle Plate (If Driving)</label>
                            <input type="text" id="visitor-vehicle-input" class="form-input" placeholder="e.g. MH-02-AB-1234 or Walk-in">
                        </div>
                        <div class="form-group">
                            <label for="visitor-purpose-input" class="form-label">Visit Purpose</label>
                            <input type="text" id="visitor-purpose-input" class="form-input" placeholder="e.g. Personal visit / Package drop">
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: var(--space-2);">
                        <button type="button" class="btn btn-outline" id="step2-back-btn">
                            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
                            <span>Back</span>
                        </button>
                        <button type="button" class="btn btn-primary" id="step2-next-btn">
                            <span>Review & Confirm</span>
                            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
                        </button>
                    </div>
                </div>

                <!-- Step 3 Panel: Confirmation & Submission -->
                <div class="form-panel" id="step-panel-3" style="display: none;">
                    <h3 class="text-lg font-bold text-primary">Authorize & Issue Badge</h3>

                    <div style="padding: var(--space-4); border-radius: var(--radius-lg); background-color: var(--color-surface-dim); display: flex; flex-direction: column; gap: var(--space-2); font-size: var(--text-sm);">
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-secondary">Visitor:</span>
                            <span class="font-bold text-on-surface" id="review-visitor-name">—</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-secondary">Destination Host:</span>
                            <span class="font-bold text-on-surface" id="review-host-unit">—</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-secondary">Category:</span>
                            <span class="font-semibold text-primary" id="review-category">—</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-secondary">Vehicle:</span>
                            <span class="font-mono text-on-surface font-semibold" id="review-vehicle">—</span>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: var(--space-2);">
                        <button type="button" class="btn btn-outline" id="step3-back-btn">
                            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
                            <span>Edit Details</span>
                        </button>
                        <button type="button" class="btn btn-primary" id="submit-visitor-btn">
                            <span class="material-symbols-outlined" style="font-size: 18px;">verified</span>
                            <span>Confirm Entry & Issue Badge</span>
                        </button>
                    </div>
                </div>

                <!-- Step 4 Panel: Success Result -->
                <div class="form-panel success-card" id="step-panel-success" style="display: none;">
                    <div class="success-icon">
                        <span class="material-symbols-outlined" style="font-size: 36px;">check_circle</span>
                    </div>
                    <h3 class="text-xl font-bold text-primary">Turnstile Authorization Complete!</h3>
                    <p class="text-sm text-secondary">Pass generated and turnstile clearance logged to gate audit ledger.</p>

                    <div style="width: 100%; max-width: 360px; padding: var(--space-4); border-radius: var(--radius-lg); background-color: var(--color-surface-dim); border: 1px solid var(--color-outline-variant); margin: var(--space-3) 0; display: flex; flex-direction: column; gap: var(--space-2); text-align: left; font-size: var(--text-sm);">
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-secondary">Issued Pass ID:</span>
                            <span class="font-mono font-bold text-primary text-base" id="issued-pass-badge">#G-000</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-secondary">Visitor:</span>
                            <span class="font-semibold" id="issued-visitor-name">—</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-secondary">Destination:</span>
                            <span class="font-semibold" id="issued-host-unit">—</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-secondary">Entry Timestamp:</span>
                            <span class="font-mono text-secondary" id="issued-entry-time">—</span>
                        </div>
                    </div>

                    <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center;">
                        <button type="button" class="btn btn-outline" id="btn-new-registration">
                            <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
                            <span>Register Another</span>
                        </button>
                        <a href="/pages/guard/currently_inside.php" class="btn btn-primary">
                            <span>View Currently Inside</span>
                            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
                        </a>
                    </div>
                </div>

            </div>

            <!-- Right: Live Pass Preview Card -->
            <div>
                <div class="pass-preview-card">
                    <div class="pass-preview-header">
                        <div>
                            <span class="pass-tag">DIGITAL TURNSTILE PASS</span>
                            <h4 class="pass-badge-id" id="preview-pass-badge">#PASS-PREVIEW</h4>
                        </div>
                        <div class="pass-qr-box">
                            <span class="material-symbols-outlined" style="font-size: 26px;">qr_code_2</span>
                        </div>
                    </div>

                    <div class="pass-details-list">
                        <div class="pass-row">
                            <span class="pass-row-label">Visitor:</span>
                            <span class="pass-row-val" id="preview-visitor-name">Awaiting Input</span>
                        </div>
                        <div class="pass-row">
                            <span class="pass-row-label">Host Flat:</span>
                            <span class="pass-row-val font-mono" id="preview-host-flat">—</span>
                        </div>
                        <div class="pass-row">
                            <span class="pass-row-label">Gate Terminal:</span>
                            <span class="pass-row-val font-mono">Gate 01 Main</span>
                        </div>
                    </div>

                    <div class="pass-status-pill" id="preview-status-pill">
                        STATUS: READY TO ISSUE
                    </div>
                </div>
            </div>

        </div>

    </div>
</main>

<div id="toast-container" class="toast-container"></div>

<?php
require_once __DIR__ . '/../../includes/footer.php';