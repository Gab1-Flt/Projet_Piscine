<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['brand']) || empty($input['model']) || !isset($input['price'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Marque (brand), modèle (model) et prix (price) requis.'
        ]);
        exit;
    }

    try {
        $pdo = getDatabaseConnection();

        // 1. Resolve seller_id from username
        $seller_id = 2; // Default to seeded seller
        if (!empty($input['seller_username'])) {
            $stmtUser = $pdo->prepare("SELECT id FROM users WHERE username = ?");
            $stmtUser->execute([$input['seller_username']]);
            $userRow = $stmtUser->fetch();
            if ($userRow) {
                $seller_id = intval($userRow['id']);
            }
        }

        // 2. Resolve category_id (default to 1 for Vehicles)
        $category_id = 1;

        // Map sale_type 'enchere' -> 'auction', 'negociation' -> 'negotiation', 'mixte' -> 'both', 'direct' -> 'direct'
        $sale_type_mapped = 'negotiation';
        if ($input['sale_type'] === 'enchere' || $input['sale_type'] === 'auction') {
            $sale_type_mapped = 'auction';
        } else if ($input['sale_type'] === 'mixte' || $input['sale_type'] === 'both') {
            $sale_type_mapped = 'both';
        } else if ($input['sale_type'] === 'direct') {
            $sale_type_mapped = 'direct';
        }

        $sqlInsert = "
            INSERT INTO products (
                seller_id, category_id, title, brand, model, year, price, mileage, 
                description, image_url, product_type, status, sale_type, stock
            ) VALUES (
                :seller_id, :category_id, :title, :brand, :model, :year, :price, :mileage, 
                :description, :image_url, 'vehicle', 'available', :sale_type, 1
            )
        ";

        $stmtInsert = $pdo->prepare($sqlInsert);
        $title = $input['brand'] . ' ' . $input['model'];
        $stmtInsert->execute([
            ':seller_id' => $seller_id,
            ':category_id' => $category_id,
            ':title' => !empty($input['title']) ? $input['title'] : $title,
            ':brand' => $input['brand'],
            ':model' => $input['model'],
            ':year' => isset($input['year']) ? intval($input['year']) : 2024,
            ':price' => floatval($input['price']),
            ':mileage' => isset($input['mileage']) ? intval($input['mileage']) : 0,
            ':description' => !empty($input['description']) ? $input['description'] : 'Bolide importé certifié.',
            ':image_url' => !empty($input['image_url']) ? $input['image_url'] : '',
            ':sale_type' => $sale_type_mapped
        ]);

        $newProductId = $pdo->lastInsertId();

        // If it is an auction or mixed (both), insert into the auctions table
        if ($sale_type_mapped === 'auction' || $sale_type_mapped === 'both') {
            $starting_price = isset($input['starting_price']) ? floatval($input['starting_price']) : floatval($input['price']);
            $end_date = !empty($input['end_date']) ? $input['end_date'] : date('Y-m-d H:i:s', strtotime('+7 days'));

            $sqlAuction = "
                INSERT INTO auctions (
                    product_id, start_price, current_bid, end_date, status
                ) VALUES (
                    :product_id, :start_price, :current_bid, :end_date, 'active'
                )
            ";
            $stmtAuction = $pdo->prepare($sqlAuction);
            $stmtAuction->execute([
                ':product_id' => $newProductId,
                ':start_price' => $starting_price,
                ':current_bid' => $starting_price,
                ':end_date' => date('Y-m-d H:i:s', strtotime($end_date))
            ]);
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Annonce créée avec succès dans la base de données.',
            'data' => [
                'id' => $newProductId,
                'brand' => $input['brand'],
                'model' => $input['model']
            ]
        ]);
        exit;
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Erreur lors de l\'écriture en base de données',
            'error' => $e->getMessage()
        ]);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'L\'ID du produit est requis pour la suppression.'
        ]);
        exit;
    }

    $product_id = intval($_GET['id']);
    
    try {
        $pdo = getDatabaseConnection();
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$product_id]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Produit supprimé avec succès.'
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Erreur lors de la suppression en base de données',
            'error' => $e->getMessage()
        ]);
        exit;
    }
}

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
        WHERE p.status IN ('available', 'sold')
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