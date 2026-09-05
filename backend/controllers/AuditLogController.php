<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

class AuditLogController {
    public static function getAuditLogs(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, timestamp, actor, action, details, ip
            FROM audit_logs
            ORDER BY created_at DESC
        ');
        $logs = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $logs]);
    }

    public static function recordAudit(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['action'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Action is required']);
            return;
        }

        // Require authentication and use server-side identity to prevent actor spoofing
        $user = requireAuth();
        $actor = $user['name'] . ' (' . ucfirst($user['role']) . ')';

        $id = $input['id'] ?? ('AUD-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)));
        $timeString = date('h:i:s A');

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO audit_logs (id, timestamp, actor, action, details, ip)
            VALUES (:id, :timestamp, :actor, :action, :details, :ip)
        ');

        $stmt->execute([
            ':id' => $id,
            ':timestamp' => $timeString,
            ':actor' => $actor,
            ':action' => $input['action'],
            ':details' => $input['details'] ?? 'System audit event',
            ':ip' => $_SERVER['REMOTE_ADDR'] ?? '10.0.1.44 (Active Session)'
        ]);

        $stmtSelect = $pdo->prepare('
            SELECT id, timestamp, actor, action, details, ip
            FROM audit_logs
            WHERE id = :id
        ');
        $stmtSelect->execute([':id' => $id]);
        $log = $stmtSelect->fetch();

        echo json_encode(['success' => true, 'data' => $log]);
    }
}
