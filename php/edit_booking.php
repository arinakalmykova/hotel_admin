<?php
require_once 'db.php';
file_put_contents('booking.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . 
    "\nFILES: " . print_r($_FILES, true), 
    FILE_APPEND
);
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['код_брони'] ?? null;
    $client_id=$_POST['код_клиента'];
    $data = [
        'guest_id' => $_POST['код_клиента'] ?? null,
        'room_id' => $_POST['код_номера'] ?? null,
        'check_in' => $_POST['дата_начала_бронирования'] ?? null,
        'check_out' => $_POST['дата_окончания_бронирования'] ?? null,
        'status' => $_POST['статус_бронирования'] ?? null
    ];
    
    // Валидация данных
    if (!$id || !$data['guest_id'] || !$data['room_id'] || !$data['check_in'] || !$data['check_out']) {
        echo json_encode(['success' => false, 'error' => 'Не все обязательные поля заполнены']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE Бронь SET 
        код_клиента = :guest_id,
        код_номера = :room_id,
        дата_начала_бронирования = :check_in,
        дата_окончания_бронирования = :check_out,
        статус_бронирования = :status
        WHERE код_брони = :id");
  
  $stmt->execute([
      'guest_id' => $data['guest_id'],
      'room_id' => $data['room_id'],
      'check_in' => $data['check_in'],
      'check_out' => $data['check_out'],
      'status' => $data['status'],
      'id' => $id
  ]);
  
  $stmt = $pdo->prepare("UPDATE Заселение SET 
        код_номера = :room_id,
        дата_заселения = :check_in,
        дата_выселения = :check_out
        WHERE код_клиента = :client_id");
  
  $stmt->execute([
      'room_id' => $data['room_id'],
      'check_in' => $data['check_in'],
      'check_out' => $data['check_out'],
      'client_id' => $client_id
  ]);
  
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Ошибка базы данных: ' . $e->getMessage()]);
    }
}
?>