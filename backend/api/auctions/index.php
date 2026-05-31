<?php
/**
 * Mercato Nova - Active Auctions Endpoint
 * Fetches all active auctions joined with product details.
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

    // Query active auctions with details
    $sql = "
        SELECT 
            a.id AS auction_id,
            a.product_id,
            a.start_price,
            a.current_bid,
            a.highest_bidder_id,
            a.end_date,
            a.status AS auction_status,
            p.title,
            p.brand,
            p.model,
            p.year,
            p.price AS base_price,
            p.mileage,
            p.description,
            p.image_url,
            p.product_type,
            p.sale_type,
            p.stock,
            c.name AS category_name,
            u.username AS seller_name,
            hb.username AS highest_bidder_name
        FROM auctions a
        JOIN products p ON a.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN users u ON p.seller_id = u.id
        LEFT JOIN users hb ON a.highest_bidder_id = hb.id
        WHERE a.status = 'active' AND p.status = 'available'
        ORDER BY a.end_date ASC
    ";

    $stmt = $pdo->query($sql);
    $auctions = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data" => $auctions
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de la récupération des enchères actives.",
        "error" => $e->getMessage()
    ]);
}
