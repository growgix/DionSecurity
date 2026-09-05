<?php
/**
 * Dion Security — Admin tasks
 */

require_once __DIR__ . '/../../includes/auth_check.php';
$currentUser = requirePageRole('admin');

$pageTitle = ucwords(str_replace('_', ' ', 'tasks'));
$pageCss = ['/public/css/pages/admin/tasks.css'];
$pageScripts = ['/public/js/pages/admin/tasks.js'];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>
<div class="main-wrapper">
    

    <main class="page-content">
        <div class="content-header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="page-title">Master Tasks & Directives</h1>
                <p class="text-muted">Oversee operational tasks, assignments, and resolution statuses across the workforce.</p>
            </div>
            <div>
                <button class="btn btn-primary" id="addTaskBtn">
                    <span class="material-icons-outlined">add_task</span> New Task Directive
                </button>
            </div>
        </div>

        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon bg-primary-subtle text-primary">
                    <span class="material-icons-outlined">assignment</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Total Tasks</div>
                    <div class="stat-value" id="statTotalTasks">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-warning-subtle text-warning">
                    <span class="material-icons-outlined">pending_actions</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Pending / In Progress</div>
                    <div class="stat-value" id="statPendingTasks">-</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon bg-success-subtle text-success">
                    <span class="material-icons-outlined">task_alt</span>
                </div>
                <div class="stat-info">
                    <div class="stat-label">Completed</div>
                    <div class="stat-value" id="statCompletedTasks">-</div>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="filter-bar">
                    <div class="search-box">
                        <span class="material-icons-outlined search-icon">search</span>
                        <input type="text" id="searchInput" class="form-control" placeholder="Search task title, assigned officer, or description...">
                    </div>
                    <div class="filter-group">
                        <select id="statusFilter" class="form-select">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select id="priorityFilter" class="form-select">
                            <option value="">All Priorities</option>
                            <option value="High">High / Urgent</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table" id="tasksTable">
                        <thead>
                            <tr>
                                <th>Task Title</th>
                                <th>Assigned Officer</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tasksTableBody">
                            <tr><td colspan="6" class="text-center py-4 text-muted">Loading tasks...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Modal -->
<div class="modal fade" id="taskModal" tabindex="-1" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="taskModalTitle">Create Task Directive</h5>
                <button type="button" class="btn-close" id="closeTaskModalBtn">&times;</button>
            </div>
            <form id="taskForm">
                <input type="hidden" id="taskId" value="">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label" for="tTitle">Task Title *</label>
                        <input type="text" id="tTitle" class="form-control" required placeholder="e.g. Inspect East Perimeter Lighting">
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="tDesc">Description</label>
                        <textarea id="tDesc" class="form-control" rows="3" placeholder="Provide operational instructions..."></textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="tAssigned">Assign To *</label>
                            <select id="tAssigned" class="form-select" required>
                                <option value="">Select Officer...</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="tPriority">Priority</label>
                            <select id="tPriority" class="form-select">
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="tStatus">Status</label>
                            <select id="tStatus" class="form-select">
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="tDue">Due Date</label>
                            <input type="date" id="tDue" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelTaskModalBtn">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Directive</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal-backdrop fade" id="modalBackdrop" style="display:none;"></div>
<?php
require_once __DIR__ . '/../../includes/footer.php';
?>