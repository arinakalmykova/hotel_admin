<?php
require_once 'db.php';
try {
$pdo->beginTransaction();

$stmt = $pdo->prepare("SELECT COUNT(код_номера) FROM номер WHERE статус = 'свободен'");
$stmt->execute();
$count_rooms = (float)$stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM Заселение WHERE дата_заселения = CURDATE()");
$stmt->execute();
$checkinsToday = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM Заселение WHERE дата_выселения = CURDATE()");
$stmt->execute();
$checkoutsToday = $stmt->fetchColumn();


$stmt = $pdo->query("SELECT COUNT(*) FROM номер");
$totalRooms = $stmt->fetchColumn();

// Занятые номера
$stmt = $pdo->prepare("
    SELECT COUNT(DISTINCT код_номера) 
    FROM бронь 
    WHERE CURDATE() BETWEEN дата_начала_бронирования AND дата_окончания_бронирования
");
$stmt->execute();
$occupiedRooms = $stmt->fetchColumn();

// Занятость в процентах
$occupancyRate = 0;
if ($totalRooms > 0) {
    $occupancyRate = round(($occupiedRooms / $totalRooms) * 100);
}


$pdo->commit();

echo json_encode([
    'success' => true,
    'count_rooms' => $count_rooms,
    'checkinsToday' => $checkinsToday,
    'checkoutsToday' => $checkoutsToday ,
    'occupiedRooms' => $occupancyRate,
]);}
catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка: ' . $e->getMessage()
    ]);
}
?>