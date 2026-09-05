<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

class AuthController {
    public static function getUsers(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('SELECT id, name, email, role, station, status, last_login AS lastLogin, avatar, phone FROM users ORDER BY id ASC');
        $users = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data' => $users
        ]);
    }

    public static function createUser(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['name']) || empty($input['email']) || empty($input['role'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name, email and role are required']);
            return;
        }

        $id = 'USR-' . strtoupper($input['role']) . '-' . str_pad((string)rand(10, 99), 2, '0', STR_PAD_LEFT);
        $avatar = strtoupper(substr($input['name'], 0, 2));
        $password = $input['password'] ?? 'password123';
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO users (id, name, email, password_hash, role, station, status, last_login, avatar, phone)
            VALUES (:id, :name, :email, :password_hash, :role, :station, :status, :last_login, :avatar, :phone)
        ');

        $stmt->execute([
            ':id' => $id,
            ':name' => $input['name'],
            ':email' => $input['email'],
            ':password_hash' => $passwordHash,
            ':role' => $input['role'],
            ':station' => $input['station'] ?? 'Main Gate 01',
            ':status' => 'active',
            ':last_login' => 'Just now',
            ':avatar' => $avatar,
            ':phone' => $input['phone'] ?? '+91 98000 00000'
        ]);

        $stmtSelect = $pdo->prepare('
            SELECT id, name, email, role, station, status, last_login AS lastLogin, avatar, phone
            FROM users
            WHERE id = :id
        ');
        $stmtSelect->execute([':id' => $id]);
        $created = $stmtSelect->fetch();

        echo json_encode(['success' => true, 'data' => $created]);
    }

    public static function login(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Email and password are required'
            ]);
            return;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            SELECT id, name, email, password_hash, role, station, status, last_login AS lastLogin, avatar, phone
            FROM users
            WHERE email = :email
        ');
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password'
            ]);
            return;
        }

        if ($user['status'] !== 'active') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Account is inactive or suspended'
            ]);
            return;
        }

        $hash = $user['password_hash'] ?? '';
        $isSeededPlaceholder = ($hash === '$2y$10$abcdefghijklmnopqrstuv');
        $valid = password_verify($password, $hash);

        // If seeded mock hash, permit verified persona demo credentials or standard dev password
        if (!$valid && $isSeededPlaceholder) {
            $valid = in_array($password, ['AdminPassword123!', 'SupervisorPassword123!', 'GuardPassword123!', 'Password123!', 'password123'], true);
        }

        if (!$valid) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password'
            ]);
            return;
        }

        // Initialize session and regenerate ID on successful authentication
        startSession();
        session_regenerate_id(true);

        $_SESSION['user'] = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'station' => $user['station'],
            'avatar' => $user['avatar'] ?? ''
        ];

        // Safely update last_login display string consistent with existing application
        try {
            $stmtUpdate = $pdo->prepare('UPDATE users SET last_login = :last_login, updated_at = NOW() WHERE id = :id');
            $stmtUpdate->execute([':last_login' => 'Just now', ':id' => $user['id']]);
        } catch (\Exception $e) {
            // Non-fatal if last_login update fails
        }

        // Generate fresh CSRF token for the authenticated session
        $csrfToken = generateCsrfToken();

        echo json_encode([
            'success' => true,
            'message' => 'Authentication successful',
            'data' => [
                'user' => $_SESSION['user']
            ],
            'csrfToken' => $csrfToken
        ]);
    }

    public static function logout(): void {
        startSession();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }
        session_destroy();

        echo json_encode([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public static function getCurrentUser(): void {
        $user = getAuthenticatedUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Not authenticated'
            ]);
            return;
        }

        $csrfToken = getCsrfToken();

        echo json_encode([
            'success' => true,
            'data' => $user,
            'csrfToken' => $csrfToken
        ]);
    }
}
