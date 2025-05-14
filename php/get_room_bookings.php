<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    // Получаем параметры дат из запроса
    $startDate = isset($_GET['start']) ? $_GET['start'] : date('Y-m-d');
    $endDate = isset($_GET['end']) ? $_GET['end'] : date('Y-m-d', strtotime('+1 month'));

    // Получаем бронирования для указанного периода
    $stmt = $pdo->prepare("
        SELECT 
            б.код_брони AS id,
            б.код_номера AS room_id,
            к.фамилия AS client_last_name,
            к.имя AS client_first_name,
            б.дата_начала_бронирования AS start,
            б.дата_окончания_бронирования AS end,
            б.статус_бронирования AS status,
            кн.название_категории AS category
        FROM Бронь б
        JOIN Номер н ON б.код_номера = н.код_номера
        JOIN Клиент к ON б.код_клиента = к.код_клиента
        JOIN Категории_номера кн ON н.код_категории = кн.код_категории
        WHERE б.дата_начала_бронирования <= :endDate
        AND б.дата_окончания_бронирования >= :startDate
    ");
    $stmt->execute([':startDate' => $startDate, ':endDate' => $endDate]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Форматируем данные для FullCalendar
    $events = [];
    foreach ($bookings as $booking) {
        $events[] = [
            'id' => $booking['id'],
            'title' => $booking['client_last_name'] . ' ' . $booking['client_first_name'],
            'start' => $booking['start'],
            'end' => date('Y-m-d', strtotime($booking['end'] . ' +1 day')),
            'color' => getStatusColor($booking['status']),
            'extendedProps' => [
                'room_id' => $booking['room_id'],
                'status' => $booking['status'],
                'category' => $booking['category']
            ]
        ];
    }

    echo json_encode($events);

} catch (PDOException $e) {
    echo json_encode([
        'error' => 'Ошибка базы данных: ' . $e->getMessage()
    ]);
}

function getStatusColor($status) {
    switch (strtolower($status)) {
        case 'подтверждено':
            return '#28a745';
        case 'ожидает':
            return '#ffc107';
        case 'отменено':
            return '#dc3545';
        default:
            return '#17a2b8';
    }
}
?>