<?php
/**
 * Dion Security — Admin expected_visitors
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'expected_visitors'));
$pageCss = ['/public/css/pages/admin/expected_visitors.css'];
$pageScripts = ['/public/js/pages/admin/expected_visitors.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Expected Pre-Approved Visitors</h1>
                <p class="text-muted">Pre-cleared guest passes and scheduled deliveries submitted by residents.</p>
            </div>
            <div>
                <a href="/pages/admin/visitors.php" class="btn btn-outline-secondary">
                    <span class="material-icons-outlined">arrow_back</span> All Visitor Logs
                </a>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search expected guests, invite codes, host unit...">
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="expectedTable">
                        <thead>
                            <tr>
                                <th>Expected Guest</th>
                                <th>Pass / Invite Code</th>
                                <th>Host Resident</th>
                                <th>Unit #</th>
                                <th>Expected Date / Time</th>
                                <th>Purpose</th>
                                <th class="text-end">Status</th>
                            </tr>
                        </thead>
                        <tbody id="expectedTableBody">
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">Loading expected visitor schedule...</td>
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