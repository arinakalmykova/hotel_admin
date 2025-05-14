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
    // Обработка данных клиента
    $fio = trim($_POST['FIO']);
    $parts = explode(' ', $fio); 
    
    $lastname = $parts[0] ?? '';
    $name = $parts[1] ?? '';
    $otch = $parts[2] ?? '';
    
    $phone = $_POST['phone'];
    $email = $_POST['email'] ?? null;
    $pasport = $_POST['pasport'];
    $birthdate = $_POST['birthdate'] ?? null;

    // Даты бронирования
    $dateinput = $_POST['dateinput'];
    $dateoutput = $_POST['dateoutput'];
    $checkin_date = new DateTime($dateinput);
    $checkout_date = new DateTime($dateoutput);
    
    // Проверка дат
    if ($checkout_date <= $checkin_date) {
        throw new Exception("Дата выезда должна быть позже даты заезда");
    }
    
    $count_days = $checkout_date->diff($checkin_date)->days;
    $adults = (int)$_POST['adults'];
    $children = (int)$_POST['children'];
    $totalGuests = $adults + $children;
    
    // Данные номера
    $room_id = $_POST['roomId'];
    $room_price = $_POST['roomPrice'];

    // Скидка и оплата
    $discount = $_POST['discount'];
    $paymentOption = $_POST['paymentOption'];
    // Начинаем транзакцию
    $pdo->beginTransaction();

    // 1. Проверяем/создаем клиента
    $stmt = $pdo->prepare("SELECT код_клиента FROM клиент WHERE номер_паспорта = ?");
    $stmt->execute([$pasport]);
    $client_id = $stmt->fetchColumn();
    
    // Если клиент не существует
    if (!$client_id) {
        
        $stmt = $pdo->prepare("INSERT INTO клиент 
            ( фамилия, имя, отчество, номер_телефона, почта, номер_паспорта, дата_рождения) 
            VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([ $lastname, $name, $otch, 
            $phone, $email, $pasport, $birthdate
        ]);
        $client_id = $pdo->lastInsertId();
    }

    // 2. Добавляем детей (если есть)
    if (!empty($_POST['childrenData'])) {
        $childrenData = $_POST['childrenData'];
    


        $stmt = $pdo->prepare("INSERT INTO дети 
            (код_клиента, фамилия, имя, отчество, дата_рождения) 
            VALUES (?, ?, ?, ?, ?)");
    
        foreach ($childrenData as $child) {
        $lastname_child = $child['lastname_child'] ?? '';
        $firstname_child = $child['firstname_child'] ?? '';
        $otch_child= $child['otch_child'] ?? '';
        $birthdate_child = $child['birthdate_child'] ?? '';

            if (!$lastname_child || !$firstname_child || !$birthdate_child) {
                throw new Exception("У ребенка отсутствуют обязательные данные.");
            }
    
            $stmt->execute([
                $client_id, $lastname_child, $firstname_child, 
                $otch_child, $birthdate_child
            ]);
        }
    } 
     // 3. Получаем ID администратора (из сессии или другим способом)
    $admin_id = $_SESSION['admin_id']; 
     // 8. Создаем запись о бронировании
     $stmt = $pdo->prepare("INSERT INTO бронь(код_номера,код_клиента,код_администратора,дата_начала_бронирования,дата_окончания_бронирования,статус_бронирования) VALUES (?,?,?,?,?,?)");
    
     $stmt->execute([$room_id,$client_id,$admin_id,$dateinput,$dateoutput,'подтверждено']);
     $booking_id = $pdo->lastInsertId();

    // 4. Рассчитываем скидку
    $discount_percent = 0;
    if ($discount > 0) {
        $stmt = $pdo->prepare("SELECT (процент/100) FROM скидки WHERE код_скидки = ?");
        $stmt->execute([$discount]);
        $discount_percent = (float)$stmt->fetchColumn();
    }

    // 5. Рассчитываем стоимость номера
    $total_without_discount = $count_days * $room_price;
    $total_with_discount = $total_without_discount * (1 - $discount_percent);

    
    $stmt = $pdo->prepare("INSERT INTO платеж_за_номер 
    (код_номера, код_администратора, код_клиента, статус_оплаты, дата_платежа, сумма_платежа, код_скидки, код_брони) 
    VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)");
    
    $stmt->execute([
        $room_id, $admin_id, $client_id, $paymentOption, 
        $total_with_discount, $discount ?: null, $booking_id
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
        (код_клиента, код_услуги, статус_оплаты, дата_платежа, код_брони) 
        VALUES (?, ?, 'оплачено', NOW(), ?)");
        
        foreach ($service_ids as $service_id) {
            if (isset($services_prices[$service_id])) {
                $price = $services_prices[$service_id];
                $stmt->execute([$client_id, $service_id, $booking_id]);
                $total_services_price += $price;
            }
        }
        
        
    }
   
   
 // 9. Добавляем запись в таблицу заселений
 $stmt = $pdo->prepare("INSERT INTO Заселение
 ( код_клиента, код_номера, дата_заселения, дата_выселения, статус_заселения) 
 VALUES ( ?, ?, ?, ?, 'не заселен')");

$stmt->execute([ $client_id, $room_id, $dateinput, $dateoutput]);
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