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
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('
            INSERT INTO gate_logs (id, timestamp, type, person, category, destination, vehicle, gate, guard, status)
            VALUES (:id, :timestamp, :type, :person, :category, :destination, :vehicle, :gate, :guard, :status)
            RETURNING id, timestamp, type, person, category, destination, vehicle, gate, guard, status
        ');

        $stmt->execute([
            ':id' => 'LOG-' . rand(8000, 9999),
            ':timestamp' => date('h:i A'),
            ':type' => $input['type'] ?? 'ENTRY',
            ':person' => $input['person'] ?? 'Unknown Person',
            ':category' => $input['category'] ?? 'General',
            ':destination' => $input['destination'] ?? 'Main Gate',
            ':vehicle' => $input['vehicle'] ?? 'Walk-in',
            ':gate' => $input['gate'] ?? 'Gate 01',
            ':guard' => $input['guard'] ?? 'Officer C. Miller',
            ':status' => $input['status'] ?? 'Cleared'
        ]);

        $log = $stmt->fetch();
        echo json_encode(['success' => true, 'data' => $log]);
    }
}
