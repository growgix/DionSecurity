<?php
/**
 * Dion Security — Visitor Exit & Pass Return
 * Functional parity replacement for VisitorExitPage.jsx.
 * Authoritative Server-side Role Check: 'guard' role only.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard only
$currentUser = requirePageRole('guard');

$pageTitle = 'Visitor Exit & Pass Return';
$pageCss = [
    '/public/css/pages/guard/visitor_exit.css'
];
$pageScripts = [
    '/public/js/pages/guard/visitor_exit.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="exit-wrapper">

        <!-- Page Header -->
        <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <span class="text-xs uppercase font-semibold text-secondary" style="letter-spacing: 0.08em;">
                Guard Checkpoint • Turnstile Checkout
            </span>
            <h1 class="text-2xl font-bold text-primary" style="letter-spacing: -0.02em;">
                Visitor Exit & Pass Return
            </h1>
            <p class="text-sm text-secondary">
                Scan RFID visitor badge, record vehicle departure timestamp, and revoke digital turnstile access.
            </p>
        </div>

        <!-- Scanner Panel -->
        <section class="scanner-panel">
            <form id="scanner-form" style="display: flex; flex-direction: column; gap: var(--space-2);">
                <label for="scan-badge-input" class="form-label" style="font-weight: 700;">
                    Scan Badge RFID or Enter Pass ID / Visitor Name
                </label>
                <div class="scanner-input-wrap">
                    <div class="scanner-field">
                        <span class="material-symbols-outlined scanner-icon">qr_code_scanner</span>
                        <input
                            type="text"
                            id="scan-badge-input"
                            class="scanner-input"
                            placeholder="e.g. G-104, C-209, or visitor name..."
                            autofocus
                        >
                    </div>
                    <button type="submit" class="btn btn-primary" style="padding: 0.75rem 1.25rem;">
                        <span>Locate Pass</span>
                    </button>
                </div>
            </form>

            <div style="border-top: 1px solid var(--color-outline-variant); padding-top: var(--space-3);">
                <span class="text-xs uppercase text-secondary font-bold block" style="margin-bottom: var(--space-2);">
                    Active Inside (Click to select for fast checkout):
                </span>
                <div class="chip-group" id="quick-chips-container">
                    <span style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">Loading active passes...</span>
                </div>
            </div>
        </section>

        <!-- Selected Pass Verification Card -->
        <section class="verification-card" id="verification-card" style="display: none;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);">
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                    <div class="resident-avatar" id="v-avatar" style="width: 48px; height: 48px; border-radius: var(--radius-xl); background: var(--color-primary-container); color: var(--color-primary); font-weight: 700; display: flex; align-items: center; justify-content: center;">
                        VI
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-primary" id="v-name" style="margin: 0;">—</h3>
                        <p class="text-xs text-secondary" style="margin: 2px 0 0 0;">
                            Pass ID: <strong class="text-primary" id="v-badge">#—</strong> • <span id="v-category">—</span>
                        </p>
                    </div>
                </div>
                <span class="badge badge-primary">Currently Inside</span>
            </div>

            <div class="verification-details-grid">
                <div class="detail-block">
                    <span class="detail-block-label">Host Unit</span>
                    <span class="detail-block-val" id="v-host-unit">—</span>
                </div>
                <div class="detail-block">
                    <span class="detail-block-label">Vehicle</span>
                    <span class="detail-block-val mono" id="v-vehicle">—</span>
                </div>
                <div class="detail-block">
                    <span class="detail-block-label">Entry Timestamp</span>
                    <span class="detail-block-val mono" id="v-entry-time">—</span>
                </div>
                <div class="detail-block">
                    <span class="detail-block-label">Time on Premises</span>
                    <span class="detail-block-val mono text-primary" id="v-duration">—</span>
                </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); border-top: 1px solid var(--color-outline-variant); padding-top: var(--space-4);">
                <span class="text-xs text-secondary">
                    Physical pass card returned and digital token revoked.
                </span>
                <button type="button" class="btn btn-primary" id="btn-authorize-exit" style="background-color: var(--color-danger); border-color: var(--color-danger);">
                    <span class="material-symbols-outlined" style="font-size: 18px;">logout</span>
                    <span>Authorize Exit & Revoke Badge</span>
                </button>
            </div>
        </section>

    </div>
</main>

<div id="toast-container" class="toast-container"></div>

<?php
require_once __DIR__ . '/../../includes/footer.php';