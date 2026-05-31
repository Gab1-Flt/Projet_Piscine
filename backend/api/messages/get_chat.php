<?php
/**
 * Mercato Nova - Get Message Chat History Endpoint
 * Returns all messages exchanged between two users and marks received ones as read.
 */

// Allow CORS requests
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Méthode non autorisée. Veuillez utiliser GET."
    ]);
    exit();
}

require_once __DIR__ . '/init_db.php';

try {
    ensureMessagingTableExists();

    if (empty($_GET['user_id']) || empty($_GET['contact_id'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données manquantes (user_id et contact_id sont requis)."
        ]);
        exit();
    }

    $user_id = intval($_GET['user_id']);
    $contact_id = intval($_GET['contact_id']);
    
    $pdo = getDatabaseConnection();
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);

    // 1. Fetch messages exchanged between the two users
    $stmt = $pdo->prepare("
        SELECT id, sender_id, receiver_id, message, is_read, created_at
        FROM messages
        WHERE (sender_id = :user_id AND receiver_id = :contact_id)
           OR (sender_id = :contact_id AND receiver_id = :user_id)
        ORDER BY created_at ASC
    ");
    $stmt->execute([
        ':user_id' => $user_id,
        ':contact_id' => $contact_id
    ]);
    $messages = $stmt->fetchAll();

    // 2. Mark received messages as read
    $updateStmt = $pdo->prepare("
        UPDATE messages
        SET is_read = 1
        WHERE sender_id = :contact_id AND receiver_id = :user_id AND is_read = 0
    ");
    $updateStmt->execute([
        ':contact_id' => $contact_id,
        ':user_id' => $user_id
    ]);

    echo json_encode([
        "status" => "success",
        "data" => $messages
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors du chargement des messages.",
        "error" => $e->getMessage()
    ]);
}
