<?php
header('Content-Type: application/json');
require_once 'db.php';

// Логирование запросов
file_put_contents('analytics_debug.log', 
    "\n[" . date('Y-m-d H:i:s') . "] GET: " . print_r($_GET, true), 
    FILE_APPEND
);

$startDate = $_GET['start'] ?? date('Y-m-d', strtotime('-30 days'));
$endDate = $_GET['end'] ?? date('Y-m-d');
$reportType = $_GET['type'] ?? 'occupancy';

try {
    // 1. Загрузка номеров по категориям
    $stmt = $pdo->prepare("
        SELECT 
            c.название_категории AS category,
            COUNT(r.код_номера) AS total_rooms,
            SUM(CASE WHEN b.код_брони IS NOT NULL 
                AND b.дата_начала_бронирования <= :endDate 
                AND b.дата_окончания_бронирования >= :startDate 
                THEN 1 ELSE 0 END) AS booked_rooms
        FROM Категории_номера c
        LEFT JOIN Номер r ON c.код_категории = r.код_категории
        LEFT JOIN Бронь b ON r.код_номера = b.код_номера
        GROUP BY c.код_категории, c.название_категории
    ");
    $stmt->execute(['startDate' => $startDate, 'endDate' => $endDate]);
    $occupancyData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Финансовые показатели
    $stmt = $pdo->prepare("
    SELECT 
        COALESCE(SUM(all_payments.сумма_платежа), 0) AS total_income,
        COALESCE(AVG(all_payments.сумма_платежа), 0) AS average_check,
        ROUND(
            (SELECT COUNT(DISTINCT б.код_номера)
             FROM Бронь б
             WHERE б.дата_начала_бронирования <= :endDate
               AND б.дата_окончания_бронирования >= :startDate
            ) / (SELECT COUNT(*) FROM Номер) * 100, 2
        ) AS occupancy_percentage
    FROM (
        -- Платежи за номера
        SELECT п.сумма_платежа
        FROM Бронь б
        JOIN Платеж_за_номер п ON б.код_брони = п.код_брони
        WHERE б.дата_начала_бронирования <= :endDate2 
          AND б.дата_окончания_бронирования >= :startDate2

        UNION ALL

        -- Платежи за доп.услуги: нужно соединить с таблицей Доп_услуги
        SELECT ду.стоимость AS сумма_платежа
        FROM Бронь б
        JOIN Платеж_за_доп_услуги п2 ON б.код_брони = п2.код_брони
        JOIN Доп_услуги ду ON п2.код_услуги = ду.код_услуги
        WHERE б.дата_начала_бронирования <= :endDate3
          AND б.дата_окончания_бронирования >= :startDate3
    ) AS all_payments
");

    $stmt->execute([
        ':startDate' => $startDate, 
        ':endDate' => $endDate,
        ':startDate2' => $startDate,
        ':endDate2' => $endDate, 
        ':startDate3' => $startDate,
        ':endDate3' => $endDate
    ]);
    $financialData = $stmt->fetch(PDO::FETCH_ASSOC);

    // 3. Клиентская статистика
    $stmt = $pdo->prepare("
    SELECT 
        COUNT(DISTINCT б.код_клиента) AS total_clients,
        SUM(CASE WHEN visits.count_visits > 1 THEN 1 ELSE 0 END) AS returning_clients,
        ROUND(AVG(DATEDIFF(б.дата_окончания_бронирования, б.дата_начала_бронирования)), 1) AS avg_stay_days
    FROM Бронь б
    JOIN (
        SELECT код_клиента, COUNT(*) AS count_visits
        FROM Бронь
        WHERE дата_окончания_бронирования >= :startDate
          AND дата_начала_бронирования <= :endDate
        GROUP BY код_клиента
    ) AS visits ON visits.код_клиента = б.код_клиента
    WHERE б.дата_окончания_бронирования >= :startDate2
      AND б.дата_начала_бронирования <= :endDate2
");

    $stmt->execute([
        'startDate' => $startDate, 
        'endDate' => $endDate,
        'startDate2' => $startDate,
        'endDate2' => $endDate
    ]);
    $clientData = $stmt->fetch(PDO::FETCH_ASSOC);

    // Формирование ответа
    $response = [
        'categories' => array_column($occupancyData, 'category'),
        'occupancy' => array_map(function($item) {
            return $item['total_rooms'] > 0 
                ? round($item['booked_rooms'])
                : 0;
        }, $occupancyData),
        'financial' => [
            'totalIncome' => (float)($financialData['total_income'] ?? 0),
            'averageCheck' => (float)($financialData['average_check'] ?? 0),
            'occupancy' => (float)($financialData['occupancy_percentage'] ?? 0)
        ],
        'clients' => [
            'newClients' => (int)(($clientData['total_clients'] ?? 0) - ($clientData['returning_clients'] ?? 0)),
            'regularClients' => ($clientData['total_clients'] ?? 0) > 0 
                ? round(($clientData['returning_clients'] / $clientData['total_clients']) * 100)
                : 0,
            'avgStayDays' => (float)($clientData['avg_stay_days'] ?? 0)
        ]
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    file_put_contents('analytics_debug.log', 
        "\n[" . date('Y-m-d H:i:s') . "] ERROR: " . $e->getMessage(), 
        FILE_APPEND
    );
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>

