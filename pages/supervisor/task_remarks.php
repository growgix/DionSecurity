<?php
/**
 * Dion Security — Supervisor Task Remarks & Field Observations
 * Parity replacement for frontend/src/pages/supervisor/RemarksPage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

$currentUser = requirePageRole('supervisor', 'admin');

$pageTitle = 'Field Remarks & Observations';
$pageCss = [
    '/public/css/pages/supervisor/task_remarks.css'
];
$pageScripts = [
    '/public/js/pages/supervisor/task_remarks.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';

$userName = htmlspecialchars($currentUser['name'] ?? 'Inspector R. Thorne', ENT_QUOTES, 'UTF-8');
?>

<main class="dion-main-content">
    <div class="remarks-page-container">
        
        <!-- Header -->
        <header class="page-header-block">
            <div class="header-titles">
                <div class="header-breadcrumbs">
                    <span>Operations Log</span>
                    <span class="crumb-dot">•</span>
                    <span>Supervisor Notes</span>
                </div>
                <h1 class="page-heading">Field Remarks & Observations</h1>
                <p class="page-description">
                    Live chronological stream of field supervisor remarks, technician observations, handover notices, and inspection flags.
                </p>
            </div>
            <div class="header-actions">
                <button type="button" class="btn btn-secondary" id="btn-refresh-remarks">
                    <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
                    <span>Refresh Stream</span>
                </button>
            </div>
        </header>

        <!-- Feedback Alert Banner -->
        <div id="remarks-toast" class="remarks-toast" style="display: none;" role="alert"></div>

        <!-- Split Grid: Post Form + Feed -->
        <div class="remarks-layout-grid">
            
            <!-- Left Form Card -->
            <div class="form-panel-card">
                <div class="card-header">
                    <h2 class="card-title">Post Field Remark</h2>
                    <span class="card-subtitle">Add technical observation or handover note</span>
                </div>

                <form id="post-remark-form" autocomplete="off">
                    <div class="form-group">
                        <label for="select-task" class="form-label">Related Task / Location</label>
                        <select id="select-task" class="form-select" required>
                            <option value="">Loading tasks...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="author-name" class="form-label">Author Credential</label>
                        <input type="text" id="author-name" class="form-control" value="<?= $userName ?> (Supervisor)" readonly>
                    </div>

                    <div class="form-group">
                        <label for="remark-text" class="form-label">Observation / Handover Note <span class="required-star">*</span></label>
                        <textarea id="remark-text" class="form-control" rows="4" 
                            placeholder="Log observation, handover instruction, or equipment notice..." required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" id="btn-submit-remark">
                        <span class="material-symbols-outlined" style="font-size: 18px;">post_add</span>
                        <span>Publish Field Remark</span>
                    </button>
                </form>
            </div>

            <!-- Right Feed Card -->
            <div class="feed-panel-card">
                <div class="feed-header">
                    <div class="feed-header-left">
                        <h2 class="card-title">Live Remarks Stream</h2>
                        <span class="badge badge-neutral" id="total-remarks-badge">0 Logs</span>
                    </div>
                    <div class="feed-filter-wrap">
                        <input type="text" id="feed-search" class="form-control" placeholder="Search remarks..." autocomplete="off">
                    </div>
                </div>

                <div class="remarks-feed-list" id="remarks-feed-list">
                    <div class="empty-feed-state">
                        <span class="material-symbols-outlined spinner">progress_activity</span>
                        <span>Loading remarks stream...</span>
                    </div>
                </div>
            </div>

        </div>

    </div>
</main>

<?php
require_once __DIR__ . '/../../includes/footer.php';
?>