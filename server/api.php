<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));

// Simple Routing
switch ($request[0]) {
    case 'products':
        if ($method == 'GET') {
            if (isset($request[1])) {
                // Get single product
                $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
                $stmt->execute([$request[1]]);
                $product = $stmt->fetch();
                
                if ($product) {
                    // Get images
                    $stmt = $pdo->prepare("SELECT image_url FROM product_images WHERE product_id = ?");
                    $stmt->execute([$product['id']]);
                    $product['images'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
                    
                    // Get variants
                    $stmt = $pdo->prepare("SELECT * FROM variants WHERE product_id = ?");
                    $stmt->execute([$product['id']]);
                    $product['variants'] = $stmt->fetchAll();
                    
                    // Get extras
                    $stmt = $pdo->prepare("SELECT * FROM extras WHERE product_id = ?");
                    $stmt->execute([$product['id']]);
                    $product['extras'] = $stmt->fetchAll();
                    
                    echo json_encode($product);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Product not found"]);
                }
            } else {
                // Get all products
                $stmt = $pdo->query("SELECT * FROM products");
                $products = $stmt->fetchAll();
                foreach ($products as &$p) {
                    $stmt = $pdo->prepare("SELECT image_url FROM product_images WHERE product_id = ? AND is_main = 1");
                    $stmt->execute([$p['id']]);
                    $p['images'] = [$stmt->fetchColumn()];
                }
                echo json_encode($products);
            }
        }
        break;

    case 'orders':
        if ($method == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $order_number = 'ORD-' . strtoupper(uniqid());
            
            $pdo->beginTransaction();
            try {
                $stmt = $pdo->prepare("INSERT INTO orders (order_number, customer_name, phone, email, address, total_amount) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $order_number,
                    $data['name'],
                    $data['phone'],
                    $data['email'],
                    $data['address'] . ', ' . $data['city'] . ', ' . $data['postcode'],
                    $data['total']
                ]);
                $order_id = $pdo->lastInsertId();
                
                foreach ($data['items'] as $item) {
                    $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_name, variant_name, quantity, price) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([
                        $order_id,
                        $item['productName'],
                        $item['variantName'],
                        $item['quantity'],
                        $item['price']
                    ]);
                }
                
                $pdo->commit();
                echo json_encode(["id" => $order_number]);
            } catch (Exception $e) {
                $pdo->rollBack();
                http_response_code(500);
                echo json_encode(["error" => $e->getMessage()]);
            }
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
        break;
}
?>
