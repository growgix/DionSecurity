<?php
require_once __DIR__ . '/../config/database.php';

class PaymentController {
    public static function getPayments(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, reference_no AS "referenceNo", employee_id AS "employeeId",
                   employee_name AS "employeeName", amount, type, mode,
                   payment_date AS "paymentDate", status, remarks
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
        if (empty($input['employeeName']) || empty($input['amount'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Employee and amount are required']);
            return;
        }

        $id = 'PAY-' . rand(905, 999);
        $refNo = 'VCH-' . date('Y') . '-' . str_pad((string)rand(900, 9999), 4, '0', STR_PAD_LEFT);
        $dateStr = date('M d, Y');

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO payments (id, reference_no, employee_id, employee_name, amount, type, mode, payment_date, status, remarks)
            VALUES (:id, :reference_no, :employee_id, :employee_name, :amount, :type, :mode, :payment_date, :status, :remarks)
            RETURNING id, reference_no AS "referenceNo", employee_id AS "employeeId",
                      employee_name AS "employeeName", amount, type, mode,
                      payment_date AS "paymentDate", status, remarks
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

        $created = $stmt->fetch();
        if ($created) {
            $created['amount'] = (float)$created['amount'];
        }

        echo json_encode(['success' => true, 'data' => $created]);
    }
}
