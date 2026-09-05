<?php
// Local Development Server Router for Dion Security
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Route API requests to backend/public/index.php
if (strpos($uri, '/api') === 0) {
    require __DIR__ . '/backend/public/index.php';
    exit;
}

// 2. Route root / to /pages/login.php
if ($uri === '/' || $uri === '') {
    header('Location: /pages/login.php');
    exit;
}

// 3. Serve physical files if they exist
$file = __DIR__ . $uri;
if (file_exists($file) && !is_dir($file)) {
    return false;
}

// 4. Default 404
http_response_code(404);
echo "404 Not Found: " . htmlspecialchars($uri);