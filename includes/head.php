<?php
/**
 * Shared HTML Head Include
 * Dion Ventures Estate Security & Workforce Operations
 *
 * Variables expected:
 *   $pageTitle (string, optional) - Custom page title
 *   $pageCss (array, optional)   - Additional CSS stylesheets to include
 */

require_once __DIR__ . '/../backend/config/auth.php';
$csrfToken = getCsrfToken();
$title = isset($pageTitle) ? htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . ' | Dion Security' : 'Dion Security & Workforce Operations';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?></title>
    <meta name="csrf-token" content="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
    
    <!-- Google Fonts & Material Symbols -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">

    <!-- Dion Design System CSS Foundation -->
    <link rel="stylesheet" href="/public/css/variables.css">
    <link rel="stylesheet" href="/public/css/reset.css">
    <link rel="stylesheet" href="/public/css/typography.css">
    <link rel="stylesheet" href="/public/css/layout.css">
    <link rel="stylesheet" href="/public/css/components.css">

    <?php if (!empty($pageCss) && is_array($pageCss)): ?>
        <?php foreach ($pageCss as $css): ?>
            <link rel="stylesheet" href="<?= htmlspecialchars($css, ENT_QUOTES, 'UTF-8') ?>">
        <?php endforeach; ?>
    <?php endif; ?>
</head>
<body class="dion-app-body">