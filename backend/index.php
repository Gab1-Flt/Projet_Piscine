<?php
/**
 * Mercato Nova - Backend Core Router & CORS Entry Point
 * Designed for pure PHP REST API.
 */

// Allow from any origin (Update in production with specific frontend domain)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

// Set standard headers for JSON REST Responses
header('Content-Type: application/json; charset=utf-8');

// Include database connection file
require_once __DIR__ . '/config/database.php';

// Extract requesting URI
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Simple root router endpoint for verification
if ($requestUri === '/' || $requestUri === '/index.php' || $requestUri === '/api' || $requestUri === '/api/') {
    echo json_encode([
        "status" => "success",
        "message" => "Welcome to the Mercato Nova JDM REST API!",
        "version" => "1.0.0",
        "api_endpoints" => [
            "auth" => "/api/auth/",
            "products" => "/api/products/",
            "auctions" => "/api/auctions/",
            "negotiations" => "/api/negotiations/"
        ]
    ]);
    exit();
}

// Fallback for non-matching API endpoints during scaffolding
http_response_code(404);
echo json_encode([
    "status" => "error",
    "message" => "Endpoint not found or under construction.",
    "requested_uri" => $requestUri
]);
