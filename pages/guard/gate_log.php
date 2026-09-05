<?php
/**
 * Dion Security — Gate Access Log
 * Functional parity replacement for GateLogPage.jsx.
 * Authoritative Server-side Role Check: 'guard' role only.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard only
$currentUser = requirePageRole('guard');

$pageTitle = "Today's Gate Log — Access Audit";
$pageCss = [
    '/public/css/pages/guard/gate_log.css'
];
$pageScripts = [
    '/public/js/pages/guard/gate_log.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="gatelog-wrapper">

        <!-- Header Section -->
        <section class="gatelog-header">
            <div style="display: flex; flex-direction: column; gap: var(--space-1);">
                <div style="display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--color-on-surface-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                    <span>Perimeter Operations</span>
                    <span>•</span>
                    <span>Gate Audit Ledger</span>
                </div>
                <h1 class="text-2xl font-bold text-primary" style="letter-spacing: -0.02em;">
                    Today's Gate Log
                </h1>
                <p class="text-sm text-secondary" style="max-width: 600px;">
                    Chronological audit stream of pedestrian turnstile clearances, vehicle boom barrier trips, and officer authorizations.
                </p>
            </div>

            <button type="button" class="btn btn-outline" id="btn-export-log">
                <span class="material-symbols-outlined" style="font-size: 18px;">download</span>
                <span>Export Gate Audit</span>
            </button>
        </section>

        <!-- KPI Stat Ribbon (4 Cards) -->
        <section class="kpi-grid">
            <div class="kpi-stat-card">
                <div class="kpi-top">
                    <span class="kpi-label">Total Gate Throughput</span>
                    <span class="material-symbols-outlined" style="font-size: 20px; color: var(--color-primary);">swap_vert</span>
                </div>
                <div>
                    <div class="kpi-num accent" id="kpi-total-trips">--</div>
                    <div class="kpi-sub">Trips across all estate gates</div>
                </div>
            </div>

            <div class="kpi-stat-card">
                <div class="kpi-top">
                    <span class="kpi-label">Entry Clearances</span>
                    <span class="material-symbols-outlined" style="font-size: 20px; color: var(--color-success);">login</span>
                </div>
                <div>
                    <div class="kpi-num" id="kpi-entries-count">--</div>
                    <div class="kpi-sub">Inbound vehicle & pedestrian passes</div>
                </div>
            </div>

            <div class="kpi-stat-card">
                <div class="kpi-top">
                    <span class="kpi-label">Exit Clearances</span>
                    <span class="material-symbols-outlined" style="font-size: 20px; color: var(--color-danger);">logout</span>
                </div>
                <div>
                    <div class="kpi-num" id="kpi-exits-count">--</div>
                    <div class="kpi-sub">Outbound verified departures</div>
                </div>
            </div>

            <div class="kpi-stat-card">
                <div class="kpi-top">
                    <span class="kpi-label">Peak Traffic Window</span>
                    <span class="material-symbols-outlined" style="font-size: 20px;">timeline</span>
                </div>
                <div>
                    <div class="kpi-num" style="font-size: 1.25rem; font-family: var(--font-mono); margin-top: 8px;">08:00 - 09:30 AM</div>
                    <div class="kpi-sub">Morning domestic & delivery peak</div>
                </div>
            </div>
        </section>

        <!-- Filter Toolbar -->
        <section class="filter-card">
            <div class="search-field-wrap">
                <span class="material-symbols-outlined search-field-icon">search</span>
                <input
                    type="search"
                    id="log-search-input"
                    class="search-field-input"
                    placeholder="Search by person name, unit, vehicle, officer..."
                >
            </div>

            <div class="filter-selects-wrap">
                <select id="log-type-select" class="form-select" style="min-width: 160px;">
                    <option value="all">All Trips (Entry & Exit)</option>
                    <option value="ENTRY">Inbound (ENTRY Only)</option>
                    <option value="EXIT">Outbound (EXIT Only)</option>
                </select>

                <select id="log-gate-select" class="form-select" style="min-width: 170px;">
                    <option value="all">All Gates (1 - 4)</option>
                    <option value="Gate 01">Gate 01 (Main North)</option>
                    <option value="Gate 02">Gate 02 (East Service)</option>
                    <option value="Gate 03">Gate 03 (West Exit)</option>
                    <option value="Gate 04">Gate 04 (Clubhouse)</option>
                </select>
            </div>
        </section>

        <!-- Table Container -->
        <div class="table-card">
            <div class="table-container" style="border: none; border-radius: 0;">
                <table class="dion-table">
                    <thead>
                        <tr>
                            <th style="padding-left: var(--space-5);">Time</th>
                            <th>Trip Type</th>
                            <th>Person / Category</th>
                            <th>Destination</th>
                            <th>Vehicle</th>
                            <th>Gate Station</th>
                            <th>Duty Officer</th>
                            <th style="padding-right: var(--space-5); text-align: right;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="log-table-tbody">
                        <tr>
                            <td colspan="8" class="text-center py-6 text-secondary">
                                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                                    <span class="material-symbols-outlined spin" style="font-size: 20px;">progress_activity</span>
                                    <span>Syncing gate audit ledger...</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</main>

<div id="toast-container" class="toast-container"></div>

<?php
require_once __DIR__ . '/../../includes/footer.php';