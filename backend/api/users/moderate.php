<?php
/**
 * Mercato Nova - User Moderation Endpoint (Ban / Unban / Delete)
 * Updates user account status directly in the MySQL Database.
 */

// Allow CORS requests from frontend
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure it is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Méthode non autorisée. Veuillez utiliser POST."
    ]);
    exit();
}

// Load database connection
require_once __DIR__ . '/../../config/database.php';

try {
    // Get JSON payload
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (empty($input['email']) || empty($input['action'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données manquantes (email ou action de modération)."
        ]);
        exit();
    }

    $email = trim($input['email']);
    $action = trim($input['action']); // 'ban', 'unban', 'delete'

    $pdo = getDatabaseConnection();

    // Verify user exists
    $stmt = $pdo->prepare("SELECT id, username, email, role, account_status FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Utilisateur introuvable."
        ]);
        exit();
    }

    // Determine target status
    $newStatus = 'active';
    if ($action === 'ban') {
        $newStatus = 'suspended';
    } elseif ($action === 'delete') {
        $newStatus = 'deleted';
    } elseif ($action === 'unban') {
        $newStatus = 'active';
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Action non reconnue."
        ]);
        exit();
    }

    // Update status in the database
    $updateStmt = $pdo->prepare("UPDATE users SET account_status = :status WHERE email = :email");
    $updateStmt->execute([
        ':status' => $newStatus,
        ':email' => $email
    ]);

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Le statut de l'utilisateur a ete mis a jour avec succes.",
        "user" => [
            "email" => $email,
            "new_status" => $newStatus
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de la modération de l'utilisateur en base de données.",
        "error" => $e->getMessage()
    ]);
}
