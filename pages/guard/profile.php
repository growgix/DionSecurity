<?php
/**
 * Dion Security — Guard Profile & Duty Shift
 * Functional parity replacement for GuardProfilePage.jsx.
 * Authoritative Server-side Role Check: 'guard' and 'admin'.
 */

require_once __DIR__ . '/../../includes/auth_check.php';

// Server-side RBAC: guard and admin
$currentUser = requirePageRole('guard', 'admin');

$pageTitle = 'Guard Profile & Duty Shift';
$pageCss = [
    '/public/css/pages/guard/profile.css'
];
$pageScripts = [
    '/public/js/pages/guard/profile.js'
];

require_once __DIR__ . '/../../includes/head.php';
require_once __DIR__ . '/../../includes/header.php';
require_once __DIR__ . '/../../includes/sidebar.php';
require_once __DIR__ . '/../../includes/drawer.php';

$name = htmlspecialchars($currentUser['name'] ?? 'Officer C. Miller');
$avatar = htmlspecialchars(strtoupper(substr($name, 0, 2)));
$userId = htmlspecialchars($currentUser['id'] ?? 'GRD-1044');
$email = htmlspecialchars($currentUser['email'] ?? 'miller@dionventures.com');
$role = htmlspecialchars(ucfirst($currentUser['role'] ?? 'guard'));
$phone = htmlspecialchars($currentUser['phone'] ?? '+91 98000 11044');
$station = htmlspecialchars($currentUser['station'] ?? 'Main Gate 01');
$title = htmlspecialchars($currentUser['title'] ?? 'Perimeter Security Officer');
?>

<main class="dion-main-content">
    <div class="profile-wrapper">

        <!-- Top Operational Banner -->
        <section class="terminal-banner">
            <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
                <span class="terminal-badge">
                    <span class="terminal-pulse"></span>
                    SECURITY TERMINAL • USER CREDENTIALS
                </span>
                <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-on-surface-muted);">
                    SESSION ID: <?= htmlspecialchars(session_id() ? substr(session_id(), 0, 8) . '...' : 'SEC-ACTIVE') ?>
                </span>
            </div>
            <a href="/pages/guard/dashboard.php" class="terminal-kbd">
                <kbd style="padding: 2px 6px; border-radius: 4px; background: var(--color-surface-lowest); box-shadow: var(--shadow-sm); font-weight: 700;">Esc</kbd>
                <span>Dashboard</span>
            </a>
        </section>

        <!-- Header -->
        <div class="page-header">
            <span class="subheading">Security Terminal User Profile</span>
            <h1 class="heading">Guard Profile & Duty Shift</h1>
            <p class="description">Active duty session credentials, station assignment, and daily turnstile throughput metrics.</p>
        </div>

        <!-- Profile Card -->
        <div class="profile-card">
            <div class="profile-card-top">
                <div class="officer-avatar"><?= $avatar ?></div>
                <div class="officer-info">
                    <div class="officer-title-row">
                        <h2 class="officer-name"><?= $name ?></h2>
                        <span class="active-badge">
                            <span class="status-dot"></span>
                            <span>Active On Duty</span>
                        </span>
                    </div>
                    <p class="officer-id-line">
                        ID: <strong class="mono text-primary"><?= $userId ?></strong> • <?= $title ?>
                    </p>
                    <p class="officer-station-line">
                        Duty Station: <strong class="text-on-surface"><?= $station ?></strong> • Email: <span class="mono"><?= $email ?></span> • Contact: <?= $phone ?>
                    </p>
                </div>
            </div>

            <div class="metrics-grid">
                <div class="metric-box">
                    <span class="metric-label">Active Shift</span>
                    <span class="metric-val">Morning (06:00 - 14:00)</span>
                </div>
                <div class="metric-box">
                    <span class="metric-label">Gate Clearances Logged</span>
                    <span id="clearances-count" class="metric-val mono text-primary">-- Today</span>
                </div>
                <div class="metric-box">
                    <span class="metric-label">Security Clearance</span>
                    <span class="metric-val">Level 2 (Boom Barrier & Turnstiles)</span>
                </div>
            </div>
        </div>

        <!-- Security Session Details -->
        <div class="session-card">
            <h3 class="session-title">
                <span class="material-symbols-outlined" style="font-size: 20px; color: var(--color-primary);">shield_person</span>
                <span>Active Terminal Authentication & Governance</span>
            </h3>
            <div class="session-grid">
                <div class="session-item">
                    <span class="session-label">Authorization Role</span>
                    <span class="session-val font-semibold"><?= $role ?> Portal Access</span>
                </div>
                <div class="session-item">
                    <span class="session-label">Authentication Mode</span>
                    <span class="session-val">Hardened PHP Session (HttpOnly, SameSite=Lax)</span>
                </div>
                <div class="session-item">
                    <span class="session-label">CSRF Protection</span>
                    <span class="session-val text-success">Active & Enforced on Mutations</span>
                </div>
                <div class="session-item">
                    <span class="session-label">Turnstile Node</span>
                    <span class="session-val mono">GATE-NODE-01A (Primary Inbound/Outbound)</span>
                </div>
            </div>
        </div>

    </div>
</main>

<div id="toast-container" class="toast-container"></div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>