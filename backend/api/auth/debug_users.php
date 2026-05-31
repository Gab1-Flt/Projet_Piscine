<?php
/**
 * Mercato Nova - Database User Debugger
 * Helps verify database connectivity and loaded users.
 */
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    // Test basic connection
    $stmt = $pdo->query("SELECT id, username, email, role, account_status FROM users");
    $users = $stmt->fetchAll();
    
    echo json_encode([
        "status" => "success",
        "message" => "Database connected successfully!",
        "database_name" => DB_NAME,
        "database_host" => DB_HOST,
        "database_port" => DB_PORT,
        "users_found" => count($users),
        "users" => $users
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed!",
        "error" => $e->getMessage(),
        "hint" => "Ensure MAMP is running and 'mercato_nova' database is created with database/init.sql. Also check backend/config/database.php settings."
    ], JSON_PRETTY_PRINT);
}
