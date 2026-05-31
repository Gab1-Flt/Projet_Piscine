<?php
/**
 * Mercato Nova - Reset Gabin Password Hash in SQL Database
 */
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    $email = 'gabin@mercatonova.com';
    $new_plain_password = 'password123';
    
    // Generate a fresh, valid Bcrypt hash
    $new_hash = password_hash($new_plain_password, PASSWORD_BCRYPT);
    
    // Update the database row
    $stmt = $pdo->prepare("UPDATE users SET password_hash = :hash WHERE email = :email");
    $stmt->execute([
        ':hash' => $new_hash,
        ':email' => $email
    ]);
    
    // Also try updating by username if email update did not match
    $stmt2 = $pdo->prepare("UPDATE users SET password_hash = :hash WHERE username = 'gabin_lead'");
    $stmt2->execute([':hash' => $new_hash]);

    echo json_encode([
        "status" => "success",
        "message" => "Le mot de passe de Gabin a ete reinitialise avec succes en base de donnees !",
        "email" => $email,
        "nouveau_mot_de_passe" => $new_plain_password,
        "nouveau_hash_bcrypt" => $new_hash
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Impossible de reinitialiser le mot de passe.",
        "error" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
