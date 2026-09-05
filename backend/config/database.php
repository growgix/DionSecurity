<?php

class Database {
    private static ?PDO $instance = null;
    private static string $driver = 'mysql';

    public static function getDriver(): string {
        return self::$driver;
    }

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            // Load .env if present
            self::loadEnv(__DIR__ . '/../.env');

            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $port = getenv('DB_PORT') ?: '3306';
            $dbname = getenv('DB_DATABASE') ?: 'dion_security';
            $user = getenv('DB_USERNAME') ?: 'root';
            $password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';

            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";

            try {
                self::$instance = new PDO($dsn, $user, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ]);
                self::$driver = 'mysql';
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection error'
                ]);
                exit;
            }
        }

        return self::$instance;
    }

    public static function initEnv(): void {
        self::loadEnv(__DIR__ . '/../.env');
    }

    public static function loadEnv(string $path): void {
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

