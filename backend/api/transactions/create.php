<?php
/**
 * Mercato Nova - Create Transaction Endpoint
 * Registers purchase transactions in the MySQL database and sets product status to 'sold'.
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

    if (empty($input['buyer_id'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données manquantes : buyer_id est requis."
        ]);
        exit();
    }

    $buyer_id = intval($input['buyer_id']);
    
    // Map payment method to DB ENUM: 'card_simulated', 'bank_transfer_simulated', 'paypal_simulated'
    $rawPayment = isset($input['payment_method']) ? trim($input['payment_method']) : 'card';
    $payment_method = 'card_simulated';
    if ($rawPayment === 'bank') {
        $payment_method = 'bank_transfer_simulated';
    } elseif ($rawPayment === 'crypto') {
        $payment_method = 'paypal_simulated'; // Crypto mapped to paypal_simulated in current DB schema
    }

    // Map transaction type to DB ENUM: 'direct', 'auction', 'negotiation'
    $rawType = isset($input['transaction_type']) ? trim($input['transaction_type']) : 'direct';
    $transaction_type = 'direct';
    if ($rawType === 'auction') {
        $transaction_type = 'auction';
    } elseif ($rawType === 'negotiation') {
        $transaction_type = 'negotiation';
    }

    $pdo = getDatabaseConnection();

    // Handle Custom Preparation Order
    if (!empty($input['is_preparation']) && $input['is_preparation'] === true) {
        $details = $input['preparation_details'];
        if (empty($details['title']) || empty($details['price'])) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Détails de préparation manquants (titre ou montant total)."
            ]);
            exit();
        }

        $title = trim($details['title']);
        $brand = isset($details['brand']) ? trim($details['brand']) : 'JDM';
        $model = isset($details['model']) ? trim($details['model']) : 'Custom';
        $price = floatval($details['price']);
        $description = isset($details['description']) ? trim($details['description']) : 'Custom preparation package';

        // 1. Create a dummy/shadow product for the custom order (so we have a valid product_id for foreign keys)
        $pdo->beginTransaction();

        $prodStmt = $pdo->prepare("
            INSERT INTO products (
                seller_id, category_id, title, brand, model, price, description, 
                product_type, status, sale_type, stock
            ) VALUES (
                1, -- Admin/System seller ID
                1, -- Category: Vehicles
                :title, :brand, :model, :price, :description,
                'vehicle', 'sold', 'direct', 1
            )
        ");
        $prodStmt->execute([
            ':title' => $title,
            ':brand' => $brand,
            ':model' => $model,
            ':price' => $price,
            ':description' => $description
        ]);
        $product_id = $pdo->lastInsertId();

        // 2. Insert transaction
        $transStmt = $pdo->prepare("
            INSERT INTO transactions (
                buyer_id, product_id, amount, transaction_type, payment_method, status
            ) VALUES (
                :buyer_id, :product_id, :amount, :transaction_type, :payment_method, 'validated'
            )
        ");
        $transStmt->execute([
            ':buyer_id' => $buyer_id,
            ':product_id' => $product_id,
            ':amount' => $price,
            ':transaction_type' => 'direct',
            ':payment_method' => $payment_method
        ]);
        $transaction_id = $pdo->lastInsertId();

        $pdo->commit();

        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "La transaction de préparation personnalisée a été enregistrée avec succès.",
            "transaction_ids" => [$transaction_id]
        ]);
        exit();
    }

    // Handle Standard Purchases (Cart, Auctions, Negotiations)
    if (empty($input['items']) || !is_array($input['items'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données de transaction manquantes (aucun article fourni)."
        ]);
        exit();
    }

    $pdo->beginTransaction();
    $transaction_ids = [];

    foreach ($input['items'] as $item) {
        if (empty($item['product_id']) || empty($item['amount'])) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Un ou plusieurs articles ont des données invalides (id ou montant manquant)."
            ]);
            exit();
        }

        $product_id = intval($item['product_id']);
        $amount = floatval($item['amount']);

        // Check if product exists in database
        $checkStmt = $pdo->prepare("SELECT id, status FROM products WHERE id = :id LIMIT 1");
        $checkStmt->execute([':id' => $product_id]);
        $product = $checkStmt->fetch();

        if (!$product) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode([
                "status" => "error",
                "message" => "Le produit avec l'ID {$product_id} est introuvable."
            ]);
            exit();
        }

        // Insert transaction record
        $transStmt = $pdo->prepare("
            INSERT INTO transactions (
                buyer_id, product_id, amount, transaction_type, payment_method, status
            ) VALUES (
                :buyer_id, :product_id, :amount, :transaction_type, :payment_method, 'validated'
            )
        ");
        $transStmt->execute([
            ':buyer_id' => $buyer_id,
            ':product_id' => $product_id,
            ':amount' => $amount,
            ':transaction_type' => $transaction_type,
            ':payment_method' => $payment_method
        ]);
        $transaction_ids[] = $pdo->lastInsertId();

        // Update product status to sold
        $updateStmt = $pdo->prepare("UPDATE products SET status = 'sold' WHERE id = :id");
        $updateStmt->execute([':id' => $product_id]);
    }

    $pdo->commit();

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Les transactions ont été enregistrées avec succès en base de données.",
        "transaction_ids" => $transaction_ids
    ]);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de l'enregistrement de la transaction en base de données.",
        "error" => $e->getMessage()
    ]);
}
