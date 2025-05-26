<?php
header('Content-Type: application/json');
require_once 'db.php';

file_put_contents('get_room.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . 
    "\nFILES: " . print_r($_FILES, true), 
    FILE_APPEND
);

$roomId = (int)$_POST['id'];

try {
    $stmt = $pdo->prepare("
        SELECT 
            н.код_номера AS id,
            к.название_категории AS category,
            н.стоимость_за_ночь AS price,
            н.вместимость AS capacity,
            н.статус AS status,
            н.площадь as area,
            у.название AS amenity
        FROM номер н
        JOIN категории_номера к ON н.код_категории = к.код_категории
        JOIN категория_удобства м ON к.код_категории = м.код_категории
        JOIN удобства у ON м.код_удобства = у.код_удобства
        WHERE н.код_номера = :id
    ");
    $stmt->execute([':id' => $roomId]);

    $room = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $id = $row['id'];
        
        if (!isset($room[$id])) {
            $room[$id] = [
                'id' => $id,
                'category' => $row['category'],
                'price' => $row['price'],
                'capacity' => $row['capacity'],
                'area' => $row['area'],
                'status' => trim($row['status']),
                'amenities' => [],
            ];
        }

        if (!in_array($row['amenity'], $room[$id]['amenities'])) {
            $room[$id]['amenities'][] = $row['amenity'];
        }
    }
// Получение всех удобств
$allAmenitiesStmt = $pdo->query("SELECT код_удобства AS id, название AS name FROM удобства");
$allAmenities = $allAmenitiesStmt->fetchAll(PDO::FETCH_ASSOC);

// Ответ
echo json_encode([
    'success' => true,
    'room' => array_values($room)[0] ?? null,
    'all_amenities' => $allAmenities
], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка базы данных: ' . $e->getMessage()
    ]);
}

?>
