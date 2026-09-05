<?php
/**
 * Dion Security — Admin visitors
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'visitors'));
$pageCss = ['/public/css/pages/admin/visitors.css'];
$pageScripts = ['/public/js/pages/admin/visitors.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Visitor Registry</h1>
                <p class="text-muted">Comprehensive history and live status of all estate visitors and guests.</p>
            </div>
            <div>
                <a href="/pages/admin/expected_visitors.php" class="btn btn-outline-primary me-2">
                    <span class="material-icons-outlined">event_available</span> Expected Pre-Registrations
                </a>
                <a href="/pages/admin/regular_visitors.php" class="btn btn-outline-secondary">
                    <span class="material-icons-outlined">verified_user</span> Regular Passes
                </a>
            </div>
        </div>

        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon bg-primary-subtle text-primary">
                    <span class="material-icons-outlined">groups</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Total Visitors Logged</div>
                    <div class="stat-value" id="statTotalVisitors">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-success-subtle text-success">
                    <span class="material-icons-outlined">login</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Currently Inside</div>
                    <div class="stat-value" id="statCurrentlyInside">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-warning-subtle text-warning">
                    <span class="material-icons-outlined">pending_actions</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Expected Pre-Approved</div>
                    <div class="stat-value" id="statExpected">-</div>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search visitor name, phone, host resident, house...">
                    </div>
                    <div class="filter-group">
                        <select id="statusFilter" class="form-select">
                            <option value="">All Statuses</option>
                            <option value="inside">Currently Inside</option>
                            <option value="checked_out">Checked Out</option>
                            <option value="expected">Expected</option>
                        </select>
                        <select id="purposeFilter" class="form-select">
                            <option value="">All Purposes</option>
                            <option value="Personal">Personal / Guest</option>
                            <option value="Delivery">Delivery / Courier</option>
                            <option value="Maintenance">Maintenance / Service</option>
                            <option value="Official">Official / Inspector</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="visitorsTable">
                        <thead>
                            <tr>
                                <th>Visitor</th>
                                <th>Phone</th>
                                <th>Visiting (Host / Unit)</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Check-In Time</th>
                                <th>Check-Out Time</th>
                                <th class="text-end">Details</th>
                            </tr>
                        </thead>
                        <tbody id="visitorsTableBody">
                            <tr>
                                <td colspan="8" class="text-center py-4 text-muted">Loading visitor records...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>