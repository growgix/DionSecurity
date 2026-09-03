<?php
require_once __DIR__ . '/../backend/config/database.php';

try {
    $pdo = Database::getConnection();
    echo "SUCCESS: Connected using driver: " . Database::getDriver() . "\n";
    $users = $pdo->query("SELECT count(*) FROM users")->fetchColumn();
    $employees = $pdo->query("SELECT count(*) FROM employees")->fetchColumn();
    $houses = $pdo->query("SELECT count(*) FROM houses")->fetchColumn();
    $tasks = $pdo->query("SELECT count(*) FROM tasks")->fetchColumn();
    $visitors = $pdo->query("SELECT count(*) FROM visitors")->fetchColumn();
    $gateLogs = $pdo->query("SELECT count(*) FROM gate_logs")->fetchColumn();
    $payments = $pdo->query("SELECT count(*) FROM payments")->fetchColumn();
    $auditLogs = $pdo->query("SELECT count(*) FROM audit_logs")->fetchColumn();
    $settings = $pdo->query("SELECT count(*) FROM settings")->fetchColumn();

    echo "Stats -> Users: $users, Employees: $employees, Houses: $houses, Tasks: $tasks, Visitors: $visitors, GateLogs: $gateLogs, Payments: $payments, AuditLogs: $auditLogs, Settings: $settings\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
