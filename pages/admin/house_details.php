<?php
/**
 * Dion Security — Admin House Details
 * Parity replacement for frontend/src/pages/admin/HouseDetailsPage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = 'Apartment Unit Dossier';
$pageCss = ['/public/css/pages/admin/house_details.css'];
$pageScripts = ['/public/js/pages/admin/house_details.js'];

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
                    <a href="/pages/admin/houses.php" class="crumb-link">Houses</a>
                    <span class="crumb-dot">•</span>
                    <span id="breadcrumb-unit-name">Unit Details</span>
                </div>
                <h1 class="page-heading" id="house-detail-title">Apartment Unit Dossier</h1>
                <p class="page-description">
                    Resident identity profile, registered household family members, vehicle tags, and visitor logs.
                </p>
            </div>
            <div class="header-actions">
                <a href="/pages/admin/houses.php" class="btn btn-secondary">
                    <span class="material-symbols-outlined">arrow_back</span>
                    <span>Back to Houses</span>
                </a>
            </div>
        </header>

        <!-- Unit Hero Card -->
        <div class="house-hero-card" id="house-hero">
            <div class="loading-state-box">
                <span class="material-symbols-outlined spinner">progress_activity</span>
                <span>Loading unit details...</span>
            </div>
        </div>

        <!-- Household Members Card -->
        <div class="table-card">
            <div class="table-header">
                <h2 class="table-title">Household Members & Co-habitants</h2>
                <span class="badge badge-neutral" id="family-count-badge">0 Members</span>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Member Name</th>
                            <th>Relationship</th>
                            <th>Contact Phone</th>
                            <th>Turnstile RFID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="house-family-tbody">
                        <tr><td colspan="5" class="loading-cell">Loading family members...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</main>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>