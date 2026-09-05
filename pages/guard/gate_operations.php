<?php
/**
 * Dion Security — Gate Operations & Housing Hub
 * Parity replacement for Gate Operations and Intercom Housing Directory.
 * Authoritative Server-side Role Check: 'guard' role only.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard only
$currentUser = requirePageRole('guard');

$pageTitle = 'Gate Operations & Housing Hub';
$pageCss = [
    '/public/css/pages/guard/gate_operations.css'
];
$pageScripts = [
    '/public/js/pages/guard/gate_operations.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="operations-wrapper">

        <!-- Page Header -->
        <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <div style="display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--color-on-surface-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                <span>Guard Security Terminal</span>
                <span>•</span>
                <span>Gate Operations & Housing Hub</span>
            </div>
            <h1 class="text-2xl font-bold text-primary" style="letter-spacing: -0.02em;">
                Gate Operations & Housing Hub
            </h1>
            <p class="text-sm text-secondary">
                Instant resident verification, direct intercom audio relay, active gate occupancy, and fast visitor onboarding.
            </p>
        </div>

        <!-- Operations Navigation Strip (4 Cards) -->
        <section class="operations-nav-strip">
            <a href="/pages/guard/visitor_checkin.php" class="ops-nav-card">
                <div class="ops-nav-icon">
                    <span class="material-symbols-outlined" style="font-size: 22px;">person_add</span>
                </div>
                <div class="ops-nav-text">
                    <span class="ops-nav-title">Visitor Registration</span>
                    <span class="ops-nav-desc">Issue digital badge pass</span>
                </div>
            </a>

            <a href="/pages/guard/currently_inside.php" class="ops-nav-card">
                <div class="ops-nav-icon">
                    <span class="material-symbols-outlined" style="font-size: 22px;">groups</span>
                </div>
                <div class="ops-nav-text">
                    <span class="ops-nav-title">Currently Inside</span>
                    <span class="ops-nav-desc">Live estate occupancy</span>
                </div>
            </a>

            <a href="/pages/guard/visitor_exit.php" class="ops-nav-card">
                <div class="ops-nav-icon">
                    <span class="material-symbols-outlined" style="font-size: 22px;">logout</span>
                </div>
                <div class="ops-nav-text">
                    <span class="ops-nav-title">Visitor Exit</span>
                    <span class="ops-nav-desc">Turnstile pass surrender</span>
                </div>
            </a>

            <a href="/pages/guard/gate_log.php" class="ops-nav-card">
                <div class="ops-nav-icon">
                    <span class="material-symbols-outlined" style="font-size: 22px;">sensor_door</span>
                </div>
                <div class="ops-nav-text">
                    <span class="ops-nav-title">Gate Audit Log</span>
                    <span class="ops-nav-desc">Chronological access log</span>
                </div>
            </a>
        </section>

        <!-- Station Telemetry Strip -->
        <section class="station-telemetry-banner">
            <div class="station-telemetry-item">
                <span class="station-telemetry-label">Active Visitors Inside</span>
                <span class="station-telemetry-val" id="tel-active-occupancy">-- Active</span>
            </div>
            <div class="station-telemetry-item">
                <span class="station-telemetry-label">Today's Gate Trips</span>
                <span class="station-telemetry-val" id="tel-today-trips">--</span>
            </div>
            <div class="station-telemetry-item">
                <span class="station-telemetry-label">Gate 01 Intercom Line</span>
                <span class="station-telemetry-val" style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--color-success);"></span>
                    <span>ONLINE : #01-GATE</span>
                </span>
            </div>
            <div class="station-telemetry-item">
                <span class="station-telemetry-label">Perimeter Protocol</span>
                <span class="station-telemetry-val" style="color: var(--color-success);">NORMAL SECURE</span>
            </div>
        </section>

        <!-- Housing & Intercom Directory Section -->
        <section style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div class="directory-filter-row">
                <div class="search-field-wrap">
                    <span class="material-symbols-outlined search-field-icon">search</span>
                    <input
                        type="search"
                        id="house-search-input"
                        class="search-field-input"
                        placeholder="Search flat #, resident name, phone, vehicle plate..."
                    >
                </div>

                <select id="house-block-select" class="form-select" style="max-width: 220px;">
                    <option value="all">All Blocks (A - F)</option>
                    <option value="BLK-A">Block A</option>
                    <option value="BLK-B">Block B</option>
                    <option value="BLK-C">Block C</option>
                    <option value="BLK-D">Block D</option>
                </select>
            </div>

            <!-- Housing Grid Container -->
            <div class="housing-grid" id="housing-grid-container">
                <div style="grid-column: 1 / -1; padding: var(--space-6); text-align: center; color: var(--color-on-surface-muted);">
                    <span class="material-symbols-outlined spin" style="font-size: 24px;">progress_activity</span>
                    <p style="font-size: var(--text-sm); margin-top: 6px;">Loading estate directory...</p>
                </div>
            </div>
        </section>

    </div>
</main>

<!-- Intercom Audio Call Modal -->
<div class="modal-backdrop" id="intercom-modal" role="dialog" aria-modal="true" aria-labelledby="intercom-modal-title">
    <div class="modal-dialog">
        <div class="modal-header">
            <h3 class="modal-title" id="intercom-modal-title">Intercom Terminal Hub</h3>
            <button type="button" class="modal-close-btn" data-close-modal aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body intercom-modal-body">
            <div class="intercom-wave-ring">
                <span class="material-symbols-outlined" style="font-size: 32px;">phone_in_talk</span>
            </div>
            <div>
                <h4 class="text-lg font-bold text-primary" id="modal-intercom-unit">Unit A-101</h4>
                <p class="text-sm text-secondary">
                    Intercom Channel: <strong class="text-primary font-mono" id="modal-intercom-ext">#101</strong>
                </p>
                <p class="text-xs text-secondary" style="margin-top: 4px;">
                    Secure audio relay established with resident handset.
                </p>
            </div>
            <button type="button" class="btn btn-primary" id="btn-end-intercom-call" style="background-color: var(--color-danger); border-color: var(--color-danger);">
                <span class="material-symbols-outlined" style="font-size: 18px;">call_end</span>
                <span>End Intercom Call</span>
            </button>
        </div>
    </div>
</div>

<div id="toast-container" class="toast-container"></div>

<?php
require_once __DIR__ . '/../../includes/footer.php';