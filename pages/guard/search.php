<?php
/**
 * Dion Security — Guard Fast Person & Vehicle Search
 * Functional parity replacement for SearchPersonPage.jsx.
 * Authoritative Server-side Role Check: 'guard' role only.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard only
$currentUser = requirePageRole('guard');

$pageTitle = 'Search Person & Vehicle';
$pageCss = [
    '/public/css/pages/guard/search.css'
];
$pageScripts = [
    '/public/js/pages/guard/search.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="search-wrapper">

        <!-- Page Header -->
        <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <span class="text-xs uppercase font-semibold text-secondary" style="letter-spacing: 0.08em;">
                Guard Security Terminal • Fast Lookup
            </span>
            <h1 class="text-2xl font-bold text-primary" style="letter-spacing: -0.02em;">
                Search Person & Vehicle
            </h1>
            <p class="text-sm text-secondary">
                Live real-time search across residents, registered staff, active visitors, and authorized vehicle plates.
            </p>
        </div>

        <!-- Big Search Input Card & Filter Pills -->
        <section class="search-input-card">
            <div class="search-input-wrap">
                <span class="material-symbols-outlined search-icon">search</span>
                <input
                    type="search"
                    id="search-person-input"
                    class="search-big-input"
                    placeholder="Type person name, unit (e.g. A-203), badge #, or vehicle plate..."
                    autofocus
                >
            </div>

            <div class="filter-pills-row">
                <button type="button" class="filter-pill-btn active" data-filter="all">
                    All Results <span id="pill-count-all">(...)</span>
                </button>
                <button type="button" class="filter-pill-btn" data-filter="residents">
                    Residents <span id="pill-count-residents">(...)</span>
                </button>
                <button type="button" class="filter-pill-btn" data-filter="staff">
                    Staff & Workforce <span id="pill-count-staff">(...)</span>
                </button>
                <button type="button" class="filter-pill-btn" data-filter="visitors">
                    Visitors <span id="pill-count-visitors">(...)</span>
                </button>
            </div>
        </section>

        <!-- Search Results Sections -->
        <div style="display: flex; flex-direction: column; gap: var(--space-5);">

            <!-- Matched Residents -->
            <section class="results-section" id="residents-results-container" style="display: none;">
                <h3 class="results-heading">
                    <span class="material-symbols-outlined" style="font-size: 20px;">apartment</span>
                    <span>Matched Residents <span id="residents-match-count">(0)</span></span>
                </h3>
                <div class="results-grid" id="residents-results-grid"></div>
            </section>

            <!-- Matched Staff -->
            <section class="results-section" id="staff-results-container" style="display: none;">
                <h3 class="results-heading">
                    <span class="material-symbols-outlined" style="font-size: 20px;">badge</span>
                    <span>Matched Workforce Personnel <span id="staff-match-count">(0)</span></span>
                </h3>
                <div class="results-grid" id="staff-results-grid"></div>
            </section>

            <!-- Matched Visitors -->
            <section class="results-section" id="visitors-results-container" style="display: none;">
                <h3 class="results-heading">
                    <span class="material-symbols-outlined" style="font-size: 20px;">groups</span>
                    <span>Matched Visitor Passes <span id="visitors-match-count">(0)</span></span>
                </h3>
                <div class="results-grid" id="visitors-results-grid"></div>
            </section>

            <!-- Empty State -->
            <div class="results-section empty-results-box" id="search-empty-box">
                <span class="material-symbols-outlined" style="font-size: 36px; color: var(--color-outline);">person_search</span>
                <span style="font-size: var(--text-base); font-weight: 600; color: var(--color-on-surface);">No Matching Persons or Vehicles</span>
                <span style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">Try typing a resident flat, visitor badge ID, or partial name.</span>
            </div>

        </div>

    </div>
</main>

<div id="toast-container" class="toast-container"></div>

<?php
require_once __DIR__ . '/../../includes/footer.php';