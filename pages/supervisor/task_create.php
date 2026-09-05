<?php
/**
 * Dion Security — Supervisor Create & Assign Task
 * Parity replacement for frontend/src/pages/supervisor/CreateAssignTaskPage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

$currentUser = requirePageRole('supervisor', 'admin');

$pageTitle = 'Create & Assign Task';
$pageCss = [
    '/public/css/pages/supervisor/task_create.css'
];
$pageScripts = [
    '/public/js/pages/supervisor/task_create.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';
?>

<main class="dion-main-content">
    <div class="task-create-container">
        
        <!-- Header -->
        <header class="page-header-block">
            <div class="header-titles">
                <div class="header-breadcrumbs">
                    <a href="/pages/supervisor/task_board.php" class="crumb-link">Task Board</a>
                    <span class="crumb-dot">•</span>
                    <span>Work Order Dispatch</span>
                </div>
                <h1 class="page-heading">Create & Assign Task</h1>
                <p class="page-description">
                    Dispatch operational tasks to on-duty personnel with priority tags, deadlines, and location specifications.
                </p>
            </div>
            <div class="header-actions">
                <a href="/pages/supervisor/task_board.php" class="btn btn-secondary">
                    <span class="material-symbols-outlined" style="font-size: 18px;">arrow_back</span>
                    <span>Back to Board</span>
                </a>
            </div>
        </header>

        <!-- Feedback Alert Banner -->
        <div id="create-task-toast" class="create-task-toast" style="display: none;" role="alert"></div>

        <!-- Form Card -->
        <div class="form-card">
            <form id="create-task-form" autocomplete="off">
                
                <!-- Task Title -->
                <div class="form-group">
                    <label for="task-title" class="form-label">
                        Task Title / Directive Summary <span class="required-star">*</span>
                    </label>
                    <input type="text" id="task-title" name="title" class="form-control" 
                        placeholder="e.g. Block A Main Elevator Sensor Recalibration" required>
                    <span class="form-hint">Provide a concise, descriptive operational title.</span>
                </div>

                <!-- Category & Priority -->
                <div class="form-row-2">
                    <div class="form-group">
                        <label for="task-category" class="form-label">Operational Department</label>
                        <select id="task-category" name="category" class="form-select">
                            <option value="Facilities & Engineering">Facilities & Engineering</option>
                            <option value="Security & Surveillance">Security & Surveillance</option>
                            <option value="Housekeeping & Sanitization">Housekeeping & Sanitization</option>
                            <option value="Landscaping & Horticulture">Landscaping & Horticulture</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="task-priority" class="form-label">Priority Classification</label>
                        <select id="task-priority" name="priority" class="form-select">
                            <option value="urgent">🔴 Urgent (Immediate Response)</option>
                            <option value="high" selected>🟠 High (Within 4 Hours)</option>
                            <option value="medium">🟡 Medium (Same Day)</option>
                            <option value="low">🟢 Low (Routine Inspection)</option>
                        </select>
                    </div>
                </div>

                <!-- Assignee & Location -->
                <div class="form-row-2">
                    <div class="form-group">
                        <label for="task-assigned-to" class="form-label">
                            Assign to Personnel <span class="required-star">*</span>
                        </label>
                        <select id="task-assigned-to" name="assignedToId" class="form-select" required>
                            <option value="">Loading workforce...</option>
                        </select>
                        <span class="form-hint">Select from active enrolled personnel roster.</span>
                    </div>

                    <div class="form-group">
                        <label for="task-location" class="form-label">
                            Location / Sector <span class="required-star">*</span>
                        </label>
                        <input type="text" id="task-location" name="location" class="form-control" 
                            placeholder="e.g. Block A, Elevator Shaft #02" required>
                    </div>
                </div>

                <!-- Target Deadline -->
                <div class="form-group">
                    <label for="task-due-date" class="form-label">Target Completion Deadline</label>
                    <input type="text" id="task-due-date" name="dueDate" class="form-control" 
                        placeholder="e.g. Today, 05:00 PM or Tomorrow 12:00 PM" value="Today, 05:00 PM">
                </div>

                <!-- Instructions & Protocol -->
                <div class="form-group">
                    <label for="task-description" class="form-label">Work Protocol & Instructions</label>
                    <textarea id="task-description" name="description" class="form-control" rows="4" 
                        placeholder="Describe specific safety steps, spare parts required, or handover notes..."></textarea>
                </div>

                <!-- Buttons -->
                <div class="form-actions-bar">
                    <a href="/pages/supervisor/task_board.php" class="btn btn-secondary">Cancel</a>
                    <button type="submit" class="btn btn-primary" id="btn-submit-task">
                        <span class="material-symbols-outlined" style="font-size: 18px;">send</span>
                        <span>Dispatch Work Order</span>
                    </button>
                </div>

            </form>
        </div>

    </div>
</main>

<?php
require_once __DIR__ . '/../../includes/footer.php';
?>