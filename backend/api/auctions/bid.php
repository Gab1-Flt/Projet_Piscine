<?php
/**
 * Mercato Nova - Place Bid Endpoint
 * Submits a new bid for an active auction, updating database values.
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

    if (empty($input['auction_id']) || empty($input['buyer_id']) || empty($input['amount'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Données manquantes (ID enchère, ID acheteur ou montant de l'offre)."
        ]);
        exit();
    }

    $auctionId = (int)$input['auction_id'];
    $buyerId = (int)$input['buyer_id'];
    $amount = (float)$input['amount'];

    $pdo = getDatabaseConnection();

    // Check if the auction exists and is active
    $stmt = $pdo->prepare("SELECT id, product_id, start_price, current_bid, highest_bidder_id, end_date, status FROM auctions WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $auctionId]);
    $auction = $stmt->fetch();

    if (!$auction) {
        http_response_code(444);
        echo json_encode([
            "status" => "error",
            "message" => "Enchère introuvable."
        ]);
        exit();
    }

    if ($auction['status'] !== 'active') {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Cette enchère n'est plus active."
        ]);
        exit();
    }

    // Check if end_date has passed
    $endDate = strtotime($auction['end_date']);
    if ($endDate < time()) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Cette enchère est clôturée."
        ]);
        exit();
    }

    // Verify bid amount is higher than current bid
    $currentBid = (float)$auction['current_bid'];
    if ($amount <= $currentBid) {
        http_response_code(409);
        echo json_encode([
            "status" => "error",
            "message" => "Votre offre doit être supérieure à l'offre actuelle (" . number_format($currentBid, 2, ',', ' ') . " €)."
        ]);
        exit();
    }

    // Anti-Sniping Rule: If less than 60 seconds are left, extend by 60 seconds
    $timeLeft = $endDate - time();
    $newEndDate = $auction['end_date'];
    $snipingTriggered = false;

    if ($timeLeft < 60) {
        $newEndDate = date('Y-m-d H:i:s', time() + 60);
        $snipingTriggered = true;
    }

    // Update auction values inside a transaction to ensure safety
    $pdo->beginTransaction();

    $updateStmt = $pdo->prepare("
        UPDATE auctions 
        SET current_bid = :amount, 
            highest_bidder_id = :buyer_id, 
            end_date = :end_date 
        WHERE id = :id
    ");
    $updateStmt->execute([
        ':amount' => $amount,
        ':buyer_id' => $buyerId,
        ':end_date' => $newEndDate,
        ':id' => $auctionId
    ]);

    // Retrieve bidder name
    $userStmt = $pdo->prepare("SELECT username FROM users WHERE id = :id LIMIT 1");
    $userStmt->execute([':id' => $buyerId]);
    $user = $userStmt->fetch();
    $bidderName = $user ? $user['username'] : 'Vous';

    $pdo->commit();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Votre offre a été placée en tête du réseau !",
        "data" => [
            "auction_id" => $auctionId,
            "current_bid" => $amount,
            "highest_bidder_id" => $buyerId,
            "highest_bidder_name" => $bidderName,
            "end_date" => $newEndDate,
            "sniping_extended" => $snipingTriggered
        ]
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur de base de données lors de la soumission de l'offre.",
        "error" => $e->getMessage()
    ]);
}
