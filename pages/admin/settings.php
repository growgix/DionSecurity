<?php
/**
 * Dion Security — Admin settings
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'settings'));
$pageCss = ['/public/css/pages/admin/settings.css'];
$pageScripts = ['/public/js/pages/admin/settings.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header mb-4">
            <h1 class="page-title">Estate Configuration & Security Policy</h1>
            <p class="text-muted">Global estate parameters, gate security policies, and contact information.</p>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">General Settings</h5>
                    </div>
                    <div class="card-body">
                        <form id="settingsForm">
                            <div class="mb-3">
                                <label class="form-label" for="sEstateName">Estate Name *</label>
                                <input type="text" id="sEstateName" class="form-control" required placeholder="Dion Security Estate">
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label" for="sContactEmail">Contact Email</label>
                                    <input type="email" id="sContactEmail" class="form-control" placeholder="security@dionestate.com">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="sContactPhone">Emergency / Gate Hotline</label>
                                    <input type="text" id="sContactPhone" class="form-control" placeholder="+1 555-0100">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="sAddress">Estate Address</label>
                                <textarea id="sAddress" class="form-control" rows="2" placeholder="100 Dion Boulevard, Sector 4"></textarea>
                            </div>

                            <hr class="my-4">
                            <h6 class="fw-bold mb-3">Gate Access & Security Protocols</h6>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label" for="sGatePassExpiry">Pass Expiration (Hours)</label>
                                    <input type="number" id="sGatePassExpiry" class="form-control" value="24" min="1" max="168">
                                    <small class="text-muted">Maximum hours a guest pass remains active.</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="sMaxVisitorsUnit">Max Daily Guests / Unit</label>
                                    <input type="number" id="sMaxVisitorsUnit" class="form-control" value="10" min="1" max="50">
                                    <small class="text-muted">Pre-registration ceiling before guard override.</small>
                                </div>
                            </div>

                            <div class="d-flex justify-content-end">
                                <button type="submit" class="btn btn-primary" id="saveSettingsBtn">
                                    <span class="material-icons-outlined">save</span> Save Configuration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="card-title mb-0">System Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <label class="text-muted small">Architecture</label>
                            <div class="fw-bold">Core PHP 8.2 + MySQL 8.0</div>
                        </div>
                        <div class="mb-2">
                            <label class="text-muted small">Frontend Framework</label>
                            <div class="fw-bold">Vanilla JS / Modern CSS</div>
                        </div>
                        <div class="mb-2">
                            <label class="text-muted small">Security Hardening</label>
                            <div class="text-success"><span class="material-icons-outlined align-middle" style="font-size:16px;">security</span> RBAC + Session Strict + CSRF</div>
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