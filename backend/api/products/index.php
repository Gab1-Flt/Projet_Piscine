<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();

    $sql = "
        SELECT 
            p.id,
            p.title,
            p.brand,
            p.model,
            p.year,
            p.price,
            p.mileage,
            p.description,
            p.image_url,
            p.product_type,
            p.sale_type,
            p.status,
            p.stock,
            c.name AS category_name,
            u.username AS seller_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN users u ON p.seller_id = u.id
        WHERE p.status = 'available'
        ORDER BY p.created_at DESC
    ";

    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $products
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur lors de la récupération des produits',
        'error' => $e->getMessage()
    ]);
}