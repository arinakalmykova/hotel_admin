<?php
require_once 'db.php';

header('Content-Type: application/json');

$checkIn = $_GET['check_in'] ?? null;
$checkOut = $_GET['check_out'] ?? null;

if (!$checkIn || !$checkOut) {
    echo json_encode(['error' => 'Не указаны даты']);
    exit;
}

try {
    // Проверяем корректность дат
    $checkInDate = new DateTime($checkIn);
    $checkOutDate = new DateTime($checkOut);
    
    if ($checkOutDate <= $checkInDate) {
        echo json_encode(['error' => 'Дата выезда должна быть позже даты заезда']);
        exit;
    }
    
    // Ищем номера, которые не заняты на указанные даты
    $stmt = $pdo->prepare("
        SELECT 
            н.код_номера AS id,
            к.название_категории AS category,
            н.код_номера AS number,
            н.стоимость_за_ночь AS price,
            н.вместимость AS capacity
        FROM Номер н
        JOIN Категории_номера к ON н.код_категории = к.код_категории
        WHERE н.код_номера NOT IN (
            SELECT бр.код_номера 
            FROM Бронь бр
            WHERE (
                (бр.дата_начала_бронирования <= :check_out AND бр.дата_окончания_бронирования >= :check_in)
                AND бр.статус_бронирования IN ('подтверждено', 'ожидание')
            )
        )
    ");
    
    $stmt->execute([
        ':check_in' => $checkIn,
        ':check_out' => $checkOut
    ]);
    
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rooms);
} catch (Exception $e) {
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>