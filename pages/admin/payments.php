<?php
/**
 * Dion Security — Admin payments
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'payments'));
$pageCss = ['/public/css/pages/admin/payments.css'];
$pageScripts = ['/public/js/pages/admin/payments.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Workforce Payments & Wages</h1>
                <p class="text-muted">Bi-weekly and monthly payroll reconciliation, wage advances, and disbursement vouchers.</p>
            </div>
            <div>
                <a href="/pages/admin/payment_add.php" class="btn btn-primary">
                    <span class="material-icons-outlined">add</span> Record New Payment
                </a>
            </div>
        </div>

        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon bg-success-subtle text-success">
                    <span class="material-icons-outlined">payments</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Total Disbursed</div>
                    <div class="stat-value" id="statTotalAmount">$0</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-primary-subtle text-primary">
                    <span class="material-icons-outlined">receipt_long</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Disbursements Logged</div>
                    <div class="stat-value" id="statTxnCount">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-info-subtle text-info">
                    <span class="material-icons-outlined">badge</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Beneficiaries</div>
                    <div class="stat-value" id="statUnitsPaying">-</div>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search by voucher #, officer name, or ID...">
                    </div>
                    <div class="filter-group">
                        <select id="typeFilter" class="form-select">
                            <option value="">All Payment Types</option>
                            <option value="Monthly Salary">Monthly Salary</option>
                            <option value="Wage Advance">Wage Advance</option>
                            <option value="Overtime Allowance">Overtime Allowance</option>
                            <option value="Festival Bonus">Festival Bonus</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="paymentsTable">
                        <thead>
                            <tr>
                                <th>Voucher #</th>
                                <th>Officer / Personnel</th>
                                <th>Category</th>
                                <th>Disbursed Amount</th>
                                <th>Disbursement Mode</th>
                                <th>Payment Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="paymentsTableBody">
                            <tr><td colspan="7" class="text-center py-4 text-muted">Loading payments ledger...</td></tr>
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