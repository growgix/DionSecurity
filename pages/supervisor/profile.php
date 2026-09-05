<?php
/**
 * Dion Security — Supervisor Profile & Station Authority
 * Parity replacement for frontend/src/pages/supervisor/SupervisorProfilePage.jsx.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

$currentUser = requirePageRole('supervisor', 'admin');

$pageTitle = 'Supervisor Profile';
$pageCss = [
    '/public/css/pages/supervisor/profile.css'
];
$pageScripts = [
    '/public/js/pages/supervisor/profile.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';

$userName = htmlspecialchars($currentUser['name'] ?? 'Inspector R. Thorne', ENT_QUOTES, 'UTF-8');
$userEmail = htmlspecialchars($currentUser['email'] ?? 'supervisor@dionsecurity.com', ENT_QUOTES, 'UTF-8');
$userPhone = htmlspecialchars($currentUser['phone'] ?? '+1 (555) 019-2834', ENT_QUOTES, 'UTF-8');
$userId = htmlspecialchars($currentUser['id'] ?? 'SUP-2081', ENT_QUOTES, 'UTF-8');

$initials = 'RT';
if (!empty($currentUser['name'])) {
    $parts = explode(' ', trim($currentUser['name']));
    $initials = count($parts) >= 2 
        ? strtoupper(substr($parts[0], 0, 1) . substr($parts[1], 0, 1))
        : strtoupper(substr($currentUser['name'], 0, 2));
}
?>

<main class="dion-main-content">
    <div class="profile-page-container">
        
        <!-- Header -->
        <header class="page-header-block">
            <div class="header-titles">
                <span class="eyebrow-text">Operations Lead Profile</span>
                <h1 class="page-heading">Field Supervisor Profile</h1>
                <p class="page-description">
                    Field supervision credential, workforce management quota, and operational authority scope.
                </p>
            </div>
        </header>

        <!-- Main Profile Card -->
        <div class="profile-hero-card">
            <div class="profile-top-section">
                <div class="profile-avatar-large">
                    <?= $initials ?>
                </div>
                <div class="profile-primary-details">
                    <div class="profile-name-row">
                        <h2 class="profile-full-name"><?= $userName ?></h2>
                        <span class="duty-badge">
                            <span class="pulse-dot"></span>
                            <span>Active On Duty</span>
                        </span>
                    </div>
                    <div class="profile-sub-line">
                        <span>ID: <strong class="code-id"><?= $userId ?></strong></span>
                        <span class="meta-dot">•</span>
                        <span>Workforce & Facilities Supervisor</span>
                    </div>
                    <div class="profile-contact-line">
                        <span>Station: <strong>Facility Operations Hub</strong></span>
                        <span class="meta-dot">•</span>
                        <span>Contact: <?= $userPhone ?></span>
                        <span class="meta-dot">•</span>
                        <span>Email: <?= $userEmail ?></span>
                    </div>
                </div>
            </div>

            <!-- 3 Quota / Metrics Cards -->
            <div class="profile-metrics-grid">
                <div class="metric-box">
                    <span class="metric-label">Workforce Headcount Supervised</span>
                    <span class="metric-value" id="profile-emp-count">12 Personnel</span>
                </div>
                <div class="metric-box">
                    <span class="metric-label">Active Tasks in Stream</span>
                    <span class="metric-value text-primary" id="profile-task-count">5 Operational Tasks</span>
                </div>
                <div class="metric-box">
                    <span class="metric-label">Operational Authority</span>
                    <span class="metric-value text-accent">Muster, Dispatch & Wage Review</span>
                </div>
            </div>
        </div>

        <!-- Security & Station Credential Specs -->
        <div class="specs-card">
            <h3 class="specs-title">Station Governance & Credentials</h3>
            <div class="specs-grid">
                <div class="spec-item">
                    <span class="spec-name">Primary Station</span>
                    <span class="spec-data">Facility Operations Command Hub (Building B)</span>
                </div>
                <div class="spec-item">
                    <span class="spec-name">Shift Assignment</span>
                    <span class="spec-data">Morning Shift (06:00 - 14:00)</span>
                </div>
                <div class="spec-item">
                    <span class="spec-name">Security Clearance</span>
                    <span class="spec-data">Tier 2 — Field Operations Supervisor</span>
                </div>
                <div class="spec-item">
                    <span class="spec-name">Session Protection</span>
                    <span class="spec-data">PHP Session Guard (CSRF & Credentialed Cookies)</span>
                </div>
            </div>
        </div>

    </div>
</main>

<?php
require_once __DIR__ . '/../../includes/footer.php';
?>