<?php
/**
 * Dion Security — Admin shifts
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'shifts'));
$pageCss = ['/public/css/pages/admin/shifts.css'];
$pageScripts = ['/public/js/pages/admin/shifts.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Shift Management</h1>
                <p class="text-muted">Configure operational watch shifts, schedules, and personnel rotations.</p>
            </div>
            <div>
                <a href="/pages/admin/assignments.php" class="btn btn-outline-primary">
                    <span class="material-icons-outlined">assignment_ind</span> Post Assignments
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card h-100 border-start border-primary border-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">Morning Shift</h5>
                            <span class="badge bg-primary-subtle text-primary">Day Watch</span>
                        </div>
                        <p class="text-muted small mb-3">Main gate visitor traffic & estate deliveries.</p>
                        <div class="fw-bold mb-1">06:00 AM – 02:00 PM</div>
                        <div class="text-secondary small mb-3">8.0 hrs standard duration</div>
                        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                            <span class="text-muted small">Assigned Guards</span>
                            <span class="badge bg-light text-dark fw-bold" id="shiftCountMorning">-</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-4">
                <div class="card h-100 border-start border-warning border-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">Evening Shift</h5>
                            <span class="badge bg-warning-subtle text-warning">Evening Watch</span>
                        </div>
                        <p class="text-muted small mb-3">Resident return hours & perimeter patrolling.</p>
                        <div class="fw-bold mb-1">02:00 PM – 10:00 PM</div>
                        <div class="text-secondary small mb-3">8.0 hrs standard duration</div>
                        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                            <span class="text-muted small">Assigned Guards</span>
                            <span class="badge bg-light text-dark fw-bold" id="shiftCountEvening">-</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-4">
                <div class="card h-100 border-start border-dark border-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">Night Shift</h5>
                            <span class="badge bg-dark-subtle text-dark">Night Watch</span>
                        </div>
                        <p class="text-muted small mb-3">High security lockdown, perimeter checks & gate logs.</p>
                        <div class="fw-bold mb-1">10:00 PM – 06:00 AM</div>
                        <div class="text-secondary small mb-3">8.0 hrs standard duration</div>
                        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                            <span class="text-muted small">Assigned Guards</span>
                            <span class="badge bg-light text-dark fw-bold" id="shiftCountNight">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Workforce Shift Allocation Roster</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="shiftTable">
                        <thead>
                            <tr>
                                <th>Personnel</th>
                                <th>Role</th>
                                <th>Current Shift</th>
                                <th>Assigned Post</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="shiftTableBody">
                            <tr><td colspan="6" class="text-center py-4 text-muted">Loading shift allocation...</td></tr>
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