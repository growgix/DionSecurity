<?php
require_once __DIR__ . '/../config/database.php';

class VisitorController {
    public static function getVisitors(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, name, avatar, phone, category, host_resident AS hostResident,
                   host_unit AS hostUnit, vehicle_number AS vehicleNumber, purpose,
                   gate, guard_id AS guardId, entry_time AS entryTime,
                   exit_time AS exitTime, duration, badge_number AS badgeNumber,
                   status, pre_approved AS preApproved, arrival_code AS arrivalCode
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

        $id = $input['id'] ?? ('VIS-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)));
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

        $user = function_exists('getAuthenticatedUser') ? getAuthenticatedUser() : null;
        $actor = ($user && !empty($user['name'])) ? $user['name'] . ' (' . ucfirst($user['role'] ?? 'Guard') . ')' : 'Officer C. Miller (Gate Guard)';
        $guardName = ($user && !empty($user['name'])) ? $user['name'] : ($input['guard'] ?? 'Officer C. Miller');
        $gateName = $input['gate'] ?? 'Gate 01';

        try {
            $pdo->beginTransaction();

            // 1. Insert into visitors table
            $stmt = $pdo->prepare('
                INSERT INTO visitors (id, name, avatar, phone, category, host_resident, host_unit, vehicle_number, purpose, gate, guard_id, entry_time, exit_time, duration, badge_number, status, pre_approved)
                VALUES (:id, :name, :avatar, :phone, :category, :host_resident, :host_unit, :vehicle_number, :purpose, :gate, :guard_id, :entry_time, :exit_time, :duration, :badge_number, :status, :pre_approved)
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
                ':gate' => $gateName,
                ':guard_id' => $input['guardId'] ?? ($user['id'] ?? 'GRD-1044'),
                ':entry_time' => $timeString,
                ':exit_time' => '—',
                ':duration' => 'Just now',
                ':badge_number' => $badgeNumber,
                ':status' => 'inside',
                ':pre_approved' => !empty($input['preApproved']) ? 1 : 0
            ]);

            // 2. Insert into gate_logs table automatically
            $stmtLog = $pdo->prepare('
                INSERT INTO gate_logs (id, timestamp, type, person, category, destination, vehicle, gate, guard, status)
                VALUES (:id, :timestamp, :type, :person, :category, :destination, :vehicle, :gate, :guard, :status)
            ');
            $stmtLog->execute([
                ':id' => 'LOG-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)),
                ':timestamp' => $timeString,
                ':type' => 'ENTRY',
                ':person' => $input['name'],
                ':category' => $category,
                ':destination' => $input['hostUnit'] ?? 'A-101',
                ':vehicle' => $input['vehicleNumber'] ?? 'Walk-in',
                ':gate' => $gateName,
                ':guard' => $guardName,
                ':status' => 'Cleared'
            ]);

            // 3. Insert audit log
            $stmtAudit = $pdo->prepare('
                INSERT INTO audit_logs (id, timestamp, actor, action, details, ip)
                VALUES (:id, :timestamp, :actor, :action, :details, :ip)
            ');
            $stmtAudit->execute([
                ':id' => 'AUD-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)),
                ':timestamp' => date('h:i:s A'),
                ':actor' => $actor,
                ':action' => 'VISITOR_CHECKIN',
                ':details' => "Authorized entry for {$input['name']} ({$category}) to Unit " . ($input['hostUnit'] ?? 'A-101') . ". Pass #{$badgeNumber}.",
                ':ip' => $_SERVER['REMOTE_ADDR'] ?? '10.0.1.41 (Gate 01)'
            ]);

            // 4. Fetch the newly created visitor before commit
            $stmtSelect = $pdo->prepare('
                SELECT id, name, avatar, phone, category, host_resident AS hostResident,
                       host_unit AS hostUnit, vehicle_number AS vehicleNumber, purpose,
                       gate, guard_id AS guardId, entry_time AS entryTime,
                       exit_time AS exitTime, duration, badge_number AS badgeNumber,
                       status, pre_approved AS preApproved
                FROM visitors
                WHERE id = :id
            ');
            $stmtSelect->execute([':id' => $id]);
            $visitor = $stmtSelect->fetch();
            if ($visitor) {
                $visitor['preApproved'] = (bool)$visitor['preApproved'];
            }

            $pdo->commit();

            echo json_encode(['success' => true, 'data' => $visitor]);
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Visitor registration failed: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to register visitor']);
        }
    }

    public static function checkoutVisitor(string $id): void {
        $timeString = date('h:i A');
        $pdo = Database::getConnection();

        $user = function_exists('getAuthenticatedUser') ? getAuthenticatedUser() : null;
        $actor = ($user && !empty($user['name'])) ? $user['name'] . ' (' . ucfirst($user['role'] ?? 'Guard') . ')' : 'Officer C. Miller (Gate Guard)';
        $guardName = ($user && !empty($user['name'])) ? $user['name'] : 'Officer C. Miller';

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare('
                UPDATE visitors
                SET status = \'exited\',
                    exit_time = :exit_time,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :id OR badge_number = :badge
            ');

            $stmt->execute([
                ':id' => $id,
                ':badge' => $id,
                ':exit_time' => $timeString
            ]);

            $stmtSelect = $pdo->prepare('
                SELECT id, name, avatar, phone, category, host_resident AS hostResident,
                       host_unit AS hostUnit, vehicle_number AS vehicleNumber, purpose,
                       gate, guard_id AS guardId, entry_time AS entryTime,
                       exit_time AS exitTime, duration, badge_number AS badgeNumber,
                       status, pre_approved AS preApproved
                FROM visitors
                WHERE id = :id OR badge_number = :badge
            ');
            $stmtSelect->execute([':id' => $id, ':badge' => $id]);
            $visitor = $stmtSelect->fetch();

            if (!$visitor) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Visitor not found']);
                return;
            }

            $visitor['preApproved'] = (bool)$visitor['preApproved'];

            // 1. Insert exit gate log
            $stmtLog = $pdo->prepare('
                INSERT INTO gate_logs (id, timestamp, type, person, category, destination, vehicle, gate, guard, status)
                VALUES (:id, :timestamp, :type, :person, :category, :destination, :vehicle, :gate, :guard, :status)
            ');
            $stmtLog->execute([
                ':id' => 'LOG-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)),
                ':timestamp' => $timeString,
                ':type' => 'EXIT',
                ':person' => $visitor['name'],
                ':category' => $visitor['category'],
                ':destination' => $visitor['hostUnit'],
                ':vehicle' => $visitor['vehicleNumber'],
                ':gate' => $visitor['gate'],
                ':guard' => $guardName,
                ':status' => 'Pass Surrendered'
            ]);

            // 2. Insert audit log
            $stmtAudit = $pdo->prepare('
                INSERT INTO audit_logs (id, timestamp, actor, action, details, ip)
                VALUES (:id, :timestamp, :actor, :action, :details, :ip)
            ');
            $stmtAudit->execute([
                ':id' => 'AUD-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)),
                ':timestamp' => date('h:i:s A'),
                ':actor' => $actor,
                ':action' => 'VISITOR_CHECKOUT',
                ':details' => "Visitor departure processed for {$visitor['name']} ({$visitor['category']}). Badge #{$visitor['badgeNumber']} surrendered.",
                ':ip' => $_SERVER['REMOTE_ADDR'] ?? '10.0.1.41 (Gate 01)'
            ]);

            $pdo->commit();

            echo json_encode(['success' => true, 'data' => $visitor]);
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Visitor checkout failed: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to checkout visitor']);
        }
    }
}
