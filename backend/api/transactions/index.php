<?php
/**
 * Mercato Nova - Get Transactions List Endpoint
 * Returns a list of all transactions with user and product details for the Admin dashboard.
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

    // Query transactions with user and product details
    $sql = "
        SELECT 
            t.id, 
            t.buyer_id,
            t.product_id,
            t.amount, 
            t.transaction_type, 
            t.payment_method, 
            t.status, 
            t.created_at,
            u.username AS buyer_username,
            u.email AS buyer_email,
            p.title AS product_title,
            p.brand AS product_brand,
            p.model AS product_model,
            p.image_url AS product_image
        FROM transactions t
        LEFT JOIN users u ON t.buyer_id = u.id
        LEFT JOIN products p ON t.product_id = p.id
        ORDER BY t.created_at DESC
    ";

    $stmt = $pdo->query($sql);
    $transactions = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => $transactions
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de la récupération des transactions.",
        "error" => $e->getMessage()
    ]);
}
