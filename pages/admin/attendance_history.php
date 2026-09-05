<?php
/**
 * Dion Security — Admin attendance_history
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'attendance_history'));
$pageCss = ['/public/css/pages/admin/attendance_history.css'];
$pageScripts = ['/public/js/pages/admin/attendance_history.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Guard Attendance Records</h1>
                <p class="text-muted">Clock-in verifications, shift attendances, and duty logs.</p>
            </div>
            <div>
                <a href="/pages/admin/workforce.php" class="btn btn-outline-secondary">
                    <span class="material-icons-outlined">arrow_back</span> Workforce
                </a>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search attendance by guard name or ID...">
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="attendanceTable">
                        <thead>
                            <tr>
                                <th>Officer Name</th>
                                <th>Emp ID</th>
                                <th>Shift</th>
                                <th>Status Today</th>
                                <th>Verification</th>
                            </tr>
                        </thead>
                        <tbody id="attendanceTableBody">
                            <tr><td colspan="5" class="text-center py-4 text-muted">Loading attendance logs...</td></tr>
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