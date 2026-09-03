<?php
require_once __DIR__ . '/../config/database.php';

class FamilyController {
    public static function getFamilyMembers(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, resident_id AS "residentId", resident_name AS "residentName",
                   unit_number AS "unitNumber", name, relation, phone, rfid_tag AS "rfidTag", status
            FROM family_members
            ORDER BY unit_number ASC
        ');
        $members = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $members]);
    }

    public static function createFamilyMember(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['name']) || empty($input['unitNumber'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Member name and unit number are required']);
            return;
        }

        $id = 'FAM-' . str_pad((string)rand(10, 999), 3, '0', STR_PAD_LEFT);
        $rfid = 'RFID-' . rand(50000, 99999) . '-D';

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO family_members (id, resident_id, resident_name, unit_number, name, relation, phone, rfid_tag, status)
            VALUES (:id, :resident_id, :resident_name, :unit_number, :name, :relation, :phone, :rfid_tag, :status)
            RETURNING id, resident_id AS "residentId", resident_name AS "residentName",
                      unit_number AS "unitNumber", name, relation, phone, rfid_tag AS "rfidTag", status
        ');

        $stmt->execute([
            ':id' => $id,
            ':resident_id' => $input['residentId'] ?? 'RES-001',
            ':resident_name' => $input['residentName'] ?? 'Resident Host',
            ':unit_number' => $input['unitNumber'],
            ':name' => $input['name'],
            ':relation' => $input['relation'] ?? 'Spouse',
            ':phone' => $input['phone'] ?? '+91 98000 00000',
            ':rfid_tag' => $rfid,
            ':status' => 'active'
        ]);

        $created = $stmt->fetch();
        echo json_encode(['success' => true, 'data' => $created]);
    }
}
