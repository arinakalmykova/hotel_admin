<?php
header('Content-Type: application/json');
require_once 'db.php';

file_put_contents('add_client.log', 
    "\n" . date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . 
    "\nFILES: " . print_r($_FILES, true), 
    FILE_APPEND
);

try {
    // Чтение обычных данных
    $fullName = $_POST['full_name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? null;
    $date = $_POST['date'] ;
    $passport = $_POST['pasport'];

    // Разбиваем ФИО на части
    $nameParts = explode(' ', trim($fullName));
    $lastName = $nameParts[0] ?? '';
    $firstName = $nameParts[1] ?? '';
    $middleName = $nameParts[2] ?? null;

    // Вставляем клиента
    $query = "INSERT INTO клиент (
                фамилия,
                имя,
                отчество,
                номер_телефона,
                почта,
                дата_рождения,
                номер_паспорта
              ) VALUES (
                :last_name,
                :first_name,
                :middle_name,
                :phone,
                :email,
                :date,
                :pasport
              )";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':last_name' => $lastName,
        ':first_name' => $firstName,
        ':middle_name' => $middleName,
        ':phone' => $phone,
        ':email' => $email,
        ':date' => $date,
        ':pasport' => $passport
    ]);

    $clientId = $pdo->lastInsertId();

    // Получаем данные детей из $_POST
    $children = $_POST['children'] ?? [];

    // Вставляем детей, если есть
    foreach ($children as $child) {
        if (!empty($child['lastName']) && !empty($child['firstName']) && !empty($child['birthDate'])) {
            $queryChild = "INSERT INTO дети (
                            код_клиента,
                            фамилия,
                            имя,
                            отчество,
                            дата_рождения
                          ) VALUES (
                            :client_id,
                            :last_name,
                            :first_name,
                            :middle_name,
                            :birth_date
                          )";

            $stmtChild = $pdo->prepare($queryChild);
            $stmtChild->execute([
                ':client_id' => $clientId,
                ':last_name' => $child['lastName'],
                ':first_name' => $child['firstName'],
                ':middle_name' => $child['middleName'] ?? null,
                ':birth_date' => $child['birthDate']
            ]);
        }
    }

    echo json_encode(['success' => true, 'id' => $clientId]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
