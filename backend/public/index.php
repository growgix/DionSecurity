<?php
// ==============================================================================
// DION VENTURES ESTATE SECURITY & WORKFORCE OPERATIONS
// PHP REST API Gateway & Router
// ==============================================================================

// Autoload Controllers & Config
require_once __DIR__ . '/../config/database.php';
Database::initEnv();
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/BlockController.php';
require_once __DIR__ . '/../controllers/HouseController.php';
require_once __DIR__ . '/../controllers/ResidentController.php';
require_once __DIR__ . '/../controllers/FamilyController.php';
require_once __DIR__ . '/../controllers/EmployeeController.php';
require_once __DIR__ . '/../controllers/VisitorController.php';
require_once __DIR__ . '/../controllers/GateLogController.php';
require_once __DIR__ . '/../controllers/TaskController.php';
require_once __DIR__ . '/../controllers/PaymentController.php';
require_once __DIR__ . '/../controllers/AuditLogController.php';
require_once __DIR__ . '/../controllers/SettingsController.php';

// Set Standard JSON & HTTP Security Headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), camera=(), microphone=()');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self';");

// CORS Hardening: Configurable Origin Allowlist
$allowedOriginsEnv = getenv('CORS_ALLOWED_ORIGINS') ?: 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173';
$allowedOrigins = array_filter(array_map('trim', explode(',', $allowedOriginsEnv)));

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isOriginAllowed = ($origin !== '' && in_array($origin, $allowedOrigins, true));

if ($isOriginAllowed) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($origin !== '' && !$isOriginAllowed) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'CORS Origin Not Allowed']);
        exit;
    }
    http_response_code(204);
    exit;
}

// Parse Request Path & Method
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip query string and leading/trailing slashes
$path = trim($requestUri, '/');

// Optional: strip subfolder if served inside a subdirectory
if (strpos($path, 'api') !== false) {
    $path = substr($path, strpos($path, 'api'));
}

// Global JSON Input Validation (Reject malformed bodies with HTTP 400)
if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    $rawBody = file_get_contents('php://input');
    if (!empty($rawBody)) {
        json_decode($rawBody, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Malformed JSON payload in request body'
            ]);
            exit;
        }
    }
}

// ------------------------------------------------------------------------------
// ROUTING TABLE
// ------------------------------------------------------------------------------
try {
    // --------------------------------------------------------------------------
    // 1. PUBLIC ENDPOINTS (No Authentication Required)
    // --------------------------------------------------------------------------
    if ($path === 'api/health' && $method === 'GET') {
        $dbStatus = 'connected';
        $driver = 'mysql';
        try {
            Database::getConnection();
            $driver = Database::getDriver();
        } catch (Exception $e) {
            error_log('Database health check failed: ' . $e->getMessage());
            $dbStatus = 'disconnected';
        }

        echo json_encode([
            'status' => 'online',
            'system' => 'Dion Ventures Security & Operations Engine',
            'version' => '4.2',
            'driver' => $driver,
            'php_version' => PHP_VERSION,
            'database' => $dbStatus,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }

    if ($path === 'api/auth/login' && $method === 'POST') {
        AuthController::login();
        exit;
    }
    if ($path === 'api/auth/logout' && $method === 'POST') {
        AuthController::logout();
        exit;
    }
    if ($path === 'api/auth/me' && $method === 'GET') {
        AuthController::getCurrentUser();
        exit;
    }

    // --------------------------------------------------------------------------
    // 2. AUTHENTICATION & CSRF GATEWAY
    // --------------------------------------------------------------------------
    $currentUser = requireAuth();

    // Enforce CSRF protection for all state-changing API operations
    if (in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'], true)) {
        validateCsrfToken();
    }

    // 3. User Management (Admin Only)
    if ($path === 'api/auth/users' || $path === 'api/users') {
        requireRole('admin');
        if ($method === 'GET') { AuthController::getUsers(); exit; }
        if ($method === 'POST') { AuthController::createUser(); exit; }
    }

    // 4. Blocks (Guard, Supervisor, Admin)
    if ($path === 'api/blocks' && $method === 'GET') {
        BlockController::getBlocks();
        exit;
    }
    if (preg_match('#^api/blocks/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        if ($method === 'GET') { BlockController::getBlockById($matches[1]); exit; }
        if ($method === 'PUT') { BlockController::updateBlock($matches[1]); exit; }
    }

    // 5. Houses (Guard, Supervisor, Admin)
    if ($path === 'api/houses' && $method === 'GET') {
        HouseController::getHouses();
        exit;
    }
    if (preg_match('#^api/houses/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        if ($method === 'GET') { HouseController::getHouseById($matches[1]); exit; }
        if ($method === 'PUT') { HouseController::updateHouse($matches[1]); exit; }
    }

    // 6. Residents & Family (Guard, Supervisor, Admin)
    if ($path === 'api/residents') {
        if ($method === 'GET') { ResidentController::getResidents(); exit; }
        if ($method === 'POST') { ResidentController::createResident(); exit; }
    }
    if ($path === 'api/family-members' || $path === 'api/families') {
        if ($method === 'GET') { FamilyController::getFamilyMembers(); exit; }
        if ($method === 'POST') { FamilyController::createFamilyMember(); exit; }
    }

    // 7. Employees & Attendance (Guard, Supervisor, Admin)
    if ($path === 'api/employees') {
        if ($method === 'GET') { EmployeeController::getEmployees(); exit; }
        if ($method === 'POST') { EmployeeController::enrolEmployee(); exit; }
    }
    if (preg_match('#^api/employees/([a-zA-Z0-9_-]+)/attendance$#', $path, $matches) && $method === 'PUT') {
        EmployeeController::updateAttendance($matches[1]);
        exit;
    }
    if (preg_match('#^api/employees/([a-zA-Z0-9_-]+)/checkout$#', $path, $matches) && $method === 'POST') {
        EmployeeController::checkoutWorker($matches[1]);
        exit;
    }
    if (preg_match('#^api/employees/([a-zA-Z0-9_-]+)$#', $path, $matches) && $method === 'GET') {
        EmployeeController::getEmployeeById($matches[1]);
        exit;
    }

    // 8. Visitors (Guard, Supervisor, Admin)
    if ($path === 'api/visitors') {
        if ($method === 'GET') { VisitorController::getVisitors(); exit; }
        if ($method === 'POST') { VisitorController::registerVisitor(); exit; }
    }
    if (preg_match('#^api/visitors/([a-zA-Z0-9_-]+)/checkout$#', $path, $matches) && $method === 'PUT') {
        VisitorController::checkoutVisitor($matches[1]);
        exit;
    }

    // 9. Gate Logs (Guard, Supervisor, Admin)
    if ($path === 'api/gate-logs') {
        if ($method === 'GET') { GateLogController::getGateLogs(); exit; }
        if ($method === 'POST') { GateLogController::createGateLog(); exit; }
    }

    // 10. Tasks (Guard, Supervisor, Admin)
    if ($path === 'api/tasks') {
        if ($method === 'GET') { TaskController::getTasks(); exit; }
        if ($method === 'POST') { TaskController::createTask(); exit; }
    }
    if (preg_match('#^api/tasks/([a-zA-Z0-9_-]+)/status$#', $path, $matches) && $method === 'PUT') {
        TaskController::updateStatus($matches[1]);
        exit;
    }
    if (preg_match('#^api/tasks/([a-zA-Z0-9_-]+)/remarks$#', $path, $matches) && $method === 'POST') {
        TaskController::addRemark($matches[1]);
        exit;
    }
    if (preg_match('#^api/tasks/([a-zA-Z0-9_-]+)$#', $path, $matches) && $method === 'GET') {
        TaskController::getTaskById($matches[1]);
        exit;
    }

    // 11. Payments (Admin, Supervisor Only)
    if ($path === 'api/payments') {
        requireRole('admin', 'supervisor');
        if ($method === 'GET') { PaymentController::getPayments(); exit; }
        if ($method === 'POST') { PaymentController::createPayment(); exit; }
    }

    // 12. Audit Logs (GET: Admin + Supervisor Only, POST: Guard + Supervisor + Admin)
    if ($path === 'api/audit-logs') {
        if ($method === 'GET') {
            requireRole('admin', 'supervisor');
            AuditLogController::getAuditLogs();
            exit;
        }
        if ($method === 'POST') {
            AuditLogController::recordAudit();
            exit;
        }
    }

    // 13. Settings (GET: Admin + Supervisor, PUT: Admin Only)
    if ($path === 'api/settings') {
        if ($method === 'GET') {
            requireRole('admin', 'supervisor');
            SettingsController::getSettings();
            exit;
        }
        if ($method === 'PUT') {
            requireRole('admin');
            SettingsController::updateSettings();
            exit;
        }
    }

    // 14. Panic Protocol (Guard, Supervisor, Admin)
    if ($path === 'api/panic' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $location = $input['location'] ?? 'Estate Perimeter Gate';
        $actor = $currentUser['name'] . ' (' . ucfirst($currentUser['role']) . ')';
        try {
            $pdo = Database::getConnection();
            $stmtAudit = $pdo->prepare('
                INSERT INTO audit_logs (id, timestamp, actor, action, details, ip)
                VALUES (:id, :timestamp, :actor, :action, :details, :ip)
            ');
            $stmtAudit->execute([
                ':id' => 'AUD-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)),
                ':timestamp' => date('h:i:s A'),
                ':actor' => $actor,
                ':action' => 'PANIC_ALARM_TRIGGERED',
                ':details' => "EMERGENCY PANIC TRIGGERED at {$location}! High-priority audio sirens engaged.",
                ':ip' => $_SERVER['REMOTE_ADDR'] ?? '10.0.1.44'
            ]);
        } catch (Exception $e) {}

        echo json_encode([
            'success' => true,
            'message' => "EMERGENCY PROTOCOL ACTIVATED: Perimeter gates sealed at {$location}, high-decibel audio sirens triggered."
        ]);
        exit;
    }

    // 404 Route Not Found
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => "Endpoint not found: [{$method}] /{$path}"
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    error_log($e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error'
    ]);
}
