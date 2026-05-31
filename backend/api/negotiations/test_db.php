<?php
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    echo "Database connection successful!\n";
    
    // Check tables
    $tables = ['users', 'products', 'negotiations', 'messages'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->fetch()) {
            $countStmt = $pdo->query("SELECT COUNT(*) FROM `$table`");
            $count = $countStmt->fetchColumn();
            echo "Table '$table' exists with $count rows.\n";
        } else {
            echo "Table '$table' DOES NOT EXIST!\n";
        }
    }
    
    // Select negotiations
    $stmt = $pdo->query("SELECT * FROM negotiations");
    $negos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "\nActive Negotiations:\n";
    print_r($negos);

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
