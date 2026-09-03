<?php
// ==============================================================================
// Dion Ventures — Universal PHP Database Initializer
// Supports both PostgreSQL and SQLite
// ==============================================================================

require_once __DIR__ . '/../config/database.php';

echo "======================================================\n";
echo " Dion Ventures — Universal Database Initializer\n";
echo "======================================================\n\n";

$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '5432';
$user = getenv('DB_USERNAME') ?: 'postgres';
$password = getenv('DB_PASSWORD') ?: 'postgres';
$dbname = getenv('DB_DATABASE') ?: 'dion_security';
$connection = getenv('DB_CONNECTION') ?: 'sqlite';

if ($connection === 'pgsql') {
    try {
        echo "[1/3] Connecting to PostgreSQL server at {$host}:{$port}...\n";
        $pdoAdmin = new PDO("pgsql:host={$host};port={$port};dbname=postgres;", $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);

        $stmt = $pdoAdmin->prepare("SELECT 1 FROM pg_database WHERE datname = :dbname");
        $stmt->execute([':dbname' => $dbname]);
        if (!$stmt->fetch()) {
            echo "      Creating database '{$dbname}'...\n";
            $pdoAdmin->exec("CREATE DATABASE \"{$dbname}\"");
            echo "      ✓ Database '{$dbname}' created successfully.\n";
        } else {
            echo "      ✓ Database '{$dbname}' already exists.\n";
        }

        echo "[2/3] Applying relational schema (schema.sql)...\n";
        $pdo = new PDO("pgsql:host={$host};port={$port};dbname={$dbname};", $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);

        $schemaSql = file_get_contents(__DIR__ . '/schema.sql');
        $pdo->exec($schemaSql);
        echo "      ✓ Schema tables, foreign keys, and indexes applied.\n";

        echo "[3/3] Populating initial seed data (seed.sql)...\n";
        $seedSql = file_get_contents(__DIR__ . '/seed.sql');
        $pdo->exec($seedSql);
        echo "      ✓ Seed records inserted.\n\n";

        echo "======================================================\n";
        echo " 🎉 PostgreSQL database setup completed successfully!\n";
        echo "======================================================\n";
        exit(0);
    } catch (PDOException $e) {
        echo "⚠️ PostgreSQL Connection Error: " . $e->getMessage() . "\n";
        echo "Falling back to SQLite initializer...\n\n";
    }
}

// SQLite Setup
try {
    $sqlitePath = __DIR__ . '/dion_security.sqlite';
    echo "[1/3] Initializing SQLite database file at {$sqlitePath}...\n";
    $pdo = new PDO("sqlite:{$sqlitePath}", null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    echo "[2/3] Applying SQLite schema (schema_sqlite.sql)...\n";
    $schemaSql = file_get_contents(__DIR__ . '/schema_sqlite.sql');
    $pdo->exec($schemaSql);
    echo "      ✓ Schema tables and indexes created.\n";

    echo "[3/3] Populating SQLite seed data (seed_sqlite.sql)...\n";
    $seedSql = file_get_contents(__DIR__ . '/seed_sqlite.sql');
    $pdo->exec($seedSql);
    echo "      ✓ Seed records populated successfully.\n\n";

    echo "======================================================\n";
    echo " 🎉 SQLite database is ready and fully populated!\n";
    echo "======================================================\n";
} catch (Exception $e) {
    echo "❌ SQLite Setup Error: " . $e->getMessage() . "\n";
    exit(1);
}

