<?php
/**
 * Mercato Nova - Database Connection Configuration (PDO)
 * Tailored for MAMP under Windows.
 */

// Define database parameters
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306'); // MAMP MySQL default port on Windows. Change to '8889' if customized.
define('DB_NAME', 'mercato_nova');
define('DB_USER', 'root');
define('DB_PASS', 'root'); // MAMP default password is 'root' under Windows. Change to '' if needed.

/**
 * Returns a connection to the MySQL Database using PDO.
 * 
 * @return PDO
 */
function getDatabaseConnection() {
    static $pdo = null;
    
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (\PDOException $e) {
        // In case MAMP uses an empty password by default on some custom setups, try a fallback
        try {
            $pdo = new PDO($dsn, DB_USER, '', $options);
            return $pdo;
        } catch (\PDOException $fallbackException) {
            // Return JSON-formatted error so the frontend doesn't crash on HTML PHP errors
            header('Content-Type: application/json', true, 500);
            echo json_encode([
                "status" => "error",
                "message" => "Database Connection Failed: " . $fallbackException->getMessage(),
                "hint" => "Ensure MAMP is running and the database 'mercato_nova' is created using 'database/init.sql'"
            ]);
            exit();
        }
    }
}
