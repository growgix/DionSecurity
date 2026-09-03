<?php
require_once __DIR__ . '/../config/database.php';

class ResidentController {
    public static function getResidents(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, name, unit_number AS "unitNumber", block_name AS "blockName",
                   category, phone, email, since, status, rfid_tag AS "rfidTag",
                   family_count AS "familyCount", vehicles, avatar
            FROM residents
            ORDER BY unit_number ASC
        ');
        $residents = $stmt->fetchAll();

        foreach ($residents as &$r) {
            $r['vehicles'] = is_string($r['vehicles']) ? json_decode($r['vehicles'], true) : ($r['vehicles'] ?? []);
        }

        echo json_encode(['success' => true, 'data' => $residents]);
    }

    public static function createResident(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['name']) || empty($input['unitNumber'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and unit number are required']);
            return;
        }

        $id = 'RES-' . str_pad((string)rand(10, 999), 3, '0', STR_PAD_LEFT);
        $rfid = 'RFID-' . rand(50000, 99999);
        $avatar = strtoupper(substr($input['name'], 0, 2));
        $blockName = 'Block ' . substr($input['unitNumber'], 0, 1);

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO residents (id, name, unit_number, block_name, category, phone, email, since, status, rfid_tag, family_count, vehicles, avatar)
            VALUES (:id, :name, :unit_number, :block_name, :category, :phone, :email, :since, :status, :rfid_tag, :family_count, :vehicles, :avatar)
            RETURNING id, name, unit_number AS "unitNumber", block_name AS "blockName",
                      category, phone, email, since, status, rfid_tag AS "rfidTag",
                      family_count AS "familyCount", vehicles, avatar
        ');

        $stmt->execute([
            ':id' => $id,
            ':name' => $input['name'],
            ':unit_number' => $input['unitNumber'],
            ':block_name' => $blockName,
            ':category' => $input['category'] ?? 'Owner',
            ':phone' => $input['phone'] ?? '+91 98000 00000',
            ':email' => $input['email'] ?? 'resident@example.com',
            ':since' => date('M Y'),
            ':status' => 'active',
            ':rfid_tag' => $rfid,
            ':family_count' => 1,
            ':vehicles' => json_encode($input['vehicles'] ?? []),
            ':avatar' => $avatar
        ]);

        $created = $stmt->fetch();
        if ($created) {
            $created['vehicles'] = is_string($created['vehicles']) ? json_decode($created['vehicles'], true) : ($created['vehicles'] ?? []);
        }

        // Also update the house unit to occupied with this resident
        $stmtHouse = $pdo->prepare('
            UPDATE houses
            SET resident_name = :name, resident_phone = :phone, status = \'occupied\'
            WHERE unit_number = :unit
        ');
        $stmtHouse->execute([
            ':name' => $input['name'],
            ':phone' => $input['phone'] ?? '+91 98000 00000',
            ':unit' => $input['unitNumber']
        ]);

        echo json_encode(['success' => true, 'data' => $created]);
    }
}
