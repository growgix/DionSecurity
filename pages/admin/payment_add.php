<?php
/**
 * Dion Security — Admin payment_add
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'payment_add'));
$pageCss = ['/public/css/pages/admin/payment_add.css'];
$pageScripts = ['/public/js/pages/admin/payment_add.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="mb-3">
            <a href="/pages/admin/payments.php" class="btn btn-outline-secondary btn-sm">
                <span class="material-icons-outlined" style="font-size:16px;">arrow_back</span> Back to Payments
            </a>
        </div>

        <div class="content-header mb-4">
            <h1 class="page-title">Record Payment / Wage Advance</h1>
            <p class="text-muted">Generate financial disbursement voucher for salary, advance draw, or approved overtime compensation.</p>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-body">
                        <form id="paymentAddForm">
                            <div class="mb-3">
                                <label class="form-label" for="pEmployee">Beneficiary Workforce Personnel *</label>
                                <select id="pEmployee" class="form-select" required>
                                    <option value="">Select Workforce Personnel...</option>
                                </select>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label" for="pAmount">Disbursement Amount ($) *</label>
                                    <input type="number" step="0.01" min="1" id="pAmount" class="form-control" required placeholder="e.g. 24500.00">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="pType">Disbursement Category *</label>
                                    <select id="pType" class="form-select" required>
                                        <option value="Monthly Salary">Monthly Salary</option>
                                        <option value="Wage Advance">Wage Advance</option>
                                        <option value="Overtime Allowance">Overtime Allowance</option>
                                        <option value="Festival Bonus">Festival Bonus</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label" for="pMethod">Disbursement Mode *</label>
                                    <select id="pMethod" class="form-select" required>
                                        <option value="NEFT / Direct Bank">NEFT / Direct Bank</option>
                                        <option value="Cash Voucher">Cash Voucher</option>
                                        <option value="Cheque Disbursement">Cheque Disbursement</option>
                                        <option value="UPI / Instant IMPS">UPI / Instant IMPS</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="pRemarks">Audit Remarks / Reference</label>
                                    <input type="text" id="pRemarks" class="form-control" placeholder="e.g. Approved monthly security stipend">
                                </div>
                            </div>
                            <div class="d-flex justify-content-end gap-2 mt-4">
                                <a href="/pages/admin/payments.php" class="btn btn-secondary">Cancel</a>
                                <button type="submit" class="btn btn-primary">Disburse & Generate Voucher</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card bg-light border">
                    <div class="card-body">
                        <h6 class="fw-bold mb-2">Accounting Policy</h6>
                        <p class="text-muted small mb-3">All entered payments are recorded immediately to the general ledger and assigned a server-derived audit trail with your admin actor ID.</p>
                        <hr>
                        <h6 class="fw-bold mb-2">Notice</h6>
                        <p class="text-muted small mb-0">Ensure the transaction reference corresponds to bank or POS slip before finalizing.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>