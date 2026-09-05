<?php
// ==============================================================================
// DION VENTURES ESTATE SECURITY & WORKFORCE OPERATIONS
// Server-Side Page Auth & Role Guard
// ==============================================================================

require_once __DIR__ . '/../backend/config/auth.php';

/**
 * Enforces authentication on server-rendered HTML/PHP pages.
 * If unauthenticated, redirects to the login page.
 *
 * @return array The authenticated user session array.
 */
function requirePageAuth(): array {
    startSession();
    $user = getAuthenticatedUser();
    if (!$user) {
        $loginUrl = '/pages/login.php';
        header('Location: ' . $loginUrl);
        exit;
    }
    return $user;
}

/**
 * Enforces specific role(s) on server-rendered HTML/PHP pages.
 * If unauthenticated, redirects to login.
 * If unauthorized, redirects to the user's role-appropriate home dashboard.
 *
 * @param string ...$roles Allowed roles (e.g. 'admin', 'supervisor', 'guard')
 * @return array The authenticated user session array.
 */
function requirePageRole(string ...$roles): array {
    $user = requirePageAuth();
    $currentRole = $user['role'] ?? '';

    if (!in_array($currentRole, $roles, true)) {
        $destination = match ($currentRole) {
            'admin' => '/pages/admin/dashboard.php',
            'supervisor' => '/pages/supervisor/dashboard.php',
            'guard' => '/pages/guard/dashboard.php',
            default => '/pages/login.php'
        };
        header('Location: ' . $destination);
        exit;
    }

    return $user;
}

/**
 * Helper to redirect authenticated users away from public pages (e.g. login).
 */
function redirectIfAuthenticated(): void {
    startSession();
    $user = getAuthenticatedUser();
    if ($user) {
        $destination = match ($user['role'] ?? '') {
            'admin' => '/pages/admin/dashboard.php',
            'supervisor' => '/pages/supervisor/dashboard.php',
            'guard' => '/pages/guard/dashboard.php',
            default => '/pages/login.php'
        };
        header('Location: ' . $destination);
        exit;
    }
}