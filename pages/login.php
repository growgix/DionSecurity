<?php
/**
 * Dion Security & Workforce Operations
 * Authentication & Portal Sign-In Page
 */

require_once __DIR__ . '/../includes/auth_check.php';

// Redirect authenticated users directly to their dashboard
redirectIfAuthenticated();

$pageTitle = 'Sign In';
$pageCss = ['/public/css/pages/login.css'];

require_once __DIR__ . '/../includes/head.php';
?>

<div class="login-page-wrapper">
    <div class="login-card">
        <div class="login-brand-header">
            <img src="/public/assets/logo.svg" alt="Dion Security" class="login-logo">
            <h1 class="login-title">Dion Security</h1>
            <p class="login-subtitle">Workforce & Security Management System</p>
        </div>

        <div class="persona-selector-section">
            <span class="persona-label">Quick Sign-In (Demo Personas)</span>
            <div class="persona-grid">
                <button type="button" class="persona-btn" data-role="admin" id="persona-admin">
                    <span class="material-symbols-outlined persona-icon">admin_panel_settings</span>
                    <span class="persona-name">Admin</span>
                </button>
                <button type="button" class="persona-btn" data-role="supervisor" id="persona-supervisor">
                    <span class="material-symbols-outlined persona-icon">manage_accounts</span>
                    <span class="persona-name">Supervisor</span>
                </button>
                <button type="button" class="persona-btn" data-role="guard" id="persona-guard">
                    <span class="material-symbols-outlined persona-icon">shield</span>
                    <span class="persona-name">Guard</span>
                </button>
            </div>
        </div>

        <div class="login-error-alert" id="login-error-alert" role="alert">
            <span class="material-symbols-outlined">error</span>
            <span id="login-error-message">Invalid credentials.</span>
        </div>

        <form id="login-form" method="POST" action="#" novalidate>
            <div class="form-group">
                <label for="username" class="form-label">Corporate Email / Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    class="form-input"
                    placeholder="e.g. admin@dionsecurity.com"
                    required
                    autocomplete="username"
                >
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    class="form-input"
                    placeholder="Enter your password"
                    required
                    autocomplete="current-password"
                >
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-submit-btn" style="margin-top: 1.5rem;">
                <span class="material-symbols-outlined" id="login-spinner" style="display: none; font-size: 20px;">progress_activity</span>
                <span id="login-submit-text">Sign In</span>
            </button>
        </form>

        <div class="login-footer-security">
            <span class="material-symbols-outlined" style="font-size: 16px;">lock</span>
            <span>Secured with Session Authentication & CSRF Shield</span>
        </div>
    </div>
</div>

<?php
$pageScripts = ['/public/js/pages/login.js'];
require_once __DIR__ . '/../includes/footer.php';
?>