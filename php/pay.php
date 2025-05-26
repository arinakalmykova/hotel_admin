<?php
session_start();
header('Content-Type: application/json; charset=UTF-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);
error_log(print_r($_POST, true));
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/php_errors.log');

file_put_contents('booking.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . 
    "\nFILES: " . print_r($_FILES, true), 
    FILE_APPEND
);

require_once 'db.php';

// Проверяем наличие всех обязательных полей
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

try {
   
    $paymentOption = $_POST['paymentOption'];
    // Начинаем транзакцию
    $pdo->beginTransaction();

    // 6. Сохраняем платеж за номер
    $stmt = $pdo->prepare("INSERT INTO платеж_за_номер 
        (статус_оплаты) 
        VALUES (?)");
    
    $stmt->execute([
        $paymentOption
    ]);
    $payment_id = $pdo->lastInsertId();

    // 7. Сохраняем услуги (если есть)
    $total_services_price = 0;
    $services = $_POST['services'] ?? [];
    
    // 1. Извлекаем только ID услуг
    $service_ids = array_column($services, 'value');
    
    if (!empty($service_ids)) {
        // 2. Получаем цены услуг из БД
        $placeholders = str_repeat('?,', count($service_ids) - 1) . '?';
        $stmt = $pdo->prepare("SELECT код_услуги, стоимость FROM доп_услуги WHERE код_услуги IN ($placeholders)");
        $stmt->execute($service_ids);
        
        $services_prices = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        // 3. Добавляем записи о платежах
        $stmt = $pdo->prepare("INSERT INTO платеж_за_доп_услуги 
            (код_клиента, код_услуги,дата_платежа) 
            VALUES (?, ?, NOW())" )
        
        foreach ($service_ids as $service_id) {
            if (isset($services_prices[$service_id])) {
                $price = $services_prices[$service_id];
                $stmt->execute([$client_id, $service_id]);
                $total_services_price += $price;
            }
        }
        
    } else {
        echo "Дополнительные услуги не выбраны";
    }
   

    // 8. Создаем запись о бронировании
    $stmt = $pdo->prepare("UPDATE бронь SET статус_бронирования = 'забронировано' WHERE код_номера = ? AND код_администратора = ?");
    
    $stmt->execute([
        $room_id, $admin_id]);

    $pdo->commit();

    // Возвращаем успешный ответ
    echo json_encode([
        'success' => true,
        'message' => 'Бронирование успешно создано',
        'total_with_discount' => $total_with_discount,
        'total_services_price' => $total_services_price,
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка бронирования: ' . $e->getMessage()
    ]);
}
} 

?>