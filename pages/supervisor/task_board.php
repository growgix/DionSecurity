<?php
/**
 * Dion Security — Supervisor Task Kanban Board
 * Parity replacement for frontend/src/pages/supervisor/TaskBoardPage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

$currentUser = requirePageRole('supervisor', 'admin');

$pageTitle = 'Task Kanban Board';
$pageCss = [
    '/public/css/pages/supervisor/task_board.css'
];
$pageScripts = [
    '/public/js/pages/supervisor/task_board.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="task-board-container">
        
        <!-- Header -->
        <header class="page-header-block">
            <div class="header-titles">
                <div class="header-breadcrumbs">
                    <span>Operational Workflow</span>
                    <span class="crumb-dot">•</span>
                    <span>Interactive Kanban Board</span>
                </div>
                <h1 class="page-heading">Field Task Board</h1>
                <p class="page-description">
                    Visual lifecycle tracking and dispatch management from task creation to execution and final supervisor sign-off.
                </p>
            </div>
            <div class="header-actions">
                <button type="button" class="btn btn-secondary" id="btn-refresh-tasks">
                    <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
                    <span>Refresh</span>
                </button>
                <a href="/pages/supervisor/task_create.php" class="btn btn-primary">
                    <span class="material-symbols-outlined" style="font-size: 18px;">add_task</span>
                    <span>+ Assign Task</span>
                </a>
            </div>
        </header>

        <!-- KPI Summary -->
        <section class="task-kpi-summary">
            <div class="task-kpi-item">
                <span class="task-kpi-count" id="count-total-tasks">0</span>
                <span class="task-kpi-title">Total Tasks</span>
            </div>
            <div class="task-kpi-item">
                <span class="task-kpi-count text-created" id="count-created-tasks">0</span>
                <span class="task-kpi-title">Created</span>
            </div>
            <div class="task-kpi-item">
                <span class="task-kpi-count text-assigned" id="count-assigned-tasks">0</span>
                <span class="task-kpi-title">Assigned</span>
            </div>
            <div class="task-kpi-item">
                <span class="task-kpi-count text-progress" id="count-progress-tasks">0</span>
                <span class="task-kpi-title">In Progress</span>
            </div>
            <div class="task-kpi-item">
                <span class="task-kpi-count text-completed" id="count-completed-tasks">0</span>
                <span class="task-kpi-title">Completed</span>
            </div>
            <div class="task-kpi-item">
                <span class="task-kpi-count text-verified" id="count-verified-tasks">0</span>
                <span class="task-kpi-title">Verified</span>
            </div>
        </section>

        <!-- Toast -->
        <div id="task-toast" class="task-toast" style="display: none;" role="alert"></div>

        <!-- Kanban Board 5 Columns -->
        <div class="kanban-grid">
            
            <!-- Column 1: Created -->
            <div class="kanban-column" data-status="created">
                <div class="column-header">
                    <div class="col-title-group">
                        <span class="material-symbols-outlined col-icon">note_add</span>
                        <span class="col-name">Created</span>
                    </div>
                    <span class="col-count-pill" id="badge-created">0</span>
                </div>
                <div class="task-cards-list" id="col-tasks-created">
                    <div class="empty-col-state">No created tasks</div>
                </div>
            </div>

            <!-- Column 2: Assigned -->
            <div class="kanban-column" data-status="assigned">
                <div class="column-header">
                    <div class="col-title-group">
                        <span class="material-symbols-outlined col-icon">assignment_ind</span>
                        <span class="col-name">Assigned</span>
                    </div>
                    <span class="col-count-pill" id="badge-assigned">0</span>
                </div>
                <div class="task-cards-list" id="col-tasks-assigned">
                    <div class="empty-col-state">No assigned tasks</div>
                </div>
            </div>

            <!-- Column 3: In Progress -->
            <div class="kanban-column" data-status="in_progress">
                <div class="column-header">
                    <div class="col-title-group">
                        <span class="material-symbols-outlined col-icon">pending_actions</span>
                        <span class="col-name">In Progress</span>
                    </div>
                    <span class="col-count-pill" id="badge-in_progress">0</span>
                </div>
                <div class="task-cards-list" id="col-tasks-in_progress">
                    <div class="empty-col-state">No in-progress tasks</div>
                </div>
            </div>

            <!-- Column 4: Completed -->
            <div class="kanban-column" data-status="completed">
                <div class="column-header">
                    <div class="col-title-group">
                        <span class="material-symbols-outlined col-icon">task_alt</span>
                        <span class="col-name">Completed</span>
                    </div>
                    <span class="col-count-pill" id="badge-completed">0</span>
                </div>
                <div class="task-cards-list" id="col-tasks-completed">
                    <div class="empty-col-state">No completed tasks</div>
                </div>
            </div>

            <!-- Column 5: Verified -->
            <div class="kanban-column" data-status="verified">
                <div class="column-header">
                    <div class="col-title-group">
                        <span class="material-symbols-outlined col-icon">verified</span>
                        <span class="col-name">Verified</span>
                    </div>
                    <span class="col-count-pill" id="badge-verified">0</span>
                </div>
                <div class="task-cards-list" id="col-tasks-verified">
                    <div class="empty-col-state">No verified tasks</div>
                </div>
            </div>

        </div>

    </div>
</main>

<?php
require_once __DIR__ . '/../../includes/footer.php';
?>