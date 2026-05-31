<?php
/**
 * Mercato Nova - Secure User Login Endpoint
 * Verifies email and password hash against MySQL Database.
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

    if (empty($input['email']) || empty($input['password'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Veuillez fournir un email et un mot de passe."
        ]);
        exit();
    }

    $email = trim($input['email']);
    $password = $input['password'];

    $pdo = getDatabaseConnection();

    // Query user by email
    $stmt = $pdo->prepare("SELECT id, username, email, password_hash, role, account_status FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    // Check user and verify password hash (seeded users are hashed via bcrypt)
    if ($user && password_verify($password, $user['password_hash'])) {
        
        // Verify account status
        if ($user['account_status'] !== 'active') {
            http_response_code(403);
            echo json_encode([
                "status" => "error",
                "message" => "Ce compte est actuellement " . $user['account_status'] . "."
            ]);
            exit();
        }

        // Return user data (excluding password hash)
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Connexion réussie.",
            "user" => [
                "id" => (int)$user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "Email ou mot de passe incorrect."
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur de base de données lors de la tentative de connexion.",
        "error" => $e->getMessage()
    ]);
}
