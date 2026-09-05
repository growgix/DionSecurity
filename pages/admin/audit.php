<?php
/**
 * Dion Security — Admin audit
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'audit'));
$pageCss = ['/public/css/pages/admin/audit.css'];
$pageScripts = ['/public/js/pages/admin/audit.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Security & System Audit Trail</h1>
                <p class="text-muted">Immutable tamper-evident record of all system modifications and gate events.</p>
            </div>
            <div>
                <button class="btn btn-outline-secondary" id="refreshAuditBtn">
                    <span class="material-icons-outlined">refresh</span> Refresh Log
                </button>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search audit trail by actor, action, target entity, or IP...">
                    </div>
                    <div class="filter-group">
                        <select id="actionFilter" class="form-select">
                            <option value="">All Actions</option>
                            <option value="create">Created Records</option>
                            <option value="update">Updated Records</option>
                            <option value="delete">Deleted Records</option>
                            <option value="login">Authentication Events</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="auditTable">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Actor (User)</th>
                                <th>Role</th>
                                <th>Action Performed</th>
                                <th>Target Entity</th>
                                <th>IP Address</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody id="auditTableBody">
                            <tr><td colspan="7" class="text-center py-4 text-muted">Loading security audit records...</td></tr>
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