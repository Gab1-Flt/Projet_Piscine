<?php
/**
 * Mercato Nova - Secure User Registration Endpoint
 * Registers a new user and hashes their password using Bcrypt.
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

    if (empty($input['username']) || empty($input['email']) || empty($input['password'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Veuillez remplir tous les champs obligatoires (nom d'utilisateur, email, mot de passe)."
        ]);
        exit();
    }

    $username = trim($input['username']);
    $email = trim($input['email']);
    $password = $input['password'];
    $role = !empty($input['role']) ? trim($input['role']) : 'buyer';

    // Validate role value
    $allowedRoles = ['buyer', 'seller', 'admin'];
    if (!in_array($role, $allowedRoles)) {
        $role = 'buyer';
    }

    $pdo = getDatabaseConnection();

    // Check if email or username already exists
    $stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE email = :email OR username = :username LIMIT 1");
    $stmt->execute([
        ':email' => $email,
        ':username' => $username
    ]);
    $existingUser = $stmt->fetch();

    if ($existingUser) {
        http_response_code(409);
        if ($existingUser['email'] === $email) {
            echo json_encode([
                "status" => "error",
                "message" => "Cette adresse email est déjà enregistrée."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Ce nom d'utilisateur est déjà pris."
            ]);
        }
        exit();
    }

    // Hash the password securely with Bcrypt
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insert user into database
    $insertStmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role, account_status) VALUES (:username, :email, :password_hash, :role, 'active')");
    $insertStmt->execute([
        ':username' => $username,
        ':email' => $email,
        ':password_hash' => $passwordHash,
        ':role' => $role
    ]);

    $newUserId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        "user" => [
            "id" => (int)$newUserId,
            "username" => $username,
            "email" => $email,
            "role" => $role
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur de base de données lors de la tentative d'inscription.",
        "error" => $e->getMessage()
    ]);
}
