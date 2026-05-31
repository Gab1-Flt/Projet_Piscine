<?php
/**
 * Mercato Nova - Registered Users API Endpoint
 * Returns a list of all users from the database for the admin workspace.
 */

// Allow CORS requests from frontend
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure it is a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Méthode non autorisée. Veuillez utiliser GET."
    ]);
    exit();
}

// Load database connection
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();

    // Query all users
    $stmt = $pdo->query("SELECT id, username, email, role, account_status, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data" => $users
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de la récupération des utilisateurs.",
        "error" => $e->getMessage()
    ]);
}
