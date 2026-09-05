<?php
/**
 * Dion Security — Admin task_history
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'task_history'));
$pageCss = ['/public/css/pages/admin/task_history.css'];
$pageScripts = ['/public/js/pages/admin/task_history.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Task Directive History</h1>
                <p class="text-muted">Archived tasks, closed directives, and workforce resolution metrics.</p>
            </div>
            <div>
                <a href="/pages/admin/tasks.php" class="btn btn-outline-secondary">
                    <span class="material-icons-outlined">arrow_back</span> Active Directives
                </a>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search archived tasks by title, officer, or resolution...">
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="taskHistoryTable">
                        <thead>
                            <tr>
                                <th>Directive</th>
                                <th>Assigned Officer</th>
                                <th>Priority</th>
                                <th>Resolution Status</th>
                                <th>Created</th>
                                <th>Due Date</th>
                                <th class="text-end">Details</th>
                            </tr>
                        </thead>
                        <tbody id="taskHistoryBody">
                            <tr><td colspan="7" class="text-center py-4 text-muted">Loading archived directives...</td></tr>
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