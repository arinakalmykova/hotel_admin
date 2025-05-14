<?php
header('Content-Type: application/json');
require_once 'db.php';
// Добавьте в самое начало скрипта (первой строкой)
date_default_timezone_set('Europe/Moscow'); // Или ваш регион
error_log("Установлен часовой пояс: " . date_default_timezone_get());
// Получаем текущую дату на сервере
$today = date('Y-m-d');
error_log("Текущая дата на сервере: " . $today);

// Подготавливаем запрос
$query = "SELECT
    код_заселения, 
    CONCAT(к.фамилия, ' ', LEFT(к.имя, 1), '.', LEFT(к.отчество, 1), '.') AS имя_гостя,
    CONCAT(кат.название_категории, ' ', н.код_номера) AS номер, 
    дата_заселения,
    дата_выселения
FROM Заселение b
JOIN Клиент к ON b.код_клиента = к.код_клиента
JOIN Номер н ON b.код_номера = н.код_номера
JOIN Категории_номера кат ON н.код_категории = кат.код_категории
WHERE статус_заселения = 'заселен' 
AND дата_выселения = :today";

$stmt = $pdo->prepare($query);
$stmt->bindParam(':today', $today);
$stmt->execute();

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Формируем ответ с датой
$response = [
    'current_date' => $today,
    'data' => $results
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>