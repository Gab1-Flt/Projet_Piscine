-- ====================================================================
-- MERCATO NOVA - DATABASE SETUP SCRIPT
-- Specialized JDM E-Commerce Platform
-- Designed for MAMP / MySQL
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `mercato_nova`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `mercato_nova`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `negotiations`;
DROP TABLE IF EXISTS `auctions`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- --------------------------------------------------------------------

CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
    `account_status` ENUM('active', 'suspended', 'deleted') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- --------------------------------------------------------------------

CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- Product = marketplace listing.
-- Can represent either a JDM vehicle or a JDM part.
-- --------------------------------------------------------------------

CREATE TABLE `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,

    `seller_id` INT NOT NULL,
    `category_id` INT NOT NULL,

    `title` VARCHAR(150) NOT NULL,
    `brand` VARCHAR(50) NOT NULL,
    `model` VARCHAR(80) NOT NULL,
    `year` INT DEFAULT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `mileage` INT DEFAULT NULL,

    `description` TEXT,
    `image_url` VARCHAR(255) DEFAULT NULL,

    `product_type` ENUM('vehicle', 'part') NOT NULL DEFAULT 'vehicle',
    `status` ENUM('available', 'sold', 'suspended') NOT NULL DEFAULT 'available',
    `sale_type` ENUM('direct', 'auction', 'negotiation', 'both') NOT NULL DEFAULT 'negotiation',

    `stock` INT NOT NULL DEFAULT 1,

    `reference_piece` VARCHAR(100) DEFAULT NULL,
    `compatibility` TEXT DEFAULT NULL,

    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_product_seller`
        FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT `fk_product_category`
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. AUCTIONS TABLE
-- --------------------------------------------------------------------

CREATE TABLE `auctions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL UNIQUE,

    `start_price` DECIMAL(12, 2) NOT NULL,
    `current_bid` DECIMAL(12, 2) NOT NULL,
    `highest_bidder_id` INT DEFAULT NULL,

    `start_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `end_date` DATETIME NOT NULL,
    `status` ENUM('active', 'finished', 'cancelled') NOT NULL DEFAULT 'active',

    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_auction_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT `fk_auction_bidder`
        FOREIGN KEY (`highest_bidder_id`) REFERENCES `users` (`id`)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. NEGOTIATIONS TABLE
-- --------------------------------------------------------------------

CREATE TABLE `negotiations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,

    `product_id` INT NOT NULL,
    `buyer_id` INT NOT NULL,

    `offered_price` DECIMAL(12, 2) NOT NULL,
    `buyer_message` TEXT DEFAULT NULL,
    `seller_response` TEXT DEFAULT NULL,

    `status` ENUM('pending', 'accepted', 'rejected', 'counter_offer', 'expired', 'cancelled') NOT NULL DEFAULT 'pending',

    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `end_date` DATETIME DEFAULT NULL,

    CONSTRAINT `fk_negotiation_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT `fk_negotiation_buyer`
        FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. CARTS TABLE
-- --------------------------------------------------------------------

CREATE TABLE `carts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `buyer_id` INT NOT NULL,
    `status` ENUM('active', 'validated', 'abandoned') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_cart_buyer`
        FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. CART ITEMS TABLE
-- --------------------------------------------------------------------

CREATE TABLE `cart_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cart_id` INT NOT NULL,
    `product_id` INT NOT NULL,

    `quantity` INT NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(12, 2) NOT NULL,

    CONSTRAINT `fk_cart_item_cart`
        FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT `fk_cart_item_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. TRANSACTIONS TABLE
-- --------------------------------------------------------------------

CREATE TABLE `transactions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,

    `buyer_id` INT NOT NULL,
    `product_id` INT NOT NULL,

    `amount` DECIMAL(12, 2) NOT NULL,
    `transaction_type` ENUM('direct', 'auction', 'negotiation') NOT NULL,
    `payment_method` ENUM('card_simulated', 'bank_transfer_simulated', 'paypal_simulated') NOT NULL DEFAULT 'card_simulated',
    `status` ENUM('pending', 'validated', 'cancelled') NOT NULL DEFAULT 'pending',

    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_transaction_buyer`
        FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT `fk_transaction_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 9. NOTIFICATIONS TABLE
-- --------------------------------------------------------------------

CREATE TABLE `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,

    `user_id` INT NOT NULL,

    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('purchase', 'auction', 'negotiation', 'admin', 'system') NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,

    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_notification_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA
-- Default password for all seeded users: password123
-- ====================================================================

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `account_status`) VALUES
(1, 'gabin_lead', 'gabin@mercatonova.com', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'admin', 'active'),
(2, 'celestin_back', 'celestin@mercatonova.com', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'seller', 'active'),
(3, 'paul_auctions', 'paul@mercatonova.com', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'seller', 'active'),
(4, 'nicolas_nego', 'nicolas@mercatonova.com', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'seller', 'active'),
(5, 'takumi_86', 'takumi.fujiwara@akina.jp', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'buyer', 'active'),
(6, 'drift_king', 'keiichi.tsuchiya@hotversion.jp', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'buyer', 'active');

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Vehicles', 'Imported JDM cars and collector vehicles'),
(2, 'Engines', 'JDM engines and swap-ready powertrains'),
(3, 'Turbo', 'Turbochargers and performance parts'),
(4, 'Wheels', 'JDM wheels and rims'),
(5, 'Bodywork', 'Exterior parts and body kits');

INSERT INTO `products` (
    `id`, `seller_id`, `category_id`, `title`, `brand`, `model`, `year`, `price`, `mileage`,
    `description`, `image_url`, `product_type`, `status`, `sale_type`, `stock`,
    `reference_piece`, `compatibility`
) VALUES
(1, 2, 1, 'Toyota Supra RZ MK4', 'Toyota', 'Supra RZ MK4', 1994, 75000.00, 82000,
 'Legendary Toyota Supra MK4 RZ with the iconic twin-turbo 2JZ-GTE engine. Completely stock, imported directly from Shizuoka.',
 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80',
 'vehicle', 'available', 'auction', 1, NULL, NULL),

(2, 3, 1, 'Nissan Skyline GT-R R34 V-Spec II', 'Nissan', 'Skyline GT-R R34 V-Spec II', 2002, 185000.00, 48500,
 'Rare Bayside Blue V-Spec II with the RB26DETT. Fully documented service record, immaculate engine bay.',
 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
 'vehicle', 'available', 'negotiation', 1, NULL, NULL),

(3, 4, 1, 'Mazda RX-7 FD3S Spirit R Type A', 'Mazda', 'RX-7 FD3S Spirit R Type A', 2002, 95000.00, 56000,
 'Spirit R model with sequential twin-turbo 13B-REW rotary engine.',
 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
 'vehicle', 'available', 'negotiation', 1, NULL, NULL),

(4, 2, 1, 'Honda NSX-R NA2', 'Honda', 'NSX-R NA2', 2002, 220000.00, 24000,
 'Championship White NSX-R NA2. Rare weight-reduced high-performance model.',
 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
 'vehicle', 'available', 'auction', 1, NULL, NULL),

(5, 3, 1, 'Subaru Impreza WRX STI 22B GC8', 'Subaru', 'Impreza WRX STI 22B GC8', 1998, 150000.00, 18900,
 'Limited widebody icon built to celebrate Subaru WRC success.',
 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
 'vehicle', 'available', 'auction', 1, NULL, NULL),

(6, 2, 2, 'Toyota 2JZ-GTE Engine', 'Toyota', '2JZ-GTE', NULL, 12500.00, NULL,
 'Complete Toyota 2JZ-GTE engine, ideal for Supra or swap projects.',
 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
 'part', 'available', 'negotiation', 1, '2JZ-GTE-VVTi', 'Toyota Supra MK4, Lexus GS300, swap projects'),

(7, 2, 3, 'HKS GTIII Turbo', 'HKS', 'GTIII', NULL, 2200.00, NULL,
 'New HKS GTIII turbo for JDM performance builds.',
 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=800&q=80',
 'part', 'available', 'direct', 3, 'HKS-GTIII-RS', 'RB26, 2JZ, SR20 with adaptation');

INSERT INTO `auctions` (
    `id`, `product_id`, `start_price`, `current_bid`, `highest_bidder_id`, `end_date`, `status`
) VALUES
(1, 1, 75000.00, 78000.00, 5, DATE_ADD(NOW(), INTERVAL 7 DAY), 'active'),
(2, 4, 220000.00, 225000.00, 6, DATE_ADD(NOW(), INTERVAL 7 DAY), 'active'),
(3, 5, 150000.00, 150000.00, NULL, DATE_ADD(NOW(), INTERVAL 7 DAY), 'active');

INSERT INTO `negotiations` (
    `id`, `product_id`, `buyer_id`, `offered_price`, `buyer_message`, `seller_response`, `status`, `end_date`
) VALUES
(1, 2, 5, 175000.00, 'Would you accept 175000 for the R34?', NULL, 'pending', DATE_ADD(NOW(), INTERVAL 5 DAY)),
(2, 2, 6, 180000.00, 'I can offer 180000 if inspection is clean.', NULL, 'pending', DATE_ADD(NOW(), INTERVAL 5 DAY)),
(3, 3, 5, 90000.00, 'Offer for RX-7.', 'Too low for this Spirit R.', 'rejected', DATE_ADD(NOW(), INTERVAL 5 DAY)),
(4, 3, 6, 95000.00, 'I accept the listed price.', 'Accepted.', 'accepted', DATE_ADD(NOW(), INTERVAL 5 DAY));

INSERT INTO `carts` (`id`, `buyer_id`, `status`) VALUES
(1, 5, 'active'),
(2, 6, 'validated');

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 7, 1, 2200.00),
(2, 2, 7, 1, 2200.00);

INSERT INTO `transactions` (
    `id`, `buyer_id`, `product_id`, `amount`, `transaction_type`, `payment_method`, `status`
) VALUES
(1, 6, 7, 2200.00, 'direct', 'card_simulated', 'validated'),
(2, 6, 3, 95000.00, 'negotiation', 'bank_transfer_simulated', 'validated');

INSERT INTO `notifications` (
    `id`, `user_id`, `title`, `message`, `type`, `is_read`
) VALUES
(1, 5, 'Bid registered', 'Your bid on the Toyota Supra MK4 is currently the highest bid.', 'auction', FALSE),
(2, 3, 'New negotiation offer', 'A buyer submitted an offer for the Nissan Skyline R34.', 'negotiation', FALSE),
(3, 6, 'Purchase validated', 'Your purchase of the HKS GTIII Turbo has been validated.', 'purchase', FALSE),
(4, 1, 'Admin alert', 'A new transaction has been validated on the platform.', 'admin', FALSE);