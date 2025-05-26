<?php
header('Content-Type: application/json');
require_once 'db.php';
file_put_contents('delete_client.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . 
    "\nFILES: " . print_r($_FILES, true), 
    FILE_APPEND
);

try {
 
    $clientId = $_POST['id'];

    // Удаление клиента
    $query = "DELETE FROM клиент WHERE код_клиента = :clientId";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['clientId' => $clientId]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>
