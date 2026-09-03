<?php
// ==============================================================================
// Dion Ventures — Live HTTP E2E Integration Test
// Launches background PHP server and makes live HTTP REST requests
// ==============================================================================

$host = '127.0.0.1';
$port = 8089;
$docRoot = realpath(__DIR__ . '/../backend/public');

echo "======================================================\n";
echo " Dion Ventures — Live HTTP Server End-to-End Suite\n";
echo "======================================================\n\n";

$phpExe = 'C:\\xampp\\php\\php.exe';
if (!file_exists($phpExe)) {
    $phpExe = 'php';
}

$cmd = "\"{$phpExe}\" -S {$host}:{$port} -t \"{$docRoot}\"";
$descriptors = [
    0 => ['pipe', 'r'],
    1 => ['pipe', 'w'],
    2 => ['pipe', 'w']
];

$serverProcess = proc_open($cmd, $descriptors, $pipes);
if (!is_resource($serverProcess)) {
    echo "❌ Failed to start PHP test server.\n";
    exit(1);
}

// Give the server 1.5 seconds to bind
usleep(1500000);

function httpRequest(string $method, string $path, array $data = null): array {
    global $host, $port;
    $url = "http://{$host}:{$port}/api/{$path}";

    $options = [
        'http' => [
            'method' => $method,
            'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
            'ignore_errors' => true,
            'timeout' => 5
        ]
    ];

    if ($data !== null) {
        $options['http']['content'] = json_encode($data);
    }

    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);
    $statusLine = $http_response_header[0] ?? '';
    preg_match('{HTTP\/\S*\s(\d{3})}', $statusLine, $match);
    $statusCode = (int)($match[1] ?? 0);

    return [
        'statusCode' => $statusCode,
        'body' => json_decode($response, true) ?? $response,
        'raw' => $response
    ];
}

$passed = 0;
$failed = 0;

function check(string $name, bool $expr, string $detail = '') {
    global $passed, $failed;
    if ($expr) {
        $passed++;
        echo "  [PASS] {$name}" . ($detail ? " ({$detail})" : "") . "\n";
    } else {
        $failed++;
        echo "  [FAIL] {$name}" . ($detail ? " - {$detail}" : "") . "\n";
    }
}

try {
    // 1. Health
    echo "[1/13] Live Health Check...\n";
    $h = httpRequest('GET', 'health');
    check('GET /api/health returns 200 OK and online status', $h['statusCode'] === 200 && ($h['body']['status'] ?? '') === 'online', "Driver: " . ($h['body']['driver'] ?? 'unknown'));

    // 2. Auth & Users
    echo "\n[2/13] Live Users & Auth...\n";
    $u = httpRequest('GET', 'auth/users');
    check('GET /api/auth/users returns users list', $u['statusCode'] === 200 && is_array($u['body']['data']) && count($u['body']['data']) >= 3);

    $newUser = httpRequest('POST', 'auth/users', [
        'name' => 'Officer Devika Menon',
        'email' => 'd.menon.' . time() . '@dionventures.internal',
        'role' => 'guard',
        'station' => 'East Gate 02'
    ]);
    check('POST /api/auth/users creates new user', $newUser['statusCode'] === 200 && !empty($newUser['body']['data']['id']));

    // 3. Blocks
    echo "\n[3/13] Live Blocks API...\n";
    $b = httpRequest('GET', 'blocks');
    check('GET /api/blocks returns estate blocks', $b['statusCode'] === 200 && count($b['body']['data'] ?? []) === 6);

    $bOne = httpRequest('GET', 'blocks/BLK-A');
    check('GET /api/blocks/BLK-A returns single block', $bOne['statusCode'] === 200 && ($bOne['body']['data']['id'] ?? '') === 'BLK-A');

    // 4. Houses
    echo "\n[4/13] Live Houses API...\n";
    $houses = httpRequest('GET', 'houses');
    check('GET /api/houses returns house units', $houses['statusCode'] === 200 && count($houses['body']['data'] ?? []) >= 10);

    $hOne = httpRequest('GET', 'houses/A-101');
    check('GET /api/houses/A-101 returns house A-101', $hOne['statusCode'] === 200 && ($hOne['body']['data']['unitNumber'] ?? '') === 'A-101');

    // 5. Residents & Family
    echo "\n[5/13] Live Residents & Family...\n";
    $r = httpRequest('GET', 'residents');
    check('GET /api/residents returns verified residents', $r['statusCode'] === 200 && count($r['body']['data'] ?? []) >= 5);

    $f = httpRequest('GET', 'family-members');
    check('GET /api/family-members returns family members', $f['statusCode'] === 200 && count($f['body']['data'] ?? []) >= 3);

    // 6. Employees & Attendance
    echo "\n[6/13] Live Workforce Operations...\n";
    $emp = httpRequest('GET', 'employees');
    check('GET /api/employees returns workforce staff', $emp['statusCode'] === 200 && count($emp['body']['data'] ?? []) >= 10);

    $att = httpRequest('PUT', 'employees/WRK-1001/attendance', ['status' => 'present']);
    check('PUT /api/employees/WRK-1001/attendance updates status', $att['statusCode'] === 200 && ($att['body']['data']['status'] ?? '') === 'present');

    $chk = httpRequest('POST', 'employees/WRK-1001/checkout');
    check('POST /api/employees/WRK-1001/checkout records shift checkout', $chk['statusCode'] === 200 && !empty($chk['body']['data']['todayAttendance']['outTime']));

    // 7. Visitors & Passes
    echo "\n[7/13] Live Visitor & Gate Pass Operations...\n";
    $visReg = httpRequest('POST', 'visitors', [
        'name' => 'Pranav Chopra (Swiggy)',
        'category' => 'Food Delivery',
        'hostResident' => 'Sunita Sharma',
        'hostUnit' => 'A-203',
        'vehicleNumber' => 'MH-02-PC-9911',
        'purpose' => 'Food Parcel Delivery',
        'gate' => 'Gate 01'
    ]);
    $newVisId = $visReg['body']['data']['id'] ?? '';
    check('POST /api/visitors registers new visitor pass', $visReg['statusCode'] === 200 && !empty($newVisId));

    if ($newVisId) {
        $visOut = httpRequest('PUT', "visitors/{$newVisId}/checkout");
        check('PUT /api/visitors/{id}/checkout checks out visitor', $visOut['statusCode'] === 200 && ($visOut['body']['data']['status'] ?? '') === 'exited');
    }

    // 8. Gate Logs
    echo "\n[8/13] Live Gate Logs Stream...\n";
    $logs = httpRequest('GET', 'gate-logs');
    check('GET /api/gate-logs returns telemetry logs', $logs['statusCode'] === 200 && count($logs['body']['data'] ?? []) >= 5);

    // 9. Tasks & Work Orders
    echo "\n[9/13] Live Work Orders & Timeline...\n";
    $newTask = httpRequest('POST', 'tasks', [
        'title' => 'Sector 4 Perimeter Floodlight #08 Replacement',
        'description' => 'High-intensity LED driver flickering intermittently.',
        'category' => 'Facilities & Engineering',
        'priority' => 'high',
        'assignedToId' => 'WRK-1002',
        'location' => 'Sector 4 North Perimeter',
        'dueDate' => 'Today, 06:00 PM'
    ]);
    $taskId = $newTask['body']['data']['id'] ?? '';
    check('POST /api/tasks dispatches new task', $newTask['statusCode'] === 200 && !empty($taskId));

    if ($taskId) {
        $taskStat = httpRequest('PUT', "tasks/{$taskId}/status", ['status' => 'in_progress']);
        check('PUT /api/tasks/{id}/status moves task to in_progress', $taskStat['statusCode'] === 200 && ($taskStat['body']['data']['status'] ?? '') === 'in_progress');

        $taskRem = httpRequest('POST', "tasks/{$taskId}/remarks", [
            'author' => 'Abdul Karim (Senior Electrician)',
            'text' => 'Procured 150W IP66 LED driver unit from engineering warehouse.'
        ]);
        check('POST /api/tasks/{id}/remarks appends note to timeline', $taskRem['statusCode'] === 200 && !empty($taskRem['body']['data']['text']));
    }

    // 10. Financial Payments
    echo "\n[10/13] Live Financial Payments & Vouchers...\n";
    $pay = httpRequest('POST', 'payments', [
        'employeeId' => 'WRK-1002',
        'employeeName' => 'Abdul Karim',
        'amount' => 3500,
        'type' => 'Overtime Allowance',
        'mode' => 'NEFT / Direct Bank',
        'remarks' => 'Emergency perimeter lighting overtime compensation'
    ]);
    check('POST /api/payments creates wage disbursement voucher', $pay['statusCode'] === 200 && !empty($pay['body']['data']['referenceNo']));

    // 11. Audit Logs
    echo "\n[11/13] Live Forensic Audit Stream...\n";
    $audit = httpRequest('GET', 'audit-logs');
    check('GET /api/audit-logs returns audit events', $audit['statusCode'] === 200 && count($audit['body']['data'] ?? []) >= 5);

    // 12. Settings & Panic
    echo "\n[12/13] Live Settings & Parameters...\n";
    $set = httpRequest('GET', 'settings');
    check('GET /api/settings returns perimeter parameters', $set['statusCode'] === 200 && !empty($set['body']['data']['societyName']));

    $panic = httpRequest('POST', 'panic', ['location' => 'North Perimeter Gate']);
    check('POST /api/panic triggers emergency security protocol', $panic['statusCode'] === 200 && ($panic['body']['success'] ?? false) === true);

    // 13. End-to-End Persistence Check
    echo "\n[13/13] Live End-to-End Persistence Verification...\n";
    $verifyTask = httpRequest('GET', "tasks/{$taskId}");
    check('GET /api/tasks/{id} returns persisted task with timeline remarks', $verifyTask['statusCode'] === 200 && count($verifyTask['body']['data']['remarks'] ?? []) >= 1);

} finally {
    // Terminate server process
    proc_terminate($serverProcess);
    foreach ($pipes as $p) {
        if (is_resource($p)) fclose($p);
    }
    proc_close($serverProcess);
}

echo "\n======================================================\n";
echo " LIVE E2E HTTP SUMMARY: Passed: {$passed} | Failed: {$failed}\n";
echo "======================================================\n\n";

if ($failed > 0) {
    exit(1);
} else {
    echo "🎉 ALL LIVE HTTP ENDPOINTS TESTED & VERIFIED SUCCESSFULLY!\n";
    exit(0);
}
