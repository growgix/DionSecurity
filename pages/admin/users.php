<?php
/**
 * Dion Security — Admin users
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'users'));
$pageCss = ['/public/css/pages/admin/users.css'];
$pageScripts = ['/public/js/pages/admin/users.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">User Accounts & Access</h1>
                <p class="text-muted">Manage system authentication credentials, administrative roles, and user state.</p>
            </div>
            <div>
                <button class="btn btn-primary" id="addUserBtn">
                    <span class="material-icons-outlined">person_add</span> Create User Account
                </button>
            </div>
        </div>

        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon bg-primary-subtle text-primary">
                    <span class="material-icons-outlined">manage_accounts</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Total Accounts</div>
                    <div class="stat-value" id="statTotalUsers">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-success-subtle text-success">
                    <span class="material-icons-outlined">admin_panel_settings</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Administrators</div>
                    <div class="stat-value" id="statAdminUsers">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-info-subtle text-info">
                    <span class="material-icons-outlined">shield</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Field Staff (Sup/Guard)</div>
                    <div class="stat-value" id="statStaffUsers">-</div>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search accounts by username, name, email, role...">
                    </div>
                    <div class="filter-group">
                        <select id="roleFilter" class="form-select">
                            <option value="">All Roles</option>
                            <option value="admin">Administrator</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="guard">Guard</option>
                        </select>
                        <select id="statusFilter" class="form-select">
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="usersTable">
                        <thead>
                            <tr>
                                <th>Account</th>
                                <th>Role</th>
                                <th>Contact Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <tr><td colspan="7" class="text-center py-4 text-muted">Loading user accounts...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Modal -->
<div class="modal fade" id="userModal" tabindex="-1" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="userModalTitle">Create User Account</h5>
                <button type="button" class="btn-close" id="closeUserModalBtn">&times;</button>
            </div>
            <form id="userForm">
                <input type="hidden" id="userId" value="">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label" for="uName">Full Name *</label>
                        <input type="text" id="uName" class="form-control" required placeholder="e.g. Elena Ramos">
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="uUsername">Username *</label>
                            <input type="text" id="uUsername" class="form-control" required placeholder="e.g. elena_admin">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="uRole">Role *</label>
                            <select id="uRole" class="form-select" required>
                                <option value="guard">Guard</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="uEmail">Email Address</label>
                            <input type="email" id="uEmail" class="form-control" placeholder="elena@dionsecurity.com">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="uPhone">Phone Number</label>
                            <input type="text" id="uPhone" class="form-control" placeholder="+1 555-0144">
                        </div>
                    </div>
                    <div class="mb-3" id="passwordGroup">
                        <label class="form-label" for="uPassword">Password *</label>
                        <input type="password" id="uPassword" class="form-control" placeholder="Enter secure password">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelUserModalBtn">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Account</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal-backdrop fade" id="modalBackdrop" style="display:none;"></div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>