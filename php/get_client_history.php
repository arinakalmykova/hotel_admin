<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $clientId = $_POST['client_id'];
    $query = "
        SELECT дата_заселения as check_in, дата_выселения as check_out
        FROM Заселение
        WHERE код_клиента = :clientId
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute(['clientId' => $clientId]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($history);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>
