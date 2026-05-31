<?php
/**
 * Mercato Nova - Send Message Endpoint
 * Registers a sent chat message in the database.
 */

// Allow CORS requests
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Méthode non autorisée. Veuillez utiliser POST."
    ]);
    exit();
}

require_once __DIR__ . '/init_db.php';

try {
    ensureMessagingTableExists();
    
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (empty($input['sender_id']) || empty($input['receiver_id']) || empty($input['message'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données manquantes (sender_id, receiver_id ou message)."
        ]);
        exit();
    }

    $sender_id = intval($input['sender_id']);
    $receiver_id = intval($input['receiver_id']);
    $message = trim($input['message']);

    if ($message === '') {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Le contenu du message ne peut pas être vide."
        ]);
        exit();
    }

    $pdo = getDatabaseConnection();

    $stmt = $pdo->prepare("
        INSERT INTO messages (sender_id, receiver_id, message, is_read)
        VALUES (:sender_id, :receiver_id, :message, 0)
    ");
    $stmt->execute([
        ':sender_id' => $sender_id,
        ':receiver_id' => $receiver_id,
        ':message' => $message
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Message envoyé avec succès.",
        "data" => [
            "id" => $pdo->lastInsertId(),
            "sender_id" => $sender_id,
            "receiver_id" => $receiver_id,
            "message" => $message,
            "is_read" => 0,
            "created_at" => date('Y-m-d H:i:s')
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de l'enregistrement du message.",
        "error" => $e->getMessage()
    ]);
}
