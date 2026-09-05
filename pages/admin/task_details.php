<?php
/**
 * Dion Security — Admin task_details
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'task_details'));
$pageCss = ['/public/css/pages/admin/task_details.css'];
$pageScripts = ['/public/js/pages/admin/task_details.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="mb-3">
            <a href="/pages/admin/tasks.php" class="btn btn-outline-secondary btn-sm">
                <span class="material-icons-outlined" style="font-size:16px;">arrow_back</span> Back to Tasks
            </a>
        </div>

        <div class="content-header d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="page-title" id="taskTitle">Task Details</h1>
                <p class="text-muted" id="taskSubtitle">Operational Directive</p>
            </div>
            <div id="taskStatusBadge">
                <!-- Status badge injected -->
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8 mb-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Directive Specifications</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-4">
                            <label class="text-muted small">Description & Instructions</label>
                            <p class="fs-6 mt-1" id="taskDesc">No specific details recorded.</p>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="text-muted small">Assigned Officer</label>
                                <div class="fw-bold fs-6" id="taskAssignee">-</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="text-muted small">Priority Level</label>
                                <div id="taskPriority">-</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="text-muted small">Due Date</label>
                                <div class="fw-bold" id="taskDue">-</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="text-muted small">Created Timestamp</label>
                                <div class="fw-bold" id="taskCreated">-</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Officer Remarks & Updates</h5>
                    </div>
                    <div class="card-body">
                        <div id="remarksList" class="mb-3">
                            <p class="text-muted">No remarks entered on this task.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Directive Audit Info</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="text-muted small">Directive ID</label>
                            <div><code id="taskIdCode">-</code></div>
                        </div>
                        <div class="mb-3">
                            <label class="text-muted small">Audit Status</label>
                            <div class="text-success"><span class="material-icons-outlined align-middle" style="font-size:18px;">verified</span> Server Enforced</div>
                        </div>
                        <div class="mb-3">
                            <label class="text-muted small">Actions</label>
                            <div class="d-grid gap-2">
                                <a href="/pages/admin/tasks.php" class="btn btn-outline-primary">Return to Master Board</a>
                            </div>
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