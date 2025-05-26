<?php
require_once 'db.php';

header('Content-Type: application/json');
file_put_contents('update.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true), 
    FILE_APPEND
);

$id = $_POST['id'] ;
$status = $_POST['status'];

try {
    // Начинаем транзакцию
    $pdo->beginTransaction();

    // 1. Получаем код номера из заселения
    $stmt = $pdo->prepare("
        SELECT код_номера 
        FROM заселение 
        WHERE код_заселения = :id
    ");
    $stmt->execute([':id' => $id]);
    $roomId = $stmt->fetchColumn();

 
    // 2. Обновляем статус заселения
    $stmt = $pdo->prepare("
        UPDATE заселение 
        SET статус_заселения = :status 
        WHERE код_заселения = :id
    ");
    $stmt->execute([
        ':status' => $status,
        ':id' => $id
    ]);

    // 3. Определяем новый статус номера
    $roomStatus = ($status === 'заселен') ? 'занят' : 'свободен';

    // 4. Обновляем статус номера
    $stmt = $pdo->prepare("
        UPDATE номер 
        SET статус = :room_status 
        WHERE код_номера = :room_id
    ");
    $stmt->execute([
        ':room_status' => $roomStatus,
        ':room_id' => $roomId
    ]);


    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Статусы успешно обновлены']);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>