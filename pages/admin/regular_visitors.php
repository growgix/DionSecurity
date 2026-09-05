<?php
/**
 * Dion Security — Admin regular_visitors
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'regular_visitors'));
$pageCss = ['/public/css/pages/admin/regular_visitors.css'];
$pageScripts = ['/public/js/pages/admin/regular_visitors.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Regular & Frequent Visitors</h1>
                <p class="text-muted">Manage recurring visitors, frequent delivery drivers, contractors, and household staff.</p>
            </div>
            <div>
                <a href="/pages/admin/visitors.php" class="btn btn-outline-secondary">
                    <span class="material-icons-outlined">arrow_back</span> Back to Visitor Logs
                </a>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search regular visitor by name, phone, purpose...">
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="regularTable">
                        <thead>
                            <tr>
                                <th>Visitor Name</th>
                                <th>Phone</th>
                                <th>Frequent Purpose</th>
                                <th>Associated Host / Unit</th>
                                <th>Total Visits</th>
                                <th>Last Visit</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="regularTableBody">
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">Analyzing frequent visitors...</td>
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