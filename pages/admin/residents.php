<?php
/**
 * Dion Security — Admin residents
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'residents'));
$pageCss = ['/public/css/pages/admin/residents.css'];
$pageScripts = ['/public/js/pages/admin/residents.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Residents Directory</h1>
                <p class="text-muted">Manage estate residents, unit occupancies, and contact profiles.</p>
            </div>
            <div>
                <button class="btn btn-primary" id="addResidentBtn">
                    <span class="material-icons-outlined">person_add</span> Add Resident
                </button>
            </div>
        </div>

        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon bg-primary-subtle text-primary">
                    <span class="material-icons-outlined">people</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Total Residents</div>
                    <div class="stat-value" id="statTotalResidents">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-success-subtle text-success">
                    <span class="material-icons-outlined">family_restroom</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Family Members</div>
                    <div class="stat-value" id="statFamilyCount">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-info-subtle text-info">
                    <span class="material-icons-outlined">home</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Units Occupied</div>
                    <div class="stat-value" id="statOccupiedUnits">-</div>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search by name, house, phone, or email...">
                    </div>
                    <div class="filter-group">
                        <select id="houseFilter" class="form-select">
                            <option value="">All Houses</option>
                        </select>
                        <select id="occupancyFilter" class="form-select">
                            <option value="">All Occupancy</option>
                            <option value="owner">Owner</option>
                            <option value="tenant">Tenant</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="residentsTable">
                        <thead>
                            <tr>
                                <th>Resident Name</th>
                                <th>House / Unit</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Occupancy</th>
                                <th>Move In Date</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="residentsTableBody">
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">Loading residents...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Add/Edit Resident Modal -->
<div class="modal fade" id="residentModal" tabindex="-1" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="residentModalTitle">Add Resident</h5>
                <button type="button" class="btn-close" id="closeResidentModalBtn">&times;</button>
            </div>
            <form id="residentForm">
                <input type="hidden" id="residentId" value="">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label" for="resName">Full Name *</label>
                        <input type="text" id="resName" class="form-control" required placeholder="e.g. Robert Smith">
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="resHouseId">House / Unit *</label>
                        <select id="resHouseId" class="form-select" required>
                            <option value="">Select House...</option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="resPhone">Phone Number *</label>
                            <input type="text" id="resPhone" class="form-control" required placeholder="e.g. +1 555-0199">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="resEmail">Email Address</label>
                            <input type="email" id="resEmail" class="form-control" placeholder="robert@example.com">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="resOccupancy">Occupancy Type *</label>
                            <select id="resOccupancy" class="form-select" required>
                                <option value="owner">Owner</option>
                                <option value="tenant">Tenant</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="resMoveIn">Move In Date</label>
                            <input type="date" id="resMoveIn" class="form-control">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="resEmergency">Emergency Contact</label>
                        <input type="text" id="resEmergency" class="form-control" placeholder="Contact name & phone">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelResidentModalBtn">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="saveResidentBtn">Save Resident</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal-backdrop fade" id="modalBackdrop" style="display:none;"></div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>