<?php
/**
 * Dion Security — Guard Residents & Housing Directory
 * Functional parity replacement for ResidentsHousesPage.jsx.
 * Authoritative Server-side Role Check: 'guard' and 'admin'.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard and admin
$currentUser = requirePageRole('guard', 'admin');

$pageTitle = 'Residents & Housing Directory';
$pageCss = [
    '/public/css/pages/guard/residents_houses.css'
];
$pageScripts = [
    '/public/js/pages/guard/residents_houses.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="directory-wrapper">

        <!-- Top Operational Banner -->
        <section class="terminal-banner">
            <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
                <span class="terminal-badge">
                    <span class="terminal-pulse"></span>
                    SECURITY TERMINAL • INTERCOM DIRECTORY
                </span>
                <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-on-surface-muted);">
                    PBX VOIP RELAY: OPERATIONAL
                </span>
            </div>
            <a href="/pages/guard/dashboard.php" class="terminal-kbd">
                <kbd style="padding: 2px 6px; border-radius: 4px; background: var(--color-surface-lowest); box-shadow: var(--shadow-sm); font-weight: 700;">Esc</kbd>
                <span>Dashboard</span>
            </a>
        </section>

        <!-- Header -->
        <div class="page-header">
            <span class="subheading">Guard Security Terminal • Intercom Directory</span>
            <h1 class="heading">Residents & Housing Directory</h1>
            <p class="description">Instant resident verification, direct intercom audio link, and resident-authorized visitor onboarding.</p>
        </div>

        <!-- Filter Toolbar -->
        <div class="filter-toolbar">
            <div class="search-box">
                <span class="material-symbols-outlined search-icon">search</span>
                <input
                    type="search"
                    id="search-input"
                    placeholder="Search by flat #, resident name, phone, vehicle plate..."
                    class="search-input"
                />
            </div>

            <div class="filter-controls">
                <select id="block-select" class="block-select">
                    <option value="all">All Blocks (A - F)</option>
                    <option value="BLK-A">Block A</option>
                    <option value="BLK-B">Block B</option>
                    <option value="BLK-C">Block C</option>
                    <option value="BLK-D">Block D</option>
                    <option value="BLK-E">Block E</option>
                    <option value="BLK-F">Block F</option>
                </select>
            </div>
        </div>

        <!-- Directory Grid -->
        <div id="houses-grid" class="houses-grid">
            <div class="loading-state">
                <span class="material-symbols-outlined spin" style="font-size: 24px;">progress_activity</span>
                <span>Loading housing & resident directory...</span>
            </div>
        </div>

    </div>
</main>

<!-- Intercom Ringing Modal -->
<div id="intercom-modal" class="modal-overlay" style="display: none;">
    <div class="modal-card">
        <div class="modal-header">
            <div>
                <h3 id="modal-title" class="modal-title">Intercom Terminal: Unit --</h3>
                <p id="modal-subtitle" class="modal-subtitle">Connecting to handset...</p>
            </div>
            <button type="button" id="modal-close" class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body text-center">
            <div class="intercom-pulse-circle">
                <span class="material-symbols-outlined intercom-icon">phone_in_talk</span>
            </div>
            <h4 id="intercom-active-text" class="intercom-heading">Intercom Active: #--</h4>
            <p class="intercom-desc">Secure relay channel established with resident handset.</p>
            <div class="modal-actions">
                <button type="button" id="btn-end-intercom" class="btn-end-call">
                    <span class="material-symbols-outlined" style="font-size: 18px;">call_end</span>
                    <span>End Intercom Call</span>
                </button>
            </div>
        </div>
    </div>
</div>

<div id="toast-container" class="toast-container"></div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>