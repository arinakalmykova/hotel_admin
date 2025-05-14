<?php
header('Content-Type: application/json');
require_once 'db.php';

file_put_contents('update_room.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . 
    "\nFILES: " . print_r($_FILES, true), 
    FILE_APPEND
);

$data = $_POST;
$errors = [];
$roomId = $data['id'] ;

if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Подготовка данных для обновления
$updateData = [
    ':id' => $roomId,
    ':price' => $data['price'],
    ':status' => $data['status']
];

try {
    // Начало транзакции
    $pdo->beginTransaction();

    // SQL-запрос для обновления номера
    $sql = "UPDATE Номер SET
                стоимость_за_ночь = :price,
                статус = :status
            WHERE код_номера = :id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($updateData);

    // Фиксация транзакции
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Данные номера успешно обновлены',
        'room_id' => $roomId
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка базы данных: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>