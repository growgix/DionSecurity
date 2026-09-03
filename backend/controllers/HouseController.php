<?php
require_once __DIR__ . '/../config/database.php';

class HouseController {
    public static function getHouses(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, unit_number AS "unitNumber", block_id AS "blockId", block_name AS "blockName",
                   floor, type, resident_name AS "residentName", resident_phone AS "residentPhone",
                   parking_slot AS "parkingSlot", intercom, status, vehicles
            FROM houses
            ORDER BY unit_number ASC
        ');
        $houses = $stmt->fetchAll();

        foreach ($houses as &$h) {
            $h['vehicles'] = is_string($h['vehicles']) ? json_decode($h['vehicles'], true) : ($h['vehicles'] ?? []);
        }

        echo json_encode(['success' => true, 'data' => $houses]);
    }

    public static function getHouseById(string $id): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            SELECT id, unit_number AS "unitNumber", block_id AS "blockId", block_name AS "blockName",
                   floor, type, resident_name AS "residentName", resident_phone AS "residentPhone",
                   parking_slot AS "parkingSlot", intercom, status, vehicles
            FROM houses
            WHERE id = :id OR unit_number = :unit
        ');
        $stmt->execute([':id' => $id, ':unit' => $id]);
        $house = $stmt->fetch();

        if (!$house) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'House unit not found']);
            return;
        }

        $house['vehicles'] = is_string($house['vehicles']) ? json_decode($house['vehicles'], true) : ($house['vehicles'] ?? []);
        echo json_encode(['success' => true, 'data' => $house]);
    }

    public static function updateHouse(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('
            UPDATE houses
            SET resident_name = COALESCE(:resident_name, resident_name),
                resident_phone = COALESCE(:resident_phone, resident_phone),
                parking_slot = COALESCE(:parking_slot, parking_slot),
                status = COALESCE(:status, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id OR unit_number = :unit
            RETURNING id, unit_number AS "unitNumber", block_id AS "blockId", block_name AS "blockName",
                      floor, type, resident_name AS "residentName", resident_phone AS "residentPhone",
                      parking_slot AS "parkingSlot", intercom, status, vehicles
        ');

        $stmt->execute([
            ':id' => $id,
            ':unit' => $id,
            ':resident_name' => $input['residentName'] ?? null,
            ':resident_phone' => $input['residentPhone'] ?? null,
            ':parking_slot' => $input['parkingSlot'] ?? null,
            ':status' => $input['status'] ?? null
        ]);

        $house = $stmt->fetch();
        if ($house) {
            $house['vehicles'] = is_string($house['vehicles']) ? json_decode($house['vehicles'], true) : ($house['vehicles'] ?? []);
        }
        echo json_encode(['success' => true, 'data' => $house]);
    }
}
