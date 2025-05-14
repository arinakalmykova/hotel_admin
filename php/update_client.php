<?php
header('Content-Type: application/json');
require_once 'db.php';

file_put_contents('update_client.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . 
    "\nFILES: " . print_r($_FILES, true), 
    FILE_APPEND
);

try {
    // Получаем данные из формы
    $clientId = $_POST['id'] ;
    
    if (!$clientId) {
        throw new Exception('Не указан ID клиента');
    }
    $fullName = $_POST['full_name'] ?? '';
    $nameParts = explode(' ', trim($fullName));
    $lastName = $nameParts[0] ?? '';
    $firstName = $nameParts[1] ?? '';
    $middleName = $nameParts[2] ?? null;
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? null;
    $date = $_POST['date'] ;
    $passport = $_POST['pasport'];


    // Начинаем транзакцию
    $pdo->beginTransaction();

    // 1. Обновляем основные данные клиента
    $stmt = $pdo->prepare("
        UPDATE Клиент SET
            фамилия = :lastName,
            имя = :firstName,
            отчество = :middleName,
            номер_телефона = :phone,
            почта = :email,
            дата_рождения = :birthDate,
            номер_паспорта = :passport
        WHERE код_клиента = :id
    ");
    
    $stmt->execute([
        ':lastName' => $lastName,
        ':firstName' => $firstName,
        ':middleName' => $middleName,
        ':phone' => $_POST['phone'] ?? null,
        ':email' => $_POST['email'] ?? null,
        ':birthDate' => $_POST['date'] ?? null,
        ':passport' => $_POST['pasport'] ?? null,
        ':id' => $clientId
    ]);

    // 2. Удаляем старых детей клиента
    $stmt = $pdo->prepare("DELETE FROM Дети WHERE код_клиента = ?");
    $stmt->execute([$clientId]);

    // 3. Добавляем новых детей (если есть)
    if (isset($_POST['children']) && is_array($_POST['children'])) {
        $stmt = $pdo->prepare("
            INSERT INTO Дети (
                код_клиента,
                фамилия,
                имя,
                отчество,
                дата_рождения
            ) VALUES (
                :clientId,
                :lastName,
                :firstName,
                :middleName,
                :birthDate
            )
        ");
        
        foreach ($_POST['children'] as $child) {
            $stmt->execute([
                ':clientId' => $clientId,
                ':lastName' => $child['lastName'] ?? '',
                ':firstName' => $child['firstName'] ?? '',
                ':middleName' => $child['middleName'] ?? null,
                ':birthDate' => $child['birthDate'] ?? null
            ]);
        }
    }

    // Фиксируем изменения
    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Данные клиента успешно обновлены']);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Ошибка базы данных: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>