<?php
/**
 * Dion Security — Admin workforce
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'workforce'));
$pageCss = ['/public/css/pages/admin/workforce.css'];
$pageScripts = ['/public/js/pages/admin/workforce.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Security Workforce</h1>
                <p class="text-muted">Manage security personnel roster, deployment status, and profiles.</p>
            </div>
            <div>
                <button class="btn btn-primary" id="addEmployeeBtn">
                    <span class="material-icons-outlined">person_add</span> Register Personnel
                </button>
            </div>
        </div>

        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon bg-primary-subtle text-primary">
                    <span class="material-icons-outlined">badge</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Total Roster</div>
                    <div class="stat-value" id="statTotalEmployees">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-success-subtle text-success">
                    <span class="material-icons-outlined">verified</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Active / Present</div>
                    <div class="stat-value" id="statActiveEmployees">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-warning-subtle text-warning">
                    <span class="material-icons-outlined">event_busy</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">On Leave / Off Duty</div>
                    <div class="stat-value" id="statLeaveEmployees">-</div>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search by name, employee ID, role, or phone...">
                    </div>
                    <div class="filter-group">
                        <select id="roleFilter" class="form-select">
                            <option value="">All Roles</option>
                            <option value="Guard">Guard</option>
                            <option value="Senior Guard">Senior Guard</option>
                            <option value="Supervisor">Supervisor</option>
                        </select>
                        <select id="statusFilter" class="form-select">
                            <option value="">All Statuses</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="leave">On Leave</option>
                            <option value="late">Late</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="workforceTable">
                        <thead>
                            <tr>
                                <th>Emp ID</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Assigned Gate / Area</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="workforceTableBody">
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">Loading workforce roster...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Modal -->
<div class="modal fade" id="employeeModal" tabindex="-1" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="empModalTitle">Register Personnel</h5>
                <button type="button" class="btn-close" id="closeEmpModalBtn">&times;</button>
            </div>
            <form id="empForm">
                <input type="hidden" id="empId" value="">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label" for="eName">Full Name *</label>
                        <input type="text" id="eName" class="form-control" required placeholder="e.g. Marcus Vance">
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="eRole">Role / Rank *</label>
                            <select id="eRole" class="form-select" required>
                                <option value="Guard">Security Guard</option>
                                <option value="Senior Guard">Senior Guard</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Patrol Officer">Patrol Officer</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="eStatus">Current Status *</label>
                            <select id="eStatus" class="form-select" required>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="leave">On Leave</option>
                                <option value="late">Late</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="ePhone">Contact Phone *</label>
                            <input type="text" id="ePhone" class="form-control" required placeholder="+1 555-0133">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="eEmail">Email</label>
                            <input type="email" id="eEmail" class="form-control" placeholder="marcus@dionsecurity.com">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="eShift">Primary Shift</label>
                        <select id="eShift" class="form-select">
                            <option value="Morning">Morning Shift (06:00 - 14:00)</option>
                            <option value="Evening">Evening Shift (14:00 - 22:00)</option>
                            <option value="Night">Night Shift (22:00 - 06:00)</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelEmpModalBtn">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Personnel</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal-backdrop fade" id="modalBackdrop" style="display:none;"></div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>