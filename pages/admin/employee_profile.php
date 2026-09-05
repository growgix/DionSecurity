<?php
/**
 * Dion Security — Admin employee_profile
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'employee_profile'));
$pageCss = ['/public/css/pages/admin/employee_profile.css'];
$pageScripts = ['/public/js/pages/admin/employee_profile.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="mb-3">
            <a href="/pages/admin/workforce.php" class="btn btn-outline-secondary btn-sm">
                <span class="material-icons-outlined" style="font-size:16px;">arrow_back</span> Back to Workforce Roster
            </a>
        </div>

        <div class="content-header d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-3">
                <div class="avatar-circle">
                    <span class="material-icons-outlined" style="font-size:36px;color:#475569;">shield_person</span>
                </div>
                <div>
                    <h1 class="page-title mb-1" id="profileName">Employee Profile</h1>
                    <p class="text-muted mb-0" id="profileSubtext">Personnel Record</p>
                </div>
            </div>
            <div id="profileStatusBadge">
                <!-- Status badge injected -->
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Personal & Contact</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="text-muted small">Employee ID</label>
                            <div class="fw-bold fs-6"><code id="pId">-</code></div>
                        </div>
                        <div class="mb-3">
                            <label class="text-muted small">Rank / Role</label>
                            <div class="fw-bold" id="pRole">-</div>
                        </div>
                        <div class="mb-3">
                            <label class="text-muted small">Phone</label>
                            <div class="fw-bold" id="pPhone">-</div>
                        </div>
                        <div class="mb-3">
                            <label class="text-muted small">Email Address</label>
                            <div class="fw-bold" id="pEmail">-</div>
                        </div>
                        <div class="mb-3">
                            <label class="text-muted small">Assigned Shift</label>
                            <div class="fw-bold" id="pShift">-</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-8 mb-4">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Assigned Operational Tasks</h5>
                        <a href="/pages/admin/tasks.php" class="btn btn-sm btn-outline-primary">View All Tasks</a>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table" id="empTasksTable">
                                <thead>
                                    <tr>
                                        <th>Task Title</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody id="empTasksBody">
                                    <tr><td colspan="4" class="text-center py-3 text-muted">Loading assigned tasks...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Deployment & Attendance Summary</h5>
                        <a href="/pages/admin/attendance_history.php" class="btn btn-sm btn-outline-secondary">Full Log</a>
                    </div>
                    <div class="card-body">
                        <p class="text-muted mb-0">Current deployment verified at operational checkpoint. Personnel logs active and compliant with security protocols.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>