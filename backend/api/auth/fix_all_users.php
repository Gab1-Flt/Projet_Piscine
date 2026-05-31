<?php
/**
 * Mercato Nova - Reset ALL Seed Users Password Hash in SQL Database
 */
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();
    
    $new_plain_password = 'password123';
    
    // Generate a fresh, valid Bcrypt hash
    $new_hash = password_hash($new_plain_password, PASSWORD_BCRYPT);
    
    // Update all users currently in the database to have this working hash
    $stmt = $pdo->prepare("UPDATE users SET password_hash = :hash");
    $stmt->execute([':hash' => $new_hash]);
    
    // Retrieve users list to confirm
    $stmt2 = $pdo->query("SELECT id, username, email, role FROM users");
    $users = $stmt2->fetchAll();

    echo json_encode([
        "status" => "success",
        "message" => "Tous les comptes de la base de donnees ont ete reinitialises avec le mot de passe 'password123' !",
        "nouveau_mot_de_passe" => $new_plain_password,
        "nombre_comptes_mis_a_jour" => count($users),
        "comptes" => $users
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Impossible de reinitialiser les mots de passe.",
        "error" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
