<?php
/**
 * Mercato Nova - Create Negotiation API
 * Registers a new peer-to-peer negotiation and inserts the initial message into the chat system.
 */

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../messages/init_db.php';

try {
    ensureMessagingTableExists();
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (empty($input['product_id']) || empty($input['buyer_id']) || empty($input['offered_price'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données incomplètes : product_id, buyer_id et offered_price requis."
        ]);
        exit();
    }

    $product_id = intval($input['product_id']);
    $buyer_id = intval($input['buyer_id']);
    $offered_price = floatval($input['offered_price']);
    $buyer_message = !empty($input['message']) ? trim($input['message']) : "Je souhaite négocier le prix de cet article.";

    $pdo = getDatabaseConnection();

    // 1. Check if product exists and get the seller_id
    $stmtProd = $pdo->prepare("SELECT seller_id, title FROM products WHERE id = ?");
    $stmtProd->execute([$product_id]);
    $product = $stmtProd->fetch();

    if (!$product) {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Le produit spécifié est introuvable."
        ]);
        exit();
    }

    $seller_id = intval($product['seller_id']);

    if ($buyer_id === $seller_id) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Vous ne pouvez pas négocier avec vous-même !"
        ]);
        exit();
    }

    $pdo->beginTransaction();

    // 2. Insert into negotiations table
    $stmtNego = $pdo->prepare("
        INSERT INTO negotiations (
            product_id, buyer_id, offered_price, buyer_message, status, end_date
        ) VALUES (
            :product_id, :buyer_id, :offered_price, :buyer_message, 'pending', DATE_ADD(NOW(), INTERVAL 5 DAY)
        )
    ");
    
    $stmtNego->execute([
        ':product_id' => $product_id,
        ':buyer_id' => $buyer_id,
        ':offered_price' => $offered_price,
        ':buyer_message' => $buyer_message
    ]);
    
    $nego_id = $pdo->lastInsertId();

    // 3. Insert initial message in messages table (this links the negotiation to the chat system!)
    $stmtMsg = $pdo->prepare("
        INSERT INTO messages (
            sender_id, receiver_id, message, is_read
        ) VALUES (
            :sender_id, :receiver_id, :message, 0
        )
    ");

    // Compose a linked system-like notice
    $intro_chat_text = "Proposition de négociation pour " . $product['title'] . " à " . number_format($offered_price, 0, ',', ' ') . " €.\nMessage : \"" . $buyer_message . "\"";

    $stmtMsg->execute([
        ':sender_id' => $buyer_id,
        ':receiver_id' => $seller_id,
        ':message' => $intro_chat_text
    ]);

    $pdo->commit();

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "La négociation a été initialisée et liée à la messagerie.",
        "data" => [
            "negotiation_id" => $nego_id,
            "product_title" => $product['title'],
            "offered_price" => $offered_price
        ]
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de la création de la négociation",
        "error" => $e->getMessage()
    ]);
}
