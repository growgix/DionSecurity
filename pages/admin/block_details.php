<?php
/**
 * Dion Security — Admin Block Details
 * Parity replacement for frontend/src/pages/admin/BlockDetailsPage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = 'Block Sector Details';
$pageCss = ['/public/css/pages/admin/block_details.css'];
$pageScripts = ['/public/js/pages/admin/block_details.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="admin-page-container">
        
        <header class="page-header-block">
            <div class="header-titles">
                <div class="header-breadcrumbs">
                    <a href="/pages/admin/blocks.php" class="crumb-link">Blocks</a>
                    <span class="crumb-dot">•</span>
                    <span id="breadcrumb-block-name">Loading Block...</span>
                </div>
                <h1 class="page-heading" id="block-detail-title">Block Overview</h1>
                <p class="page-description" id="block-detail-sub">
                    Sector profile, architectural allocation, unit breakdown, and resident occupancy muster.
                </p>
            </div>
            <div class="header-actions">
                <a href="/pages/admin/blocks.php" class="btn btn-secondary">
                    <span class="material-symbols-outlined">arrow_back</span>
                    <span>Back to Blocks</span>
                </a>
            </div>
        </header>

        <!-- Block Hero Card -->
        <div class="block-hero-card" id="block-hero">
            <div class="loading-state-box">
                <span class="material-symbols-outlined spinner">progress_activity</span>
                <span>Loading block details...</span>
            </div>
        </div>

        <!-- Associated Units Table Card -->
        <div class="table-card">
            <div class="table-header">
                <h2 class="table-title">Apartment Units in this Block</h2>
                <span class="badge badge-neutral" id="block-units-badge">0 Units</span>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Unit No.</th>
                            <th>Floor</th>
                            <th>Apartment Type</th>
                            <th>Resident</th>
                            <th>Parking Bay</th>
                            <th>Intercom</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="block-houses-tbody">
                        <tr><td colspan="7" class="loading-cell">Loading units...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</main>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>