<?php
/**
 * Dion Security — Admin Houses & Apartments Overview
 * Parity replacement for frontend/src/pages/admin/HousesPage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = 'Houses & Apartments Registry';
$pageCss = ['/public/css/pages/admin/houses.css'];
$pageScripts = ['/public/js/pages/admin/houses.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="admin-page-container">
        
        <header class="page-header-block">
            <div class="header-titles">
                <span class="eyebrow-text">Estate Infrastructure • Unit Ledger</span>
                <h1 class="page-heading">Houses & Apartments</h1>
                <p class="page-description">
                    Master registry of apartment units, penthouses, assigned parking slots, and resident occupancy assignments.
                </p>
            </div>
            <div class="header-actions">
                <button type="button" class="btn btn-secondary" id="btn-refresh-houses">
                    <span class="material-symbols-outlined">refresh</span>
                    <span>Refresh</span>
                </button>
            </div>
        </header>

        <!-- KPI Ribbon -->
        <section class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-blue">
                    <span class="material-symbols-outlined">apartment</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Total Units</span>
                    <span class="kpi-value" id="kpi-total-houses">--</span>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-green">
                    <span class="material-symbols-outlined">person_pin</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Occupied</span>
                    <span class="kpi-value" id="kpi-occupied-houses">--</span>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-amber">
                    <span class="material-symbols-outlined">meeting_room</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Vacant</span>
                    <span class="kpi-value" id="kpi-vacant-houses">--</span>
                </div>
            </div>
        </section>

        <!-- Toolbar -->
        <div class="toolbar-card">
            <div class="search-input-group">
                <span class="material-symbols-outlined search-icon">search</span>
                <input type="text" id="filter-search" class="form-control" placeholder="Search by unit number, resident, parking bay..." autocomplete="off">
            </div>
            <div class="filter-dropdowns">
                <select id="filter-status" class="form-select">
                    <option value="all">All Statuses</option>
                    <option value="occupied">Occupied</option>
                    <option value="vacant">Vacant</option>
                </select>
            </div>
        </div>

        <!-- Table Card -->
        <div class="table-card">
            <div class="table-header">
                <h2 class="table-title">Units Registry</h2>
                <span class="badge badge-neutral" id="houses-count-badge">0 Units</span>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Unit No.</th>
                            <th>Block</th>
                            <th>Floor</th>
                            <th>Apartment Type</th>
                            <th>Resident</th>
                            <th>Parking Bay</th>
                            <th>Intercom</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="houses-tbody">
                        <tr><td colspan="8" class="loading-cell">Loading units ledger...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</main>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>