<?php
require_once __DIR__ . '/../config/database.php';

class VisitorController {
    public static function getVisitors(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, name, avatar, phone, category, host_resident AS "hostResident",
                   host_unit AS "hostUnit", vehicle_number AS "vehicleNumber", purpose,
                   gate, guard_id AS "guardId", entry_time AS "entryTime",
                   exit_time AS "exitTime", duration, badge_number AS "badgeNumber",
                   status, pre_approved AS "preApproved", arrival_code AS "arrivalCode"
            FROM visitors
            ORDER BY created_at DESC
        ');
        $visitors = $stmt->fetchAll();
        foreach ($visitors as &$v) {
            $v['preApproved'] = (bool)$v['preApproved'];
        }
        echo json_encode(['success' => true, 'data' => $visitors]);
    }

    public static function registerVisitor(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Visitor name is required']);
            return;
        }

        $id = 'VIS-' . rand(9000, 9999);
        $timeString = date('h:i A');
        $category = $input['category'] ?? 'Guest / Family';

        $badgeNumber = 'G-' . rand(100, 999);
        if (strpos($category, 'Cab') !== false) {
            $badgeNumber = 'C-' . rand(200, 899);
        } elseif (strpos($category, 'Delivery') !== false || strpos($category, 'Food') !== false) {
            $badgeNumber = 'D-' . rand(500, 899);
        }

        $avatar = strtoupper(substr($input['name'], 0, 2));

        $pdo = Database::getConnection();

        // 1. Insert into visitors table
        $stmt = $pdo->prepare('
            INSERT INTO visitors (id, name, avatar, phone, category, host_resident, host_unit, vehicle_number, purpose, gate, guard_id, entry_time, exit_time, duration, badge_number, status, pre_approved)
            VALUES (:id, :name, :avatar, :phone, :category, :host_resident, :host_unit, :vehicle_number, :purpose, :gate, :guard_id, :entry_time, :exit_time, :duration, :badge_number, :status, :pre_approved)
            RETURNING id, name, avatar, phone, category, host_resident AS "hostResident",
                      host_unit AS "hostUnit", vehicle_number AS "vehicleNumber", purpose,
                      gate, guard_id AS "guardId", entry_time AS "entryTime",
                      exit_time AS "exitTime", duration, badge_number AS "badgeNumber",
                      status, pre_approved AS "preApproved"
        ');

        $stmt->execute([
            ':id' => $id,
            ':name' => $input['name'],
            ':avatar' => $avatar,
            ':phone' => $input['phone'] ?? '+91 98000 00000',
            ':category' => $category,
            ':host_resident' => $input['hostResident'] ?? 'Resident Host',
            ':host_unit' => $input['hostUnit'] ?? 'A-101',
            ':vehicle_number' => $input['vehicleNumber'] ?? 'Walk-in',
            ':purpose' => $input['purpose'] ?? 'General Visit',
            ':gate' => $input['gate'] ?? 'Gate 01',
            ':guard_id' => $input['guardId'] ?? 'GRD-1044',
            ':entry_time' => $timeString,
            ':exit_time' => '—',
            ':duration' => 'Just now',
            ':badge_number' => $badgeNumber,
            ':status' => 'inside',
            ':pre_approved' => !empty($input['preApproved'])
        ]);

        $visitor = $stmt->fetch();

        // 2. Insert into gate_logs table automatically
        $stmtLog = $pdo->prepare('
            INSERT INTO gate_logs (id, timestamp, type, person, category, destination, vehicle, gate, guard, status)
            VALUES (:id, :timestamp, :type, :person, :category, :destination, :vehicle, :gate, :guard, :status)
        ');
        $stmtLog->execute([
            ':id' => 'LOG-' . rand(8000, 9999),
            ':timestamp' => $timeString,
            ':type' => 'ENTRY',
            ':person' => $input['name'],
            ':category' => $category,
            ':destination' => $input['hostUnit'] ?? 'A-101',
            ':vehicle' => $input['vehicleNumber'] ?? 'Walk-in',
            ':gate' => $input['gate'] ?? 'Gate 01',
            ':guard' => 'Officer C. Miller',
            ':status' => 'Cleared'
        ]);

        // 3. Insert audit log
        $stmtAudit = $pdo->prepare('
            INSERT INTO audit_logs (id, timestamp, actor, action, details, ip)
            VALUES (:id, :timestamp, :actor, :action, :details, :ip)
        ');
        $stmtAudit->execute([
            ':id' => 'AUD-' . rand(1000, 9999),
            ':timestamp' => date('h:i:s A'),
            ':actor' => 'Officer C. Miller (Gate Guard)',
            ':action' => 'VISITOR_CHECKIN',
            ':details' => "Authorized entry for {$input['name']} ({$category}) to Unit " . ($input['hostUnit'] ?? 'A-101') . ". Pass #{$badgeNumber}.",
            ':ip' => '10.0.1.41 (Gate 01)'
        ]);

        echo json_encode(['success' => true, 'data' => $visitor]);
    }

    public static function checkoutVisitor(string $id): void {
        $timeString = date('h:i A');
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('
            UPDATE visitors
            SET status = \'exited\',
                exit_time = :exit_time,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id OR badge_number = :badge
            RETURNING id, name, avatar, phone, category, host_resident AS "hostResident",
                      host_unit AS "hostUnit", vehicle_number AS "vehicleNumber", purpose,
                      gate, guard_id AS "guardId", entry_time AS "entryTime",
                      exit_time AS "exitTime", duration, badge_number AS "badgeNumber",
                      status, pre_approved AS "preApproved"
        ');

        $stmt->execute([
            ':id' => $id,
            ':badge' => $id,
            ':exit_time' => $timeString
        ]);

        $visitor = $stmt->fetch();

        if ($visitor) {
            // Insert exit log
            $stmtLog = $pdo->prepare('
                INSERT INTO gate_logs (id, timestamp, type, person, category, destination, vehicle, gate, guard, status)
                VALUES (:id, :timestamp, :type, :person, :category, :destination, :vehicle, :gate, :guard, :status)
            ');
            $stmtLog->execute([
                ':id' => 'LOG-' . rand(8000, 9999),
                ':timestamp' => $timeString,
                ':type' => 'EXIT',
                ':person' => $visitor['name'],
                ':category' => $visitor['category'],
                ':destination' => $visitor['hostUnit'],
                ':vehicle' => $visitor['vehicleNumber'],
                ':gate' => $visitor['gate'],
                ':guard' => 'Officer C. Miller',
                ':status' => 'Pass Surrendered'
            ]);
        }

        echo json_encode(['success' => true, 'data' => $visitor]);
    }
}
