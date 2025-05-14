<?php
session_start();
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once 'db.php';

if (!isset($_SESSION['manager_id']) || !isset($_SESSION['admin_role']) || $_SESSION['admin_role'] !== 'manager') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Только управляющий может регистрировать администраторов']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['lastname'], $_POST['name'], $_POST['otch'], $_POST['number'], $_POST['login'], $_POST['pass'])) {
    try {
        // Получаем и очищаем данные
        $lastname = trim($_POST['lastname']);
        $name = trim($_POST['name']);
        $otch = trim($_POST['otch']);
        $number = trim($_POST['number']);
        $login = trim($_POST['login']);
        $pass = $_POST['pass'];

        // Валидация
        if (empty($lastname) || empty($name) || empty($otch) || empty($number) || empty($login) || empty($pass)) {
            throw new Exception("Все поля обязательны для заполнения");
        }

        // Проверка логина
        $stmt = $pdo->prepare("SELECT 1 FROM админ_учет WHERE логин = ?");
        $stmt->execute([$login]);
        if ($stmt->fetchColumn()) {
            throw new Exception("Этот логин уже занят");
        }

        // Хеширование пароля
        $pass_hash = password_hash($pass, PASSWORD_BCRYPT);
        if ($pass_hash === false) {
            throw new Exception("Ошибка при создании пароля");
        }

        $status = 'активен';
        $date_time = date("Y-m-d H:i:s");

        // Начинаем транзакцию
        // $pdo->beginTransaction();

        // Вставляем в таблицу администратор
        $stmt = $pdo->prepare("INSERT INTO администратор (фамилия, имя, отчество, телефон) VALUES (?, ?, ?, ?)");
        $stmt->execute([$lastname, $name, $otch, $number]);
        $admin_id = $pdo->lastInsertId();

        // Вставляем в таблицу админ_учет
        $stmt = $pdo->prepare("INSERT INTO админ_учет (код_администратора, логин, пароль, `последний вход`, статус) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$admin_id, $login, $pass_hash, $date_time, $status]);

        $escaped_login = str_replace("'", "''", $login);
        $escaped_pass = str_replace("'", "''", $pass);
        
        $create_user_sql = "CREATE USER '$escaped_login'@'localhost' IDENTIFIED BY '$escaped_pass'";
        $pdo->exec($create_user_sql);
        
        // Назначение роли
        $grant_sql = "GRANT admin TO '$escaped_login'@'localhost'";
        $pdo->exec($grant_sql);

        // Установить роль по умолчанию
        $set_role_sql = "SET DEFAULT ROLE admin TO '$escaped_login'@'localhost'";
        $pdo->exec($set_role_sql);
        // Фиксируем транзакцию
        // $pdo->commit();

        // Устанавливаем сессию
        $_SESSION['admin_id'] = $admin_id;
        $_SESSION['admin_login'] = $login;
        $_SESSION['admin_name'] = $name . ' ' . $lastname;

        echo json_encode(['success' => true, 'message' => 'Регистрация успешна']);
        exit;

    } catch (Exception $e) {
        // Откатываем транзакцию при ошибке
        if (isset($pdo) && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}
?>