<?php
/**
 * Shared Header / Navbar Include
 * Displays Dion branding, current page breadcrumb/title, authenticated user info,
 * quick emergency alert trigger, and mobile drawer toggle button.
 */
require_once __DIR__ . '/../backend/config/auth.php';
$currentUser = getAuthenticatedUser();
?>
<header class="dion-header" id="app-header">
    <div class="header-left">
        <button type="button" class="drawer-toggle-btn" id="drawer-toggle-btn" aria-label="Toggle navigation menu">
            <span class="material-symbols-outlined">menu</span>
        </button>
        <a href="/" class="header-brand">
            <img src="/public/assets/logo.svg" alt="Dion Security Logo" class="header-logo">
            <span class="brand-text">DION SECURITY</span>
        </a>
        <span class="header-divider"></span>
        <h1 class="header-title" id="page-heading"><?= htmlspecialchars($pageTitle ?? 'Operations Console', ENT_QUOTES, 'UTF-8') ?></h1>
    </div>

    <div class="header-right">
        <?php if ($currentUser): ?>
            <div class="system-status-pill">
                <span class="status-dot online"></span>
                <span class="status-label">API Connected</span>
            </div>

            <div class="user-profile-menu">
                <div class="user-avatar-circle" title="<?= htmlspecialchars($currentUser['name'] ?? 'User', ENT_QUOTES, 'UTF-8') ?>">
                    <?= strtoupper(substr($currentUser['name'] ?? 'U', 0, 1)) ?>
                </div>
                <div class="user-meta">
                    <span class="user-name"><?= htmlspecialchars($currentUser['name'] ?? '', ENT_QUOTES, 'UTF-8') ?></span>
                    <span class="user-role-badge role-<?= htmlspecialchars(strtolower($currentUser['role'] ?? 'guest'), ENT_QUOTES, 'UTF-8') ?>">
                        <?= htmlspecialchars(ucfirst($currentUser['role'] ?? 'guest'), ENT_QUOTES, 'UTF-8') ?>
                    </span>
                </div>
                <button type="button" class="btn-logout" id="logout-btn" title="Sign Out" aria-label="Sign Out">
                    <span class="material-symbols-outlined">logout</span>
                </button>
            </div>
        <?php else: ?>
            <a href="/pages/login.php" class="btn btn-primary btn-sm">Sign In</a>
        <?php endif; ?>
    </div>
</header>