<?php
require_once __DIR__ . '/../config/database.php';

class GateLogController {
    public static function getGateLogs(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, timestamp, type, person, category, destination, vehicle, gate, guard, status
            FROM gate_logs
            ORDER BY created_at DESC
        ');
        $logs = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $logs]);
    }

    public static function createGateLog(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['person'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Person name is required']);
            return;
        }

        $type = strtoupper($input['type'] ?? 'ENTRY');
        if (!in_array($type, ['ENTRY', 'EXIT'], true)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid gate log type. Allowed: ENTRY, EXIT']);
            return;
        }

        $pdo = Database::getConnection();
        $id = $input['id'] ?? ('LOG-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)));

        try {
            $stmt = $pdo->prepare('
                INSERT INTO gate_logs (id, timestamp, type, person, category, destination, vehicle, gate, guard, status)
                VALUES (:id, :timestamp, :type, :person, :category, :destination, :vehicle, :gate, :guard, :status)
            ');

            $stmt->execute([
                ':id' => $id,
                ':timestamp' => $input['timestamp'] ?? date('h:i A'),
                ':type' => $type,
                ':person' => $input['person'] ?? 'Unknown Person',
                ':category' => $input['category'] ?? 'General',
                ':destination' => $input['destination'] ?? 'Main Gate',
                ':vehicle' => $input['vehicle'] ?? 'Walk-in',
                ':gate' => $input['gate'] ?? 'Gate 01',
                ':guard' => $input['guard'] ?? 'Officer C. Miller',
                ':status' => $input['status'] ?? 'Cleared'
            ]);

            $stmtSelect = $pdo->prepare('
                SELECT id, timestamp, type, person, category, destination, vehicle, gate, guard, status
                FROM gate_logs
                WHERE id = :id
            ');
            $stmtSelect->execute([':id' => $id]);
            $log = $stmtSelect->fetch();

            echo json_encode(['success' => true, 'data' => $log]);
        } catch (Throwable $e) {
            error_log('Failed to create gate log: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create gate log']);
        }
    }
}
