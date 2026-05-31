<?php
/**
 * Mercato Nova - Login Debugger
 * Verifies the password hashing matching in the DB.
 */
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    $email = 'gabin@mercatonova.com';
    $password_to_test = 'password123';
    
    $stmt = $pdo->prepare("SELECT id, username, email, password_hash, role, account_status FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode([
            "status" => "error",
            "message" => "User 'gabin@mercatonova.com' was not found in the database!"
        ], JSON_PRETTY_PRINT);
        exit();
    }
    
    $stored_hash = $user['password_hash'];
    $is_password_valid = password_verify($password_to_test, $stored_hash);
    
    // Also test generating a new hash and verifying it
    $new_hash_test = password_hash($password_to_test, PASSWORD_BCRYPT);
    $verifies_new_hash = password_verify($password_to_test, $new_hash_test);
    
    echo json_encode([
        "status" => "success",
        "user_found" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "email" => $user['email'],
            "role" => $user['role'],
            "account_status" => $user['account_status']
        ],
        "hash_stored_in_db" => $stored_hash,
        "password_tested" => $password_to_test,
        "does_password_match_stored_hash" => $is_password_valid ? "YES" : "NO",
        "new_hash_generated_locally" => $new_hash_test,
        "does_new_hash_verify" => $verifies_new_hash ? "YES" : "NO"
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "An error occurred during debugging.",
        "error" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
