<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    // Получаем все заселения с информацией о номере и клиенте
    $stmt = $pdo->query("
        SELECT 
            з.код_заселения,
            з.код_клиента,
            CONCAT(кл.фамилия, ' ', LEFT(кл.имя, 1), '.', LEFT(кл.отчество, 1), '.') AS имя_гостя,
            CONCAT(кат.название_категории, ' ', н.код_номера) AS номер,
            DATE_FORMAT(з.дата_заселения, '%Y-%m-%d') AS дата_заселения,
            DATE_FORMAT(з.дата_выселения, '%Y-%m-%d') AS дата_выселения,
            з.статус_заселения
        FROM заселение з
        JOIN клиент кл ON з.код_клиента = кл.код_клиента
        JOIN номер н ON з.код_номера = н.код_номера
        JOIN категории_номера кат ON н.код_категории = кат.код_категории
        ORDER BY з.дата_заселения DESC
    ");
    
    $checkIns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Формируем ответ
    echo json_encode([
        'success' => true,
        'data' => $checkIns
    ]);
    
} catch (PDOException $e) {
    // Обработка ошибок БД
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка базы данных: ' . $e->getMessage()
    ]);
}
?>