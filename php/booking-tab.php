<?php
header('Content-Type: application/json');
header("Cache-Control: no-cache, must-revalidate"); // Запрещаем кэширование
require_once 'db.php';

$status = $_GET['status'] ?? 'all';


// Логируем запрос
error_log("Booking tab request: status=" . $status);

$query = "
    SELECT 
        b.код_брони AS booking_id,
        CONCAT(к.фамилия, ' ', LEFT(к.имя, 1), '.', LEFT(к.отчество, 1), '.') AS guest_name,
        CONCAT(кат.название_категории, ' ', н.вместимость) AS room_number,
        DATE_FORMAT(b.дата_начала_бронирования, '%d.%m.%Y') AS check_in_date,
        DATE_FORMAT(b.дата_окончания_бронирования, '%d.%m.%Y') AS check_out_date,
        b.статус_бронирования AS booking_status
    FROM Бронь b
    JOIN Клиент к ON b.код_клиента = к.код_клиента
    JOIN Номер н ON b.код_номера = н.код_номера
    JOIN Категории_номера кат ON н.код_категории = кат.код_категории"; // Только актуальные брони

if ($status !== 'all') {
    $query .= " AND b.статус_бронирования = :status";
}

$query .= " ORDER BY b.дата_начала_бронирования DESC";

try {
    $stmt = $pdo->prepare($query);
    
    if ($status !== 'all') {
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
    }
    
    $stmt->execute();
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Логируем результат запроса
    error_log("Booking tab result: " . count($bookings) . " records found");
    
    echo json_encode($bookings);
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>