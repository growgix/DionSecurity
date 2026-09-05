<?php
// ==============================================================================
// DION VENTURES ESTATE SECURITY & WORKFORCE OPERATIONS
// Server-Side Authentication & Session Helper
// ==============================================================================

/**
 * Initializes the PHP session safely with secure cookie parameters.
 */
function startSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.use_strict_mode', '1');
        ini_set('session.cookie_httponly', '1');
        ini_set('session.cookie_samesite', 'Lax');

        $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
               || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => '',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        session_start();
    }
}

/**
 * Generates and stores a cryptographically secure random CSRF token in the session.
 */
function generateCsrfToken(): string {
    startSession();
    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    return $token;
}

/**
 * Retrieves the current session CSRF token, or generates a new one if not present.
 */
function getCsrfToken(): string {
    startSession();
    if (empty($_SESSION['csrf_token'])) {
        return generateCsrfToken();
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validates the X-CSRF-Token header against the active session CSRF token.
 * Rejects missing or invalid tokens with HTTP 403 Forbidden.
 */
function validateCsrfToken(): void {
    startSession();
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    $receivedToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if ($sessionToken === '' || $receivedToken === '' || !hash_equals($sessionToken, $receivedToken)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden: Invalid or missing CSRF token'
        ]);
        exit;
    }
}

/**
 * Returns the currently authenticated session user, or null if unauthenticated.
 */
function getAuthenticatedUser(): ?array {
    startSession();
    return $_SESSION['user'] ?? null;
}

/**
 * Checks whether an authenticated session currently exists.
 */
function isAuthenticated(): bool {
    return getAuthenticatedUser() !== null;
}

/**
 * Enforces that an authenticated session exists. Terminates with HTTP 401 if not.
 */
function requireAuth(): array {
    $user = getAuthenticatedUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized: Authentication required'
        ]);
        exit;
    }
    return $user;
}

/**
 * Enforces that the authenticated user possesses one of the allowed roles.
 * Terminates with HTTP 403 if unauthorized.
 */
function requireRole(...$roles): array {
    $user = requireAuth();
    if (!in_array($user['role'] ?? '', $roles, true)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden: Insufficient privileges'
        ]);
        exit;
    }
    return $user;
}
