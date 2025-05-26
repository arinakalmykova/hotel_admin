<?php
header('Content-Type: application/json');
require_once 'db.php';

$query = "
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
";

$result = $pdo->query($query);

$rooms = [];

while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    $id = $row['id'];
    
    if (!isset($rooms[$id])) {
        $rooms[$id] = [
            'id' => $id,
            'category' => $row['category'],
            'price' => $row['price'],
            'capacity' => $row['capacity'],
            'status' => $row['status'],
            'area' => $row['area'],
            'amenities' => [],
        ];
    }

    if (!in_array($row['amenity'], $rooms[$id]['amenities'])) {
        $rooms[$id]['amenities'][] = $row['amenity'];
    }
}

echo json_encode(array_values($rooms), JSON_UNESCAPED_UNICODE);
?>
