<?php

class Database {
    private static ?PDO $instance = null;
    private static string $driver = 'sqlite';

    public static function getDriver(): string {
        return self::$driver;
    }

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            // Load .env if present
            self::loadEnv(__DIR__ . '/../.env');

            $connectionType = getenv('DB_CONNECTION') ?: 'sqlite';
            $host = getenv('DB_HOST') ?: 'localhost';
            $port = getenv('DB_PORT') ?: '5432';
            $dbname = getenv('DB_DATABASE') ?: 'dion_security';
            $user = getenv('DB_USERNAME') ?: 'postgres';
            $password = getenv('DB_PASSWORD') ?: 'postgres';

            // Try PostgreSQL if explicitly requested or configured
            if ($connectionType === 'pgsql') {
                try {
                    $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};";
                    self::$instance = new PDO($dsn, $user, $password, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]);
                    self::$driver = 'pgsql';
                    return self::$instance;
                } catch (PDOException $e) {
                    error_log("[Dion Database] PostgreSQL connection failed: " . $e->getMessage() . ". Falling back to high-speed embedded SQLite.");
                }
            }

            // SQLite Driver (Zero-config out of the box)
            $sqlitePath = __DIR__ . '/../database/dion_security.sqlite';
            $needsInit = !file_exists($sqlitePath) || filesize($sqlitePath) === 0;

            try {
                self::$instance = new PDO("sqlite:{$sqlitePath}", null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
                self::$driver = 'sqlite';

                // Check if tables are populated
                if ($needsInit) {
                    self::initSqliteDatabase(self::$instance);
                } else {
                    $check = self::$instance->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")->fetch();
                    if (!$check) {
                        self::initSqliteDatabase(self::$instance);
                    }
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Database Connection Failed: ' . $e->getMessage(),
                    'hint' => 'Ensure database directory is writable for SQLite or PostgreSQL server is running.'
                ]);
                exit;
            }
        }

        return self::$instance;
    }

    private static function initSqliteDatabase(PDO $pdo): void {
        $schemaFile = __DIR__ . '/../database/schema_sqlite.sql';
        $seedFile = __DIR__ . '/../database/seed_sqlite.sql';

        if (file_exists($schemaFile)) {
            $schemaSql = file_get_contents($schemaFile);
            $pdo->exec($schemaSql);
        }

        if (file_exists($seedFile)) {
            $seedSql = file_get_contents($seedFile);
            $pdo->exec($seedSql);
        }
    }

    private static function loadEnv(string $path): void {
        if (!file_exists($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            list($name, $value) = explode('=', $line, 2) + [NULL, NULL];
            if ($name !== NULL && $value !== NULL) {
                putenv(trim($name) . '=' . trim($value));
                $_ENV[trim($name)] = trim($value);
                $_SERVER[trim($name)] = trim($value);
            }
        }
    }
}
