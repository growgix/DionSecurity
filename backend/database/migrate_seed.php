<?php
// CLI script to run PostgreSQL schema and seed data
require_once __DIR__ . '/../config/database.php';

echo "======================================================\n";
echo " Dion Ventures — PostgreSQL Migration & Seed Runner\n";
echo "======================================================\n\n";

try {
    $pdo = Database::getConnection();
    echo "[1/3] Connected to PostgreSQL successfully.\n";

    $schemaSql = file_get_contents(__DIR__ . '/schema.sql');
    echo "[2/3] Executing schema.sql DDL definitions...\n";
    $pdo->exec($schemaSql);
    echo "      ✓ Schema tables, constraints, and indexes created.\n";

    $seedSql = file_get_contents(__DIR__ . '/seed.sql');
    echo "[3/3] Executing seed.sql data insertion...\n";
    $pdo->exec($seedSql);
    echo "      ✓ Seed records inserted (80 workers, 255 units, visitors, tasks, settings).\n\n";

    echo "🎉 Database migration and seeding completed successfully!\n";
} catch (Exception $e) {
    echo "❌ Error during migration: " . $e->getMessage() . "\n";
    exit(1);
}
