<?php
/**
 * Dion Security — Admin family_members
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'family_members'));
$pageCss = ['/public/css/pages/admin/family_members.css'];
$pageScripts = ['/public/js/pages/admin/family_members.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Resident Family Members</h1>
                <p class="text-muted">Manage verified family members and dependents attached to residential units.</p>
            </div>
            <div>
                <button class="btn btn-primary" id="addFamilyBtn">
                    <span class="material-icons-outlined">group_add</span> Add Family Member
                </button>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search by name, relation, or primary resident...">
                    </div>
                    <div class="filter-group">
                        <select id="residentFilter" class="form-select">
                            <option value="">All Primary Residents</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="familyTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Primary Resident</th>
                                <th>House / Unit</th>
                                <th>Relationship</th>
                                <th>Phone</th>
                                <th>Access Card</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="familyTableBody">
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">Loading family members...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Modal -->
<div class="modal fade" id="familyModal" tabindex="-1" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="familyModalTitle">Add Family Member</h5>
                <button type="button" class="btn-close" id="closeFamilyModalBtn">&times;</button>
            </div>
            <form id="familyForm">
                <input type="hidden" id="familyId" value="">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label" for="famName">Full Name *</label>
                        <input type="text" id="famName" class="form-control" required placeholder="e.g. Sarah Smith">
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="famResidentId">Primary Resident *</label>
                        <select id="famResidentId" class="form-select" required>
                            <option value="">Select Resident...</option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="famRelation">Relationship *</label>
                            <select id="famRelation" class="form-select" required>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="famPhone">Phone Number</label>
                            <input type="text" id="famPhone" class="form-control" placeholder="+1 555-0188">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="famCard">Access Card / Pass #</label>
                        <input type="text" id="famCard" class="form-control" placeholder="CARD-9872">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelFamilyModalBtn">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Member</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal-backdrop fade" id="modalBackdrop" style="display:none;"></div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>