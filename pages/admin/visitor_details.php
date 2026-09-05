<?php
/**
 * Dion Security — Admin visitor_details
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'visitor_details'));
$pageCss = ['/public/css/pages/admin/visitor_details.css'];
$pageScripts = ['/public/js/pages/admin/visitor_details.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="mb-3">
            <a href="/pages/admin/visitors.php" class="btn btn-outline-secondary btn-sm">
                <span class="material-icons-outlined" style="font-size:16px;">arrow_back</span> Back to Visitor Directory
            </a>
        </div>

        <div class="content-header d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="page-title" id="visitorName">Visitor Profile</h1>
                <p class="text-muted" id="visitorSubtext">Audit trail and access logs for this visitor record.</p>
            </div>
            <div id="visitorStatusBadge">
                <!-- Status badge injected -->
            </div>
        </div>

        <div class="row">
            <div class="col-lg-5 mb-4">
                <div class="card h-100">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Visitor Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="detail-group mb-3">
                            <label class="text-muted small">Full Name</label>
                            <div class="fw-bold fs-6" id="dName">-</div>
                        </div>
                        <div class="detail-group mb-3">
                            <label class="text-muted small">Contact Phone</label>
                            <div class="fw-bold" id="dPhone">-</div>
                        </div>
                        <div class="detail-group mb-3">
                            <label class="text-muted small">ID / National ID / Badge</label>
                            <div class="fw-bold" id="dBadge">-</div>
                        </div>
                        <div class="detail-group mb-3">
                            <label class="text-muted small">Visiting Purpose</label>
                            <div class="fw-bold" id="dPurpose">-</div>
                        </div>
                        <div class="detail-group mb-3">
                            <label class="text-muted small">Vehicle Plate Number</label>
                            <div class="fw-bold" id="dVehicle">-</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-7 mb-4">
                <div class="card h-100">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Destination & Security Verification</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="text-muted small">Host Resident</label>
                                <div class="fw-bold" id="dHost">-</div>
                            </div>
                            <div class="col-md-6">
                                <label class="text-muted small">Destination Unit</label>
                                <div class="fw-bold" id="dUnit">-</div>
                            </div>
                        </div>
                        <hr>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="text-muted small">Check-in Timestamp</label>
                                <div class="fw-bold" id="dCheckIn">-</div>
                            </div>
                            <div class="col-md-6">
                                <label class="text-muted small">Check-out Timestamp</label>
                                <div class="fw-bold" id="dCheckOut">-</div>
                            </div>
                        </div>
                        <div class="detail-group">
                            <label class="text-muted small">Security Remarks / Gate Notes</label>
                            <p class="text-secondary bg-light p-3 rounded" id="dRemarks">No gate notes registered.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>