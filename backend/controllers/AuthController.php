<?php
require_once __DIR__ . '/../config/database.php';

class AuthController {
    public static function getUsers(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('SELECT id, name, email, role, station, status, last_login AS "lastLogin", avatar, phone FROM users ORDER BY id ASC');
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

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO users (id, name, email, role, station, status, last_login, avatar, phone)
            VALUES (:id, :name, :email, :role, :station, :status, :last_login, :avatar, :phone)
            RETURNING id, name, email, role, station, status, last_login AS "lastLogin", avatar, phone
        ');

        $stmt->execute([
            ':id' => $id,
            ':name' => $input['name'],
            ':email' => $input['email'],
            ':role' => $input['role'],
            ':station' => $input['station'] ?? 'Main Gate 01',
            ':status' => 'active',
            ':last_login' => 'Just now',
            ':avatar' => $avatar,
            ':phone' => $input['phone'] ?? '+91 98000 00000'
        ]);

        $created = $stmt->fetch();
        echo json_encode(['success' => true, 'data' => $created]);
    }
}
