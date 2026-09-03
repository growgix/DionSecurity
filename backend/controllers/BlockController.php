<?php
require_once __DIR__ . '/../config/database.php';

class BlockController {
    public static function getBlocks(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, name, floors, total_units AS "totalUnits", occupied_units AS "occupiedUnits",
                   security_officer AS "securityOfficer", status
            FROM blocks
            ORDER BY id ASC
        ');
        $blocks = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $blocks]);
    }

    public static function getBlockById(string $id): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            SELECT id, name, floors, total_units AS "totalUnits", occupied_units AS "occupiedUnits",
                   security_officer AS "securityOfficer", status
            FROM blocks
            WHERE id = :id
        ');
        $stmt->execute([':id' => $id]);
        $block = $stmt->fetch();

        if (!$block) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Block not found']);
            return;
        }

        echo json_encode(['success' => true, 'data' => $block]);
    }

    public static function updateBlock(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('
            UPDATE blocks
            SET name = COALESCE(:name, name),
                security_officer = COALESCE(:security_officer, security_officer),
                status = COALESCE(:status, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            RETURNING id, name, floors, total_units AS "totalUnits", occupied_units AS "occupiedUnits", security_officer AS "securityOfficer", status
        ');

        $stmt->execute([
            ':id' => $id,
            ':name' => $input['name'] ?? null,
            ':security_officer' => $input['securityOfficer'] ?? null,
            ':status' => $input['status'] ?? null
        ]);

        $updated = $stmt->fetch();
        echo json_encode(['success' => true, 'data' => $updated]);
    }
}
