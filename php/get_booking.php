<?php
require_once 'db.php';

header('Content-Type: application/json');

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['error' => 'Не указан ID бронирования']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM Бронь WHERE код_брони = ?");
    $stmt->execute([$id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($booking) {
        echo json_encode($booking);
    } else {
        echo json_encode(['error' => 'Бронирование не найдено']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>