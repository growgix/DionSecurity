<?php
/**
 * Dion Security — Admin reports
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'reports'));
$pageCss = ['/public/css/pages/admin/reports.css'];
$pageScripts = ['/public/js/pages/admin/reports.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="page-title">Executive Reports & Analytics</h1>
                <p class="text-muted">High-level operational metrics across estate units, visitor flows, workforce, and finance.</p>
            </div>
            <div>
                <button class="btn btn-outline-primary" id="printReportBtn">
                    <span class="material-icons-outlined">print</span> Print Summary
                </button>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <div class="card h-100 text-center p-3">
                    <div class="stat-label">Total Housing Units</div>
                    <div class="fs-2 fw-bold text-primary" id="repUnits">-</div>
                    <div class="text-muted small">Registered in Estate</div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card h-100 text-center p-3">
                    <div class="stat-label">Primary Residents</div>
                    <div class="fs-2 fw-bold text-success" id="repResidents">-</div>
                    <div class="text-muted small">Active Occupants</div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card h-100 text-center p-3">
                    <div class="stat-label">Total Gate Visits</div>
                    <div class="fs-2 fw-bold text-info" id="repVisits">-</div>
                    <div class="text-muted small">Logged Check-ins</div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card h-100 text-center p-3">
                    <div class="stat-label">Collections Total</div>
                    <div class="fs-2 fw-bold text-warning" id="repCollections">$0</div>
                    <div class="text-muted small">Dues Collected</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card h-100">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Occupancy & Estate Density</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Residential Blocks:</span>
                            <strong id="repBlocks">-</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Family Dependents:</span>
                            <strong id="repFamily">-</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Security Staff Deployed:</span>
                            <strong id="repWorkforce">-</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Active Directives:</span>
                            <strong id="repTasks">-</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 mb-4">
                <div class="card h-100">
                    <div class="card-header">
                        <h5 class="card-title mb-0">System Governance & Integrity</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Security Audit Events:</span>
                            <strong id="repAudits">-</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Admin Accounts:</span>
                            <strong id="repAdmins">-</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Database Status:</span>
                            <span class="badge bg-success-subtle text-success">Optimal & Baseline Verified</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Authentication Mechanism:</span>
                            <span class="badge bg-primary-subtle text-primary">PHP Native Session RBAC</span>
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