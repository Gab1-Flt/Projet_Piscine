<?php
/**
 * Mercato Nova - Get Negotiation Details or List API
 * Fetches negotiations for a user or a specific negotiation by ID.
 */

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();

    // 1. Fetch specific negotiation details by negotiation ID
    if (isset($_GET['id'])) {
        $nego_id = intval($_GET['id']);
        
        $sql = "
            SELECT 
                n.id,
                n.product_id,
                n.buyer_id,
                n.offered_price,
                n.buyer_message,
                n.seller_response,
                n.status,
                n.created_at,
                n.end_date,
                p.title AS product_title,
                p.brand AS product_brand,
                p.model AS product_model,
                p.price AS product_asking_price,
                p.image_url AS product_image,
                p.seller_id AS seller_id,
                u_buyer.username AS buyer_username,
                u_buyer.email AS buyer_email,
                u_seller.username AS seller_username,
                u_seller.email AS seller_email
            FROM negotiations n
            JOIN products p ON n.product_id = p.id
            JOIN users u_buyer ON n.buyer_id = u_buyer.id
            JOIN users u_seller ON p.seller_id = u_seller.id
            WHERE n.id = ?
            LIMIT 1
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nego_id]);
        $nego = $stmt->fetch();
        
        if (!$nego) {
            http_response_code(404);
            echo json_encode([
                "status" => "error",
                "message" => "Négociation introuvable."
            ]);
            exit();
        }
        
        echo json_encode([
            "status" => "success",
            "data" => $nego
        ]);
        exit();
    }

    // 2. Fetch negotiation list for a user (either as buyer or seller)
    if (isset($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);
        
        $sql = "
            SELECT 
                n.id,
                n.product_id,
                n.buyer_id,
                n.offered_price,
                n.buyer_message,
                n.seller_response,
                n.status,
                n.created_at,
                p.title AS product_title,
                p.brand AS product_brand,
                p.model AS product_model,
                p.price AS product_asking_price,
                p.image_url AS product_image,
                p.seller_id AS seller_id,
                u_buyer.username AS buyer_username,
                u_seller.username AS seller_username
            FROM negotiations n
            JOIN products p ON n.product_id = p.id
            JOIN users u_buyer ON n.buyer_id = u_buyer.id
            JOIN users u_seller ON p.seller_id = u_seller.id
            WHERE n.buyer_id = :buyer_id OR p.seller_id = :seller_id
            ORDER BY n.created_at DESC
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':buyer_id' => $user_id, ':seller_id' => $user_id]);
        $negotiations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $output = [
            "status" => "success",
            "data" => $negotiations
        ];
        
        echo json_encode($output);
        exit();
    }

    // 3. Fallback: retrieve all negotiations
    $stmt = $pdo->query("SELECT * FROM negotiations ORDER BY created_at DESC");
    $all = $stmt->fetchAll();
    echo json_encode([
        "status" => "success",
        "data" => $all
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de la récupération des données de négociation.",
        "error" => $e->getMessage()
    ]);
}
