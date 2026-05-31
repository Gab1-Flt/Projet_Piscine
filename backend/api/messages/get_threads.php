<?php
/**
 * Mercato Nova - Get Message Threads Endpoint
 * Returns a list of active conversation threads (other users + last message + unread count)
 * and suggested contacts for the current user.
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

    if (empty($_GET['user_id'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données manquantes (user_id est requis)."
        ]);
        exit();
    }

    $user_id = intval($_GET['user_id']);
    $pdo = getDatabaseConnection();
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);

    // Query active threads
    $sqlThreads = "
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.role,
            (
                SELECT m.message 
                FROM messages m 
                WHERE (m.sender_id = :user_id AND m.receiver_id = u.id) 
                   OR (m.sender_id = u.id AND m.receiver_id = :user_id) 
                ORDER BY m.created_at DESC LIMIT 1
            ) AS last_message,
            (
                SELECT m.created_at 
                FROM messages m 
                WHERE (m.sender_id = :user_id AND m.receiver_id = u.id) 
                   OR (m.sender_id = u.id AND m.receiver_id = :user_id) 
                ORDER BY m.created_at DESC LIMIT 1
            ) AS last_message_time,
            (
                SELECT COUNT(*) 
                FROM messages m 
                WHERE m.sender_id = u.id AND m.receiver_id = :user_id AND m.is_read = 0
            ) AS unread_count
        FROM users u
        WHERE u.id != :user_id 
          AND EXISTS (
              SELECT 1 FROM messages m 
              WHERE (m.sender_id = :user_id AND m.receiver_id = u.id) 
                 OR (m.sender_id = u.id AND m.receiver_id = :user_id)
          )
        ORDER BY last_message_time DESC
    ";

    $stmtThreads = $pdo->prepare($sqlThreads);
    $stmtThreads->execute([':user_id' => $user_id]);
    $threads = $stmtThreads->fetchAll();

    // Query suggested/potential contacts (users we haven't messaged yet, or just general users)
    $sqlSuggestions = "
        SELECT id, username, email, role 
        FROM users 
        WHERE id != :user_id 
          AND id NOT IN (
              SELECT DISTINCT sender_id FROM messages WHERE receiver_id = :user_id
              UNION
              SELECT DISTINCT receiver_id FROM messages WHERE sender_id = :user_id
          )
        LIMIT 5
    ";
    
    $stmtSuggestions = $pdo->prepare($sqlSuggestions);
    $stmtSuggestions->execute([':user_id' => $user_id]);
    $suggestions = $stmtSuggestions->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => [
            "threads" => $threads,
            "suggestions" => $suggestions
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors du chargement des discussions.",
        "error" => $e->getMessage()
    ]);
}
