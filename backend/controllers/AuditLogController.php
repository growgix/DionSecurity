<?php
require_once __DIR__ . '/../config/database.php';

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

        $id = 'AUD-' . rand(1000, 9999);
        $timeString = date('h:i:s A');

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO audit_logs (id, timestamp, actor, action, details, ip)
            VALUES (:id, :timestamp, :actor, :action, :details, :ip)
            RETURNING id, timestamp, actor, action, details, ip
        ');

        $stmt->execute([
            ':id' => $id,
            ':timestamp' => $timeString,
            ':actor' => $input['actor'] ?? 'System Operator',
            ':action' => $input['action'],
            ':details' => $input['details'] ?? 'System audit event',
            ':ip' => $_SERVER['REMOTE_ADDR'] ?? '10.0.1.44 (Active Session)'
        ]);

        $log = $stmt->fetch();
        echo json_encode(['success' => true, 'data' => $log]);
    }
}
