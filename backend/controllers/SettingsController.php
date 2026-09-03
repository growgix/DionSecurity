<?php
require_once __DIR__ . '/../config/database.php';

class SettingsController {
    public static function getSettings(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT society_name AS "societyName", address, emergency_contact AS "emergencyContact",
                   security_hotline AS "securityHotline", visitor_pass_expiry_hours AS "visitorPassExpiryHours",
                   require_resident_approval AS "requireResidentApproval", auto_gate_barrier AS "autoGateBarrier",
                   intercom_voip AS "intercomVoIP"
            FROM settings
            WHERE id = 1
        ');
        $settings = $stmt->fetch();

        if (!$settings) {
            $settings = [
                'societyName' => 'Dion Ventures Sector 4',
                'address' => 'Plot 104, Sovereign Parkway, Sector 4, Dion Enclave',
                'emergencyContact' => '+91 22 4900 8888',
                'securityHotline' => '+91 22 4900 9999',
                'visitorPassExpiryHours' => 12,
                'requireResidentApproval' => true,
                'autoGateBarrier' => true,
                'intercomVoIP' => true
            ];
        } else {
            $settings['visitorPassExpiryHours'] = (int)$settings['visitorPassExpiryHours'];
            $settings['requireResidentApproval'] = (bool)$settings['requireResidentApproval'];
            $settings['autoGateBarrier'] = (bool)$settings['autoGateBarrier'];
            $settings['intercomVoIP'] = (bool)$settings['intercomVoIP'];
        }

        echo json_encode(['success' => true, 'data' => $settings]);
    }

    public static function updateSettings(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('
            INSERT INTO settings (id, society_name, address, emergency_contact, security_hotline, visitor_pass_expiry_hours, require_resident_approval, auto_gate_barrier, intercom_voip)
            VALUES (1, :society_name, :address, :emergency_contact, :security_hotline, :visitor_pass_expiry_hours, :require_resident_approval, :auto_gate_barrier, :intercom_voip)
            ON CONFLICT (id) DO UPDATE SET
                society_name = EXCLUDED.society_name,
                address = EXCLUDED.address,
                emergency_contact = EXCLUDED.emergency_contact,
                security_hotline = EXCLUDED.security_hotline,
                visitor_pass_expiry_hours = EXCLUDED.visitor_pass_expiry_hours,
                require_resident_approval = EXCLUDED.require_resident_approval,
                auto_gate_barrier = EXCLUDED.auto_gate_barrier,
                intercom_voip = EXCLUDED.intercom_voip,
                updated_at = CURRENT_TIMESTAMP
            RETURNING society_name AS "societyName", address, emergency_contact AS "emergencyContact",
                      security_hotline AS "securityHotline", visitor_pass_expiry_hours AS "visitorPassExpiryHours",
                      require_resident_approval AS "requireResidentApproval", auto_gate_barrier AS "autoGateBarrier",
                      intercom_voip AS "intercomVoIP"
        ');

        $stmt->execute([
            ':society_name' => $input['societyName'] ?? 'Dion Ventures Sector 4',
            ':address' => $input['address'] ?? 'Plot 104, Sovereign Parkway, Sector 4, Dion Enclave',
            ':emergency_contact' => $input['emergencyContact'] ?? '+91 22 4900 8888',
            ':security_hotline' => $input['securityHotline'] ?? '+91 22 4900 9999',
            ':visitor_pass_expiry_hours' => $input['visitorPassExpiryHours'] ?? 12,
            ':require_resident_approval' => !empty($input['requireResidentApproval']) ? 1 : 0,
            ':auto_gate_barrier' => !empty($input['autoGateBarrier']) ? 1 : 0,
            ':intercom_voip' => !empty($input['intercomVoIP']) ? 1 : 0
        ]);

        $settings = $stmt->fetch();
        if ($settings) {
            $settings['visitorPassExpiryHours'] = (int)$settings['visitorPassExpiryHours'];
            $settings['requireResidentApproval'] = (bool)$settings['requireResidentApproval'];
            $settings['autoGateBarrier'] = (bool)$settings['autoGateBarrier'];
            $settings['intercomVoIP'] = (bool)$settings['intercomVoIP'];
        }

        echo json_encode(['success' => true, 'data' => $settings]);
    }
}
