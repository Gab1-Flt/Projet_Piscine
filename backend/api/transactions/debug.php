<?php
/**
 * Mercato Nova - Transactions Debug & Seeding Script
 * Allows listing and generating fake/simulated transactions for database verification.
 */

// Allow CORS requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getDatabaseConnection();

    // Check if seeding is requested
    if (isset($_GET['seed_fake']) && $_GET['seed_fake'] === 'true') {
        
        // 1. Get available products to buy
        $prodStmt = $pdo->query("SELECT id, title, price, brand, model FROM products WHERE status = 'available' LIMIT 3");
        $products = $prodStmt->fetchAll();

        if (empty($products)) {
            // If all products are already sold, let's restore some for testing!
            $pdo->exec("UPDATE products SET status = 'available' WHERE status = 'sold' LIMIT 3");
            $prodStmt = $pdo->query("SELECT id, title, price, brand, model FROM products WHERE status = 'available' LIMIT 3");
            $products = $prodStmt->fetchAll();
            
            if (empty($products)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Aucun produit disponible en base pour simuler une transaction fictive, et impossible d'en restaurer."
                ]);
                exit();
            }
        }

        // 2. Get buyers
        $userStmt = $pdo->query("SELECT id, username FROM users WHERE role = 'buyer' LIMIT 2");
        $buyers = $userStmt->fetchAll();
        
        if (empty($buyers)) {
            // Fallback to any user
            $userStmt = $pdo->query("SELECT id, username FROM users LIMIT 2");
            $buyers = $userStmt->fetchAll();
        }

        $payment_methods = ['card_simulated', 'bank_transfer_simulated', 'paypal_simulated'];
        $transaction_types = ['direct', 'auction', 'negotiation'];
        
        $pdo->beginTransaction();
        $seeded = [];

        foreach ($products as $index => $product) {
            $buyer = $buyers[$index % count($buyers)];
            $method = $payment_methods[$index % count($payment_methods)];
            $type = $transaction_types[$index % count($transaction_types)];
            
            // Insert mock transaction
            $insStmt = $pdo->prepare("
                INSERT INTO transactions (
                    buyer_id, product_id, amount, transaction_type, payment_method, status
                ) VALUES (
                    :buyer_id, :product_id, :amount, :transaction_type, :payment_method, 'validated'
                )
            ");
            
            $amount = floatval($product['price']);
            $insStmt->execute([
                ':buyer_id' => $buyer['id'],
                ':product_id' => $product['id'],
                ':amount' => $amount,
                ':transaction_type' => $type,
                ':payment_method' => $method
            ]);
            $transId = $pdo->lastInsertId();

            // Update product status to sold
            $updStmt = $pdo->prepare("UPDATE products SET status = 'sold' WHERE id = :id");
            $updStmt->execute([':id' => $product['id']]);

            $seeded[] = [
                "transaction_id" => $transId,
                "buyer" => $buyer['username'],
                "product" => $product['brand'] . ' ' . $product['model'] . ' (ID: ' . $product['id'] . ')',
                "amount" => $amount,
                "type" => $type,
                "method" => $method,
                "status" => "validated"
            ];
        }

        $pdo->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Transactions fictives générées avec succès !",
            "seeded_transactions" => $seeded
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit();
    }

    // Default: List all transactions in raw format
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
            p.title AS product_title
        FROM transactions t
        LEFT JOIN users u ON t.buyer_id = u.id
        LEFT JOIN products p ON t.product_id = p.id
        ORDER BY t.created_at DESC
    ";
    
    $stmt = $pdo->query($sql);
    $allTrans = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "total_transactions" => count($allTrans),
        "data" => $allTrans
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur dans le script de débogage des transactions.",
        "error" => $e->getMessage()
    ]);
}
