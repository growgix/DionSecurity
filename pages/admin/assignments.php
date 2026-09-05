<?php
/**
 * Dion Security — Admin assignments
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'assignments'));
$pageCss = ['/public/css/pages/admin/assignments.css'];
$pageScripts = ['/public/js/pages/admin/assignments.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Post & Gate Assignments</h1>
                <p class="text-muted">Station deployment, watch posts, and guard gate coverage assignments.</p>
            </div>
            <div>
                <a href="/pages/admin/workforce.php" class="btn btn-outline-secondary">
                    <span class="material-icons-outlined">people</span> Workforce Roster
                </a>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search post assignment, officer, or gate...">
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="assignmentTable">
                        <thead>
                            <tr>
                                <th>Assigned Officer</th>
                                <th>Rank</th>
                                <th>Operational Post</th>
                                <th>Shift Schedule</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="assignmentTableBody">
                            <tr><td colspan="6" class="text-center py-4 text-muted">Loading post assignments...</td></tr>
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