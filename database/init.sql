-- ====================================================================
-- MERCATO NOVA - DATABASE SETUP SCRIPT
-- Specialized JDM (Japanese Domestic Market) E-Commerce Platform
-- Designed for MAMP / MySQL
-- ====================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `mercato_nova` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mercato_nova`;

-- Disable foreign key checks to allow clean table re-creation
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores accounts for buyers, sellers, and system administrators.
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. PRODUCTS TABLE (Car Catalogue)
-- Contains the vehicle specifications, seller information, and sales model.
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `brand` VARCHAR(50) NOT NULL,
    `model` VARCHAR(50) NOT NULL,
    `year` INT NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL, -- Direct buy price OR starting bid price
    `mileage` INT NOT NULL, -- in Kilometers (km)
    `description` TEXT,
    `image_url` VARCHAR(255) DEFAULT NULL,
    `status` ENUM('available', 'sold') NOT NULL DEFAULT 'available',
    `sale_type` ENUM('auction', 'negotiation', 'both') NOT NULL DEFAULT 'negotiation',
    `seller_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_product_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. AUCTIONS TABLE
-- Manages live bidding for cars sold under the auction model.
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `auctions`;
CREATE TABLE `auctions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL UNIQUE,
    `current_bid` DECIMAL(12, 2) NOT NULL,
    `highest_bidder_id` INT DEFAULT NULL,
    `end_date` DATETIME NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_auction_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_auction_bidder` FOREIGN KEY (`highest_bidder_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. NEGOTIATIONS TABLE (Offers)
-- Handles private buyer offers and direct negotiations with sellers.
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `negotiations`;
CREATE TABLE `negotiations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `buyer_id` INT NOT NULL,
    `offered_price` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_negotiation_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_negotiation_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- JDM SEED DATA
-- Default accounts and legendary vehicles to populate Mercato Nova
-- Password hashes generated using BCRYPT (default plain text: 'password123')
-- ====================================================================

-- Insert Users
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`) VALUES
(1, 'gabin_lead', 'gabin@mercatonova.com', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'admin'),
(2, 'celestin_back', 'celestin@mercatonova.com', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'seller'),
(3, 'paul_auctions', 'paul@mercatonova.com', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'seller'),
(4, 'nicolas_nego', 'nicolas@mercatonova.com', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'seller'),
(5, 'takumi_86', 'takumi.fujiwara@akina.jp', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'buyer'),
(6, 'drift_king', 'keiichi.tsuchiya@hotversion.jp', '$2y$10$wzW1qQfKxW03r2x6i.q17uyU6XN4F8P7B/hUe/c.z5Z/Y.q0F2U.y', 'buyer');

-- Insert JDM Products
INSERT INTO `products` (`id`, `brand`, `model`, `year`, `price`, `mileage`, `description`, `image_url`, `status`, `sale_type`, `seller_id`) VALUES
-- Toyota Supra MK4 (Auction)
(1, 'Toyota', 'Supra RZ MK4', 1994, 75000.00, 82000, 'Legendary Toyota Supra MK4 RZ with the iconic twin-turbo 2JZ-GTE engine. Completely stock, imported directly from Shizuoka. Clean history, minor body updates.', 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80', 'available', 'auction', 2),

-- Nissan Skyline R34 GT-R (Negotiation)
(2, 'Nissan', 'Skyline GT-R R34 V-Spec II', 2002, 185000.00, 48500, 'Rare Bayside Blue V-Spec II with the RB26DETT. Fully documented service record, immaculate engine bay, active aero functional, pristine interior.', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', 'available', 'negotiation', 3),

-- Mazda RX-7 FD3S (Negotiation)
(3, 'Mazda', 'RX-7 FD3S Spirit R Type A', 2002, 95000.00, 56000, '1 of only 1,500 Spirit R models. Features the sequential twin-turbo 13B-REW rotary engine. Recaro carbon-kevlar bucket seats, Bilstein suspension.', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', 'available', 'negotiation', 4),

-- Honda NSX-R (Auction)
(4, 'Honda', 'NSX-R NA2', 2002, 220000.00, 24000, 'Championship White NSX-R NA2. Extremely rare weight-reduced high-performance model. 3.2L C32B hand-balanced V6 engine. Museum quality.', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80', 'available', 'auction', 2),

-- Subaru Impreza 22B (Auction)
(5, 'Subaru', 'Impreza WRX STI 22B GC8', 1998, 150000.00, 18900, 'Number 142 of 400 limited widebody icons built to celebrate Subarus WRC hat-trick. 2.2L EJ22 engine, Bilstein dampers, gold BBS wheels.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', 'available', 'auction', 3);

-- Insert active Auctions
-- (All set to end in 7 days for development purposes)
INSERT INTO `auctions` (`id`, `product_id`, `current_bid`, `highest_bidder_id`, `end_date`) VALUES
(1, 1, 78000.00, 5, DATE_ADD(NOW(), INTERVAL 7 DAY)),
(2, 4, 225000.00, 6, DATE_ADD(NOW(), INTERVAL 7 DAY)),
(3, 5, 150000.00, NULL, DATE_ADD(NOW(), INTERVAL 7 DAY));

-- Insert active Negotiations / Offers
INSERT INTO `negotiations` (`id`, `product_id`, `buyer_id`, `offered_price`, `status`) VALUES
(1, 2, 5, 175000.00, 'pending'),
(2, 2, 6, 180000.00, 'pending'),
(3, 3, 5, 90000.00, 'rejected'),
(4, 3, 6, 95000.00, 'accepted');
