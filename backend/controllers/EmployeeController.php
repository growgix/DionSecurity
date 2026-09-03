<?php
require_once __DIR__ . '/../config/database.php';

class EmployeeController {
    public static function getEmployees(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, name, badge_no AS "badgeNo", role, department, shift,
                   assigned_location AS "assignedLocation", status, daily_wage AS "dailyWage",
                   monthly_wage AS "monthlyWage", phone, aadhaar, rating,
                   tasks_completed AS "tasksCompleted", joining_date AS "joiningDate",
                   avatar, today_attendance AS "todayAttendance"
            FROM employees
            ORDER BY badge_no ASC
        ');
        $employees = $stmt->fetchAll();

        foreach ($employees as &$e) {
            $e['dailyWage'] = (float)$e['dailyWage'];
            $e['monthlyWage'] = (float)$e['monthlyWage'];
            $e['rating'] = (float)$e['rating'];
            $e['tasksCompleted'] = (int)$e['tasksCompleted'];
            $e['todayAttendance'] = is_string($e['todayAttendance']) ? json_decode($e['todayAttendance'], true) : ($e['todayAttendance'] ?? []);
        }

        echo json_encode(['success' => true, 'data' => $employees]);
    }

    public static function getEmployeeById(string $id): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            SELECT id, name, badge_no AS "badgeNo", role, department, shift,
                   assigned_location AS "assignedLocation", status, daily_wage AS "dailyWage",
                   monthly_wage AS "monthlyWage", phone, aadhaar, rating,
                   tasks_completed AS "tasksCompleted", joining_date AS "joiningDate",
                   avatar, today_attendance AS "todayAttendance"
            FROM employees
            WHERE id = :id OR badge_no = :badge
        ');
        $stmt->execute([':id' => $id, ':badge' => $id]);
        $employee = $stmt->fetch();

        if (!$employee) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Employee not found']);
            return;
        }

        $employee['dailyWage'] = (float)$employee['dailyWage'];
        $employee['monthlyWage'] = (float)$employee['monthlyWage'];
        $employee['rating'] = (float)$employee['rating'];
        $employee['tasksCompleted'] = (int)$employee['tasksCompleted'];
        $employee['todayAttendance'] = is_string($employee['todayAttendance']) ? json_decode($employee['todayAttendance'], true) : ($employee['todayAttendance'] ?? []);

        echo json_encode(['success' => true, 'data' => $employee]);
    }

    public static function updateAttendance(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = $input['status'] ?? 'present';
        $timeStr = date('h:i A');

        $pdo = Database::getConnection();

        // Get current attendance JSON
        $stmtGet = $pdo->prepare('SELECT today_attendance FROM employees WHERE id = :id OR badge_no = :badge');
        $stmtGet->execute([':id' => $id, ':badge' => $id]);
        $row = $stmtGet->fetch();

        $currAttendance = is_string($row['today_attendance'] ?? null)
            ? json_decode($row['today_attendance'], true)
            : ($row['today_attendance'] ?? []);

        $newAttendance = array_merge($currAttendance, [
            'status' => $status,
            'inTime' => ($status === 'absent' || $status === 'leave') ? '—' : ($currAttendance['inTime'] ?? $timeStr)
        ]);

        $stmt = $pdo->prepare('
            UPDATE employees
            SET status = :status,
                today_attendance = :today_attendance,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id OR badge_no = :badge
            RETURNING id, name, badge_no AS "badgeNo", role, department, shift,
                      assigned_location AS "assignedLocation", status, daily_wage AS "dailyWage",
                      monthly_wage AS "monthlyWage", phone, aadhaar, rating,
                      tasks_completed AS "tasksCompleted", joining_date AS "joiningDate",
                      avatar, today_attendance AS "todayAttendance"
        ');

        $stmt->execute([
            ':id' => $id,
            ':badge' => $id,
            ':status' => $status,
            ':today_attendance' => json_encode($newAttendance)
        ]);

        $emp = $stmt->fetch();
        if ($emp) {
            $emp['todayAttendance'] = is_string($emp['todayAttendance']) ? json_decode($emp['todayAttendance'], true) : ($emp['todayAttendance'] ?? []);
        }

        echo json_encode(['success' => true, 'data' => $emp]);
    }

    public static function checkoutWorker(string $id): void {
        $timeStr = date('h:i A');
        $pdo = Database::getConnection();

        // Get current attendance
        $stmtGet = $pdo->prepare('SELECT today_attendance FROM employees WHERE id = :id OR badge_no = :badge');
        $stmtGet->execute([':id' => $id, ':badge' => $id]);
        $row = $stmtGet->fetch();

        $currAttendance = is_string($row['today_attendance'] ?? null)
            ? json_decode($row['today_attendance'], true)
            : ($row['today_attendance'] ?? []);

        $newAttendance = array_merge($currAttendance, [
            'outTime' => $timeStr
        ]);

        $stmt = $pdo->prepare('
            UPDATE employees
            SET today_attendance = :today_attendance,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id OR badge_no = :badge
            RETURNING id, name, badge_no AS "badgeNo", role, department, shift,
                      assigned_location AS "assignedLocation", status, daily_wage AS "dailyWage",
                      monthly_wage AS "monthlyWage", phone, aadhaar, rating,
                      tasks_completed AS "tasksCompleted", joining_date AS "joiningDate",
                      avatar, today_attendance AS "todayAttendance"
        ');

        $stmt->execute([
            ':id' => $id,
            ':badge' => $id,
            ':today_attendance' => json_encode($newAttendance)
        ]);

        $emp = $stmt->fetch();
        if ($emp) {
            $emp['todayAttendance'] = is_string($emp['todayAttendance']) ? json_decode($emp['todayAttendance'], true) : ($emp['todayAttendance'] ?? []);
        }

        echo json_encode(['success' => true, 'data' => $emp]);
    }

    public static function enrolEmployee(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['name']) || empty($input['role'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Employee name and role are required']);
            return;
        }

        $id = 'WRK-' . rand(1020, 9999);
        $badgeNo = 'DION-E' . rand(200, 999);
        $avatar = strtoupper(substr($input['name'], 0, 2));

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO employees (id, name, badge_no, role, department, shift, assigned_location, status, daily_wage, monthly_wage, phone, aadhaar, rating, tasks_completed, joining_date, avatar, today_attendance)
            VALUES (:id, :name, :badge_no, :role, :department, :shift, :assigned_location, :status, :daily_wage, :monthly_wage, :phone, :aadhaar, :rating, :tasks_completed, :joining_date, :avatar, :today_attendance)
            RETURNING id, name, badge_no AS "badgeNo", role, department, shift,
                      assigned_location AS "assignedLocation", status, daily_wage AS "dailyWage",
                      monthly_wage AS "monthlyWage", phone, aadhaar, rating,
                      tasks_completed AS "tasksCompleted", joining_date AS "joiningDate",
                      avatar, today_attendance AS "todayAttendance"
        ');

        $todayAttendance = [
            'inTime' => date('h:i A'),
            'outTime' => '—',
            'gate' => 'Gate 01',
            'status' => 'present'
        ];

        $stmt->execute([
            ':id' => $id,
            ':name' => $input['name'],
            ':badge_no' => $badgeNo,
            ':role' => $input['role'],
            ':department' => $input['department'] ?? 'Security & Surveillance',
            ':shift' => $input['shift'] ?? 'Morning (06:00 - 14:00)',
            ':assigned_location' => $input['assignedLocation'] ?? 'Main Gate 01',
            ':status' => 'present',
            ':daily_wage' => $input['dailyWage'] ?? 850.00,
            ':monthly_wage' => $input['monthlyWage'] ?? 22100.00,
            ':phone' => $input['phone'] ?? '+91 98000 00000',
            ':aadhaar' => $input['aadhaar'] ?? 'XXXX-XXXX-9999',
            ':rating' => 5.0,
            ':tasks_completed' => 0,
            ':joining_date' => date('M d, Y'),
            ':avatar' => $avatar,
            ':today_attendance' => json_encode($todayAttendance)
        ]);

        $created = $stmt->fetch();
        if ($created) {
            $created['todayAttendance'] = is_string($created['todayAttendance']) ? json_decode($created['todayAttendance'], true) : ($created['todayAttendance'] ?? []);
        }

        echo json_encode(['success' => true, 'data' => $created]);
    }
}
