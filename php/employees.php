<?php
// api/get_employees.php
require_once 'db.php';

// Получаем логин и пароль из куки
$mysql_user = $_COOKIE['mysql_user'] ?? null;
$mysql_pass = $_COOKIE['mysql_pass'] ?? null;

if (!$mysql_user || !$mysql_pass) {
    header('HTTP/1.1 401 Unauthorized');
    die(json_encode(['error' => 'Необходима авторизация']));
}

try {
    // Создаем новое подключение с учетными данными пользователя
    $user_pdo = new PDO(
        "mysql:host=localhost;dbname=hostel;charset=utf8",
        $mysql_user,
        $mysql_pass,  // Используем пароль из куки
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Попытка выполнить запрос к таблице администратора
    try {
        $stmt = $user_pdo->query("SELECT * FROM администратор");
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Если запрос прошел успешно, выводим список сотрудников
        echo json_encode(['success' => true, 'employees' => $employees]);

    } catch (PDOException $e) {
        // Если доступ к таблице запрещен, считаем это "хорошим" результатом
        if ($e->getCode() == '42000') {
            echo json_encode(['success' => true, 'message' => 'Доступ к таблице администратор запрещен']);
        } else {
            // Обрабатываем другие ошибки
            header('HTTP/1.1 403 Forbidden');
            die(json_encode(['error' => 'Ошибка доступа: ' . $e->getMessage()]));
        }
    }
    
} catch (PDOException $e) {
    header('HTTP/1.1 403 Forbidden');
    die(json_encode(['error' => 'Доступ запрещен: ' . $e->getMessage()])); 
}
?>
