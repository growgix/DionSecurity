<?php
/**
 * Dion Security — Admin employee_history
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'employee_history'));
$pageCss = ['/public/css/pages/admin/employee_history.css'];
$pageScripts = ['/public/js/pages/admin/employee_history.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Personnel Deployment History</h1>
                <p class="text-muted">Longitudinal record of guard deployments, post rotations, and service tenures.</p>
            </div>
            <div>
                <a href="/pages/admin/workforce.php" class="btn btn-outline-secondary">
                    <span class="material-icons-outlined">arrow_back</span> Current Roster
                </a>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search history by officer name or employee ID...">
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="historyTable">
                        <thead>
                            <tr>
                                <th>Emp ID</th>
                                <th>Officer Name</th>
                                <th>Assigned Post</th>
                                <th>Service Start</th>
                                <th>Record Status</th>
                                <th class="text-end">Details</th>
                            </tr>
                        </thead>
                        <tbody id="historyTableBody">
                            <tr><td colspan="6" class="text-center py-4 text-muted">Loading deployment records...</td></tr>
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