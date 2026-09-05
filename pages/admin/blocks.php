<?php
/**
 * Dion Security — Admin Blocks & Sectors Overview
 * Parity replacement for frontend/src/pages/admin/BlocksPage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = 'Residential Blocks & Sectors';
$pageCss = ['/public/css/pages/admin/blocks.css'];
$pageScripts = ['/public/js/pages/admin/blocks.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="admin-page-container">
        
        <!-- Header -->
        <header class="page-header-block">
            <div class="header-titles">
                <span class="eyebrow-text">Estate Infrastructure • Residential Sectors</span>
                <h1 class="page-heading">Blocks & Residential Sectors</h1>
                <p class="page-description">
                    Architectural master registry of residential towers, designated wings, capacity allocations, and sector oversight.
                </p>
            </div>
            <div class="header-actions">
                <button type="button" class="btn btn-secondary" id="btn-refresh-blocks">
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
                    <span class="kpi-label">Total Blocks</span>
                    <span class="kpi-value" id="kpi-total-blocks">--</span>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-purple">
                    <span class="material-symbols-outlined">home</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Total Units</span>
                    <span class="kpi-value" id="kpi-total-units">--</span>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-green">
                    <span class="material-symbols-outlined">how_to_reg</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Occupied Units</span>
                    <span class="kpi-value" id="kpi-occupied-units">--</span>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon-wrap icon-amber">
                    <span class="material-symbols-outlined">pie_chart</span>
                </div>
                <div class="kpi-info">
                    <span class="kpi-label">Avg. Occupancy</span>
                    <span class="kpi-value" id="kpi-avg-occupancy">--%</span>
                </div>
            </div>
        </section>

        <!-- Filter Toolbar -->
        <div class="toolbar-card">
            <div class="search-input-group">
                <span class="material-symbols-outlined search-icon">search</span>
                <input type="text" id="filter-search" class="form-control" placeholder="Search by block name, wings, or security officer..." autocomplete="off">
            </div>
        </div>

        <!-- Blocks Grid -->
        <div class="blocks-grid" id="blocks-container">
            <div class="loading-state-box">
                <span class="material-symbols-outlined spinner">progress_activity</span>
                <span>Loading residential blocks...</span>
            </div>
        </div>

    </div>
</main>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>