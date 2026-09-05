<?php
require_once __DIR__ . '/../config/database.php';

class PaymentController {
    public static function getPayments(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, reference_no AS referenceNo, employee_id AS employeeId,
                   employee_name AS employeeName, amount, type, mode,
                   payment_date AS paymentDate, status, remarks
            FROM payments
            ORDER BY created_at DESC
        ');
        $payments = $stmt->fetchAll();

        foreach ($payments as &$p) {
            $p['amount'] = (float)$p['amount'];
        }

        echo json_encode(['success' => true, 'data' => $payments]);
    }

    public static function createPayment(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['employeeName']) || !isset($input['amount'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Employee and amount are required']);
            return;
        }

        if (!is_numeric($input['amount']) || floatval($input['amount']) <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Amount must be a positive number']);
            return;
        }

        $allowedTypes = ['Monthly Salary', 'Wage Advance', 'Overtime Allowance', 'Festival Bonus'];
        $type = $input['type'] ?? 'Monthly Salary';
        if (!in_array($type, $allowedTypes, true)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid payment type. Allowed: ' . implode(', ', $allowedTypes)]);
            return;
        }

        $id = $input['id'] ?? ('PAY-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)));
        $refNo = 'VCH-' . date('Y') . '-' . str_pad((string)rand(900, 9999), 4, '0', STR_PAD_LEFT);
        $dateStr = date('M d, Y');

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO payments (id, reference_no, employee_id, employee_name, amount, type, mode, payment_date, status, remarks)
            VALUES (:id, :reference_no, :employee_id, :employee_name, :amount, :type, :mode, :payment_date, :status, :remarks)
        ');

        $stmt->execute([
            ':id' => $id,
            ':reference_no' => $refNo,
            ':employee_id' => $input['employeeId'] ?? 'WRK-1001',
            ':employee_name' => $input['employeeName'],
            ':amount' => $input['amount'],
            ':type' => $input['type'] ?? 'Monthly Salary',
            ':mode' => $input['mode'] ?? 'NEFT / Direct Bank',
            ':payment_date' => $dateStr,
            ':status' => 'paid',
            ':remarks' => $input['remarks'] ?? 'Wage disbursement processed'
        ]);

        $stmtSelect = $pdo->prepare('
            SELECT id, reference_no AS referenceNo, employee_id AS employeeId,
                   employee_name AS employeeName, amount, type, mode,
                   payment_date AS paymentDate, status, remarks
            FROM payments
            WHERE id = :id
        ');
        $stmtSelect->execute([':id' => $id]);
        $created = $stmtSelect->fetch();

        if ($created) {
            $created['amount'] = (float)$created['amount'];
        }

        echo json_encode(['success' => true, 'data' => $created]);
    }
}
