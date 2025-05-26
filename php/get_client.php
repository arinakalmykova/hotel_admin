<?php
header('Content-Type: application/json');
require_once 'db.php';

try {

    $clientId = $_POST['id'];

    // 1. Получаем основные данные клиента
    $stmt = $pdo->prepare("
        SELECT 
            код_клиента as id,
            CONCAT_WS(' ', фамилия, имя, отчество) AS full_name,
            дата_рождения as date,
            номер_паспорта as pasport,
            номер_телефона as phone,
            почта as email
        FROM клиент
        WHERE код_клиента = ?
    ");
    $stmt->execute([$clientId]);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // 2. Получаем детей клиента
    $stmt = $pdo->prepare("
        SELECT 
            фамилия as lastName,
            имя as firstName,
            отчество as middleName,
            дата_рождения as birthDate
        FROM дети
        WHERE код_клиента = ?
    ");
    $stmt->execute([$clientId]);
    $client['children'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($client);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>