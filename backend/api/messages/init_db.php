<?php
/**
 * Mercato Nova - Messaging Table Initializer
 * Automatically handles creation of the messages table and seeds it if empty.
 */
require_once __DIR__ . '/../../config/database.php';

function ensureMessagingTableExists() {
    $pdo = getDatabaseConnection();
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `messages` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `sender_id` INT NOT NULL,
                `receiver_id` INT NOT NULL,
                `message` TEXT NOT NULL,
                `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
                CONSTRAINT `fk_message_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
        
        // Check if there are any messages, if not seed some mock messages
        $stmt = $pdo->query("SELECT COUNT(*) FROM messages");
        $count = $stmt->fetchColumn();
        
        if ($count == 0) {
            // Seed default messages between gabin_lead (ID: 1), drift_king (ID: 6) and takumi_86 (ID: 5)
            $seedStmt = $pdo->prepare("
                INSERT INTO messages (sender_id, receiver_id, message, is_read, created_at) VALUES
                (1, 5, 'Bienvenue sur le réseau sécurisé Mercato Nova, Takumi ! Prêt à drifter dans le Touge ?', 1, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
                (5, 1, 'Salut Gabin. Oui, toujours prêt. Est-ce que le HKS GTIII Turbo est encore en stock ?', 1, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
                (1, 5, 'Yes ! Je viens de le vérifier, il est 100% fonctionnel et prêt pour un swap sur ton 4A-GE ou une autre prep.', 0, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
                (6, 5, 'Takumi ! Je t\'attends au mont Haruna ce soir pour tester ton nouveau set de combinés filetés.', 0, DATE_SUB(NOW(), INTERVAL 45 MINUTE))
            ");
            $seedStmt->execute();
        }
    } catch (PDOException $e) {
        // Log database error silently or return error
        header('Content-Type: application/json', true, 500);
        echo json_encode([
            "status" => "error",
            "message" => "Impossible d'initialiser la table de messagerie SQL.",
            "error" => $e->getMessage()
        ]);
        exit();
    }
}
