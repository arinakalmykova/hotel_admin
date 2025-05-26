<?php
header('Content-Type: application/json');
require_once 'db.php';
file_put_contents('child_client.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . 
    "\nFILES: " . print_r($_FILES, true), 
    FILE_APPEND
);
try {
    $clientId = $_POST['client_id'];
    $query = "
        SELECT имя as firstName, фамилия as lastName,отчество as middleName,  дата_рождения as birthDate
        FROM дети
        WHERE код_клиента = :clientId
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute(['clientId' => $clientId]);
    $children = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($children);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>
