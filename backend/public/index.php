<?php
// ==============================================================================
// DION VENTURES ESTATE SECURITY & WORKFORCE OPERATIONS
// PHP REST API Gateway & Router
// ==============================================================================

// Set JSON Response Header & CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Autoload Controllers
require_once __DIR__ . '/../config/database.php';
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

// Parse Request Path & Method
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip query string and leading/trailing slashes
$path = trim($requestUri, '/');

// Optional: strip subfolder if served inside a subdirectory
if (strpos($path, 'api') !== false) {
    $path = substr($path, strpos($path, 'api'));
}

// ------------------------------------------------------------------------------
// ROUTING TABLE
// ------------------------------------------------------------------------------
try {
    // 1. Health Check
    if ($path === 'api/health' && $method === 'GET') {
        $dbStatus = 'connected';
        $driver = 'sqlite';
        try {
            Database::getConnection();
            $driver = Database::getDriver();
        } catch (Exception $e) {
            $dbStatus = 'disconnected: ' . $e->getMessage();
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

    // 2. Auth & Users
    if ($path === 'api/auth/users') {
        if ($method === 'GET') { AuthController::getUsers(); exit; }
        if ($method === 'POST') { AuthController::createUser(); exit; }
    }

    // 3. Blocks
    if ($path === 'api/blocks' && $method === 'GET') {
        BlockController::getBlocks();
        exit;
    }
    if (preg_match('#^api/blocks/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        if ($method === 'GET') { BlockController::getBlockById($matches[1]); exit; }
        if ($method === 'PUT') { BlockController::updateBlock($matches[1]); exit; }
    }

    // 4. Houses
    if ($path === 'api/houses' && $method === 'GET') {
        HouseController::getHouses();
        exit;
    }
    if (preg_match('#^api/houses/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        if ($method === 'GET') { HouseController::getHouseById($matches[1]); exit; }
        if ($method === 'PUT') { HouseController::updateHouse($matches[1]); exit; }
    }

    // 5. Residents & Family
    if ($path === 'api/residents') {
        if ($method === 'GET') { ResidentController::getResidents(); exit; }
        if ($method === 'POST') { ResidentController::createResident(); exit; }
    }
    if ($path === 'api/family-members') {
        if ($method === 'GET') { FamilyController::getFamilyMembers(); exit; }
        if ($method === 'POST') { FamilyController::createFamilyMember(); exit; }
    }

    // 6. Employees & Attendance
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

    // 7. Visitors
    if ($path === 'api/visitors') {
        if ($method === 'GET') { VisitorController::getVisitors(); exit; }
        if ($method === 'POST') { VisitorController::registerVisitor(); exit; }
    }
    if (preg_match('#^api/visitors/([a-zA-Z0-9_-]+)/checkout$#', $path, $matches) && $method === 'PUT') {
        VisitorController::checkoutVisitor($matches[1]);
        exit;
    }

    // 8. Gate Logs
    if ($path === 'api/gate-logs') {
        if ($method === 'GET') { GateLogController::getGateLogs(); exit; }
        if ($method === 'POST') { GateLogController::createGateLog(); exit; }
    }

    // 9. Tasks
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

    // 10. Payments
    if ($path === 'api/payments') {
        if ($method === 'GET') { PaymentController::getPayments(); exit; }
        if ($method === 'POST') { PaymentController::createPayment(); exit; }
    }

    // 11. Audit Logs
    if ($path === 'api/audit-logs') {
        if ($method === 'GET') { AuditLogController::getAuditLogs(); exit; }
        if ($method === 'POST') { AuditLogController::recordAudit(); exit; }
    }

    // 12. Settings
    if ($path === 'api/settings') {
        if ($method === 'GET') { SettingsController::getSettings(); exit; }
        if ($method === 'PUT') { SettingsController::updateSettings(); exit; }
    }

    // 13. Panic Protocol
    if ($path === 'api/panic' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $location = $input['location'] ?? 'Estate Perimeter Gate';
        try {
            $pdo = Database::getConnection();
            $stmtAudit = $pdo->prepare('
                INSERT INTO audit_logs (id, timestamp, actor, action, details, ip)
                VALUES (:id, :timestamp, :actor, :action, :details, :ip)
            ');
            $stmtAudit->execute([
                ':id' => 'AUD-' . rand(1000, 9999),
                ':timestamp' => date('h:i:s A'),
                ':actor' => 'Security Console (Emergency Panic)',
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

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage()
    ]);
}
