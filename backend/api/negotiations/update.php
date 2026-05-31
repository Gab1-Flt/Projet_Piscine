<?php
/**
 * Mercato Nova - Update Negotiation API
 * Handles accepting, rejecting, or placing a counter-offer on a negotiation.
 */

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../../config/database.php';

try {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (empty($input['id']) || empty($input['action']) || empty($input['user_id'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données incomplètes : id, action et user_id requis."
        ]);
        exit();
    }

    $nego_id = intval($input['id']);
    $action = trim($input['action']);
    $user_id = intval($input['user_id']);
    $pdo = getDatabaseConnection();

    // 1. Fetch the negotiation and check existence
    $stmt = $pdo->prepare("
        SELECT n.*, p.seller_id, p.title AS product_title, u_buyer.username AS buyer_username, u_seller.username AS seller_username
        FROM negotiations n
        JOIN products p ON n.product_id = p.id
        JOIN users u_buyer ON n.buyer_id = u_buyer.id
        JOIN users u_seller ON p.seller_id = u_seller.id
        WHERE n.id = ?
        LIMIT 1
    ");
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

    $buyer_id = intval($nego['buyer_id']);
    $seller_id = intval($nego['seller_id']);
    
    if ($user_id !== $buyer_id && $user_id !== $seller_id) {
        http_response_code(403);
        echo json_encode([
            "status" => "error",
            "message" => "Vous n'êtes pas autorisé à modifier cette négociation."
        ]);
        exit();
    }

    $pdo->beginTransaction();

    $new_status = $nego['status'];
    $new_price = floatval($nego['offered_price']);
    $chat_message = "";

    // Determine receiver of message
    $receiver_id = ($user_id === $buyer_id) ? $seller_id : $buyer_id;

    if ($action === 'accept') {
        $new_status = 'accepted';
        $chat_message = "NÉGOCIATION ACCEPTÉE ! L'offre finale de " . number_format($new_price, 0, ',', ' ') . " € pour " . $nego['product_title'] . " est validée.";
    } elseif ($action === 'reject') {
        $new_status = 'rejected';
        $chat_message = "Proposition de négociation refusée pour " . $nego['product_title'] . ".";
    } elseif ($action === 'counter') {
        if (empty($input['price'])) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Le montant de la contre-proposition (price) est requis."
            ]);
            exit();
        }
        $new_status = 'counter_offer';
        $new_price = floatval($input['price']);
        
        $actor_name = ($user_id === $seller_id) ? "Le vendeur @" . $nego['seller_username'] : "L'acheteur @" . $nego['buyer_username'];
        $chat_message = "Nouvelle contre-proposition de " . $actor_name . " à " . number_format($new_price, 0, ',', ' ') . " €.";
    } else {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Action invalide. Utilisez 'accept', 'reject' ou 'counter'."
        ]);
        exit();
    }

    // 2. Update negotiations table
    $stmtUpdate = $pdo->prepare("
        UPDATE negotiations 
        SET status = :status, offered_price = :price 
        WHERE id = :id
    ");
    $stmtUpdate->execute([
        ':status' => $new_status,
        ':price' => $new_price,
        ':id' => $nego_id
    ]);

    // 3. Insert notification/system message into messages table
    $stmtMsg = $pdo->prepare("
        INSERT INTO messages (sender_id, receiver_id, message, is_read) 
        VALUES (:sender_id, :receiver_id, :message, 0)
    ");
    $stmtMsg->execute([
        ':sender_id' => $user_id,
        ':receiver_id' => $receiver_id,
        ':message' => $chat_message
    ]);

    // 4. Insert notification for the receiver
    $notif_title = "";
    if ($action === 'accept') $notif_title = "Négociation Acceptée";
    elseif ($action === 'reject') $notif_title = "Négociation Refusée";
    else $notif_title = "Nouvelle Contre-offre";
    
    $stmtNotif = $pdo->prepare("
        INSERT INTO notifications (user_id, title, message, type) 
        VALUES (:user_id, :title, :message, 'negotiation')
    ");
    $stmtNotif->execute([
        ':user_id' => $receiver_id,
        ':title' => $notif_title,
        ':message' => $chat_message
    ]);

    $pdo->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Négociation mise à jour avec succès.",
        "data" => [
            "negotiation_id" => $nego_id,
            "status" => $new_status,
            "offered_price" => $new_price
        ]
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de la mise à jour de la négociation.",
        "error" => $e->getMessage()
    ]);
}
