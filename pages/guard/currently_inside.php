<?php
/**
 * Dion Security — Currently Inside Premises
 * Functional parity replacement for CurrentlyInsidePage.jsx.
 * Authoritative Server-side Role Check: 'guard' role only.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard only
$currentUser = requirePageRole('guard');

$pageTitle = 'Currently Inside Premises';
$pageCss = [
    '/public/css/pages/guard/currently_inside.css'
];
$pageScripts = [
    '/public/js/pages/guard/currently_inside.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="inside-wrapper">

        <!-- Header Section -->
        <section class="inside-header-section">
            <div style="display: flex; flex-direction: column; gap: var(--space-1);">
                <div style="display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--color-on-surface-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                    <span>Perimeter Gate Operations</span>
                    <span>•</span>
                    <span>Live Premises Occupancy</span>
                </div>
                <h1 class="text-2xl font-bold text-primary" style="letter-spacing: -0.02em;">
                    Currently Inside
                </h1>
                <p class="text-sm text-secondary" style="max-width: 600px;">
                    Real-time occupancy registry of non-resident guests, ride-hailing cabs, couriers, and contractors active within the estate perimeter.
                </p>
            </div>

            <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
                <button type="button" class="btn btn-outline" id="btn-export-snapshot">
                    <span class="material-symbols-outlined" style="font-size: 18px;">download</span>
                    <span>Export Snapshot</span>
                </button>
                <a href="/pages/guard/visitor_checkin.php" class="btn btn-primary">
                    <span class="material-symbols-outlined" style="font-size: 18px;">person_add</span>
                    <span>+ Authorize Entry</span>
                </a>
            </div>
        </section>

        <!-- KPI Stat Ribbon (4 Cards) -->
        <section class="kpi-grid">
            <div class="kpi-stat-card">
                <div class="kpi-top">
                    <span class="kpi-label">Active Occupancy</span>
                    <span class="material-symbols-outlined" style="font-size: 20px; color: var(--color-primary);">groups</span>
                </div>
                <div>
                    <div class="kpi-num accent" id="kpi-active-occupancy">--</div>
                    <div class="kpi-sub">Non-resident personnel on site</div>
                </div>
            </div>

            <div class="kpi-stat-card">
                <div class="kpi-top">
                    <span class="kpi-label">Guests & Families</span>
                    <span class="material-symbols-outlined" style="font-size: 20px;">person</span>
                </div>
                <div>
                    <div class="kpi-num" id="kpi-guests-count">--</div>
                    <div class="kpi-sub">Authorized by residents</div>
                </div>
            </div>

            <div class="kpi-stat-card">
                <div class="kpi-top">
                    <span class="kpi-label">Delivery & Cabs</span>
                    <span class="material-symbols-outlined" style="font-size: 20px;">local_shipping</span>
                </div>
                <div>
                    <div class="kpi-num" id="kpi-delivery-count">--</div>
                    <div class="kpi-sub">Transit passes active</div>
                </div>
            </div>

            <div class="kpi-stat-card">
                <div class="kpi-top">
                    <span class="kpi-label">Contractors & Techs</span>
                    <span class="material-symbols-outlined" style="font-size: 20px;">engineering</span>
                </div>
                <div>
                    <div class="kpi-num" id="kpi-contractors-count">--</div>
                    <div class="kpi-sub">Maintenance clearances</div>
                </div>
            </div>
        </section>

        <!-- Filter Toolbar -->
        <section class="filter-card">
            <div class="search-field-wrap">
                <span class="material-symbols-outlined search-field-icon">search</span>
                <input
                    type="search"
                    id="inside-search-input"
                    class="search-field-input"
                    placeholder="Search active visitor, pass #, flat, vehicle..."
                >
            </div>

            <select id="inside-category-select" class="form-select" style="max-width: 240px;">
                <option value="all">All Active Categories</option>
                <option value="guest">Guests & Families</option>
                <option value="cab">Cabs / Taxis</option>
                <option value="delivery">Delivery & Couriers</option>
                <option value="contractor">Contractors & Services</option>
            </select>
        </section>

        <!-- Table Container -->
        <div class="table-card">
            <div class="table-container" style="border: none; border-radius: 0;">
                <table class="dion-table">
                    <thead>
                        <tr>
                            <th style="padding-left: var(--space-5);">Pass ID & Visitor</th>
                            <th>Category</th>
                            <th>Host / Unit</th>
                            <th>Vehicle</th>
                            <th>Entry Time</th>
                            <th>Duration Inside</th>
                            <th style="padding-right: var(--space-5); text-align: right;">Gate Action</th>
                        </tr>
                    </thead>
                    <tbody id="inside-table-tbody">
                        <tr>
                            <td colspan="7" class="text-center py-6 text-secondary">
                                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                                    <span class="material-symbols-outlined spin" style="font-size: 20px;">progress_activity</span>
                                    <span>Syncing active occupancy...</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</main>

<!-- Fast Exit Modal -->
<div class="modal-backdrop" id="inside-checkout-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-dialog">
        <div class="modal-header">
            <div>
                <h3 class="modal-title" id="modal-title">Confirm Visitor Exit & Pass Return</h3>
                <p class="text-xs text-secondary" style="margin-top: 2px;">
                    Recording checkout for <strong id="modal-visitor-name">—</strong> (<span id="modal-pass-badge">—</span>)
                </p>
            </div>
            <button type="button" class="modal-close-btn" data-close-modal aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="modal-details">
                <div style="display: flex; justify-content: space-between;">
                    <span class="text-secondary">Host Unit:</span>
                    <span class="font-bold text-on-surface" id="modal-host-unit">—</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span class="text-secondary">Vehicle:</span>
                    <span class="font-mono text-on-surface font-semibold" id="modal-vehicle">—</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span class="text-secondary">Entry Time:</span>
                    <span class="font-mono text-on-surface" id="modal-entry-time">—</span>
                </div>
            </div>
            <p class="text-xs text-secondary">
                Surrendered pass card has been verified and digital turnstile token will be revoked.
            </p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" data-close-modal>Cancel</button>
            <button type="button" class="btn btn-primary" id="btn-confirm-checkout">
                <span class="material-symbols-outlined" style="font-size: 18px;">check</span>
                <span>Confirm Exit & Surrender Badge</span>
            </button>
        </div>
    </div>
</div>

<div id="toast-container" class="toast-container"></div>

<?php
require_once __DIR__ . '/../../includes/footer.php';