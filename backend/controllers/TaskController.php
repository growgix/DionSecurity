<?php
require_once __DIR__ . '/../config/database.php';

class TaskController {
    public static function getTasks(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('
            SELECT id, title, description, category, priority,
                   assigned_to_id AS assignedToId, assigned_to_name AS assignedToName,
                   assigned_role AS assignedRole, location, due_date AS dueDate,
                   created_at AS createdAt, completed_at AS completedAt,
                   verified_by AS verifiedBy, status
            FROM tasks
            ORDER BY id DESC
        ');
        $tasks = $stmt->fetchAll();

        // Attach remarks for each task
        $stmtRemarks = $pdo->query('
            SELECT task_id AS taskId, author, time, text
            FROM task_remarks
            ORDER BY id ASC
        ');
        $allRemarks = $stmtRemarks->fetchAll();

        $remarksMap = [];
        foreach ($allRemarks as $rem) {
            $remarksMap[$rem['taskId']][] = [
                'author' => $rem['author'],
                'time' => $rem['time'],
                'text' => $rem['text']
            ];
        }

        foreach ($tasks as &$t) {
            $t['remarks'] = $remarksMap[$t['id']] ?? [];
        }

        echo json_encode(['success' => true, 'data' => $tasks]);
    }

    public static function getTaskById(string $id): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            SELECT id, title, description, category, priority,
                   assigned_to_id AS assignedToId, assigned_to_name AS assignedToName,
                   assigned_role AS assignedRole, location, due_date AS dueDate,
                   created_at AS createdAt, completed_at AS completedAt,
                   verified_by AS verifiedBy, status
            FROM tasks
            WHERE id = :id
        ');
        $stmt->execute([':id' => $id]);
        $task = $stmt->fetch();

        if (!$task) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Task not found']);
            return;
        }

        $stmtRemarks = $pdo->prepare('SELECT author, time, text FROM task_remarks WHERE task_id = :task_id ORDER BY id ASC');
        $stmtRemarks->execute([':task_id' => $id]);
        $task['remarks'] = $stmtRemarks->fetchAll();

        echo json_encode(['success' => true, 'data' => $task]);
    }

    public static function createTask(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['title'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Task title is required']);
            return;
        }

        $allowedPriorities = ['urgent', 'high', 'medium', 'low'];
        $priority = $input['priority'] ?? 'medium';
        if (!in_array($priority, $allowedPriorities, true)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid task priority. Allowed: ' . implode(', ', $allowedPriorities)]);
            return;
        }

        $id = $input['id'] ?? ('TSK-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)));
        $timeString = date('h:i A');

        $pdo = Database::getConnection();

        // Get assigned worker details
        $workerName = 'Abdul Karim';
        $workerRole = 'Senior Electrician';
        if (!empty($input['assignedToId'])) {
            $stmtW = $pdo->prepare('SELECT name, role FROM employees WHERE id = :id');
            $stmtW->execute([':id' => $input['assignedToId']]);
            $w = $stmtW->fetch();
            if ($w) {
                $workerName = $w['name'];
                $workerRole = $w['role'];
            }
        }

        $stmt = $pdo->prepare('
            INSERT INTO tasks (id, title, description, category, priority, assigned_to_id, assigned_to_name, assigned_role, location, due_date, created_at, status)
            VALUES (:id, :title, :description, :category, :priority, :assigned_to_id, :assigned_to_name, :assigned_role, :location, :due_date, :created_at, :status)
        ');

        $stmt->execute([
            ':id' => $id,
            ':title' => $input['title'],
            ':description' => $input['description'] ?? 'Work order dispatched by field supervisor.',
            ':category' => $input['category'] ?? 'Facilities & Engineering',
            ':priority' => $input['priority'] ?? 'high',
            ':assigned_to_id' => $input['assignedToId'] ?? 'WRK-1002',
            ':assigned_to_name' => $workerName,
            ':assigned_role' => $workerRole,
            ':location' => $input['location'] ?? 'Main Gate 01',
            ':due_date' => $input['dueDate'] ?? 'Today, 05:00 PM',
            ':created_at' => $timeString,
            ':status' => 'assigned'
        ]);

        $stmtSelect = $pdo->prepare('
            SELECT id, title, description, category, priority,
                   assigned_to_id AS assignedToId, assigned_to_name AS assignedToName,
                   assigned_role AS assignedRole, location, due_date AS dueDate,
                   created_at AS createdAt, completed_at AS completedAt,
                   verified_by AS verifiedBy, status
            FROM tasks
            WHERE id = :id
        ');
        $stmtSelect->execute([':id' => $id]);
        $task = $stmtSelect->fetch();
        $task['remarks'] = [];

        echo json_encode(['success' => true, 'data' => $task]);
    }

    public static function updateStatus(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = $input['status'] ?? 'in_progress';
        $allowedStatuses = ['created', 'assigned', 'in_progress', 'completed', 'verified'];
        if (!in_array($status, $allowedStatuses, true)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid task status. Allowed: ' . implode(', ', $allowedStatuses)]);
            return;
        }

        $completedAt = ($status === 'completed' || $status === 'verified') ? date('M d, h:i A') : null;
        $verifiedBy = ($status === 'verified') ? 'Inspector R. Thorne' : null;

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            UPDATE tasks
            SET status = :status,
                completed_at = COALESCE(:completed_at, completed_at),
                verified_by = COALESCE(:verified_by, verified_by),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');

        $stmt->execute([
            ':id' => $id,
            ':status' => $status,
            ':completed_at' => $completedAt,
            ':verified_by' => $verifiedBy
        ]);

        $stmtSelect = $pdo->prepare('
            SELECT id, title, description, category, priority,
                   assigned_to_id AS assignedToId, assigned_to_name AS assignedToName,
                   assigned_role AS assignedRole, location, due_date AS dueDate,
                   created_at AS createdAt, completed_at AS completedAt,
                   verified_by AS verifiedBy, status
            FROM tasks
            WHERE id = :id
        ');
        $stmtSelect->execute([':id' => $id]);
        $task = $stmtSelect->fetch();

        if ($task) {
            $stmtRemarks = $pdo->prepare('SELECT author, time, text FROM task_remarks WHERE task_id = :task_id ORDER BY id ASC');
            $stmtRemarks->execute([':task_id' => $id]);
            $task['remarks'] = $stmtRemarks->fetchAll();
        }

        echo json_encode(['success' => true, 'data' => $task]);
    }

    public static function addRemark(string $id): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($input['text'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Remark text is required']);
            return;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO task_remarks (task_id, author, time, text)
            VALUES (:task_id, :author, :time, :text)
        ');

        $stmt->execute([
            ':task_id' => $id,
            ':author' => $input['author'] ?? 'Inspector R. Thorne (Supervisor)',
            ':time' => date('h:i A'),
            ':text' => $input['text']
        ]);

        $newId = $pdo->lastInsertId();

        $stmtSelect = $pdo->prepare('
            SELECT id, task_id AS taskId, author, time, text
            FROM task_remarks
            WHERE id = :id
        ');
        $stmtSelect->execute([':id' => $newId]);
        $remark = $stmtSelect->fetch();

        echo json_encode(['success' => true, 'data' => $remark]);
    }
}
