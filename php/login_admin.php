<?php
session_start();
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'], $_POST['pass'])) {
    try {
        $login = trim($_POST['login']);
        $pass = trim($_POST['pass']);

        if (empty($login) || empty($pass)) {
            throw new Exception("Все поля обязательны для заполнения");
        }

        // Получаем данные администратора
        $stmt = $pdo->prepare("SELECT a.код_администратора, a.пароль, b.имя, b.фамилия 
                              FROM админ_учет a
                              JOIN администратор b ON a.код_администратора = b.код_администратора
                              WHERE a.логин = ?");
        $stmt->execute([$login]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$admin) {
            throw new Exception("Неверный логин или пароль");
        }

        // Проверяем пароль
        if (!password_verify($pass, $admin['пароль'])) {
            throw new Exception("Неверный логин или пароль");
        }

        // Обновляем информацию о входе
        $status = 'активен';
        $date_time = date("Y-m-d H:i:s");
        
        $stmt = $pdo->prepare("UPDATE админ_учет SET `последний вход` = ?, статус = ? WHERE код_администратора = ?");
        $stmt->execute([$date_time, $status, $admin['код_администратора']]);

        // Устанавливаем сессию и куки
        $_SESSION['admin_id'] = $admin['код_администратора'];
        $_SESSION['admin_login'] = $login;
        $_SESSION['admin_name'] = $admin['имя'] . ' ' . $admin['фамилия'];
        $_SESSION['admin_role'] = 'admin';
        // Устанавливаем куки с логином и паролем (НЕ РЕКОМЕНДУЕТСЯ)
        setcookie('mysql_user', $login, time() + 86400, '/'); // Куки на 1 день
        setcookie('mysql_pass', $pass, time() + 86400, '/'); // Куки с паролем (НЕ БЕЗОПАСНО)

        // Возвращаем данные для localStorage
        echo json_encode([
            'success' => true,
            'message' => 'Вход успешен',
            'admin_id' => $admin['код_администратора'],
            'name' => $admin['имя'],
            'lastname' => $admin['фамилия'],
            'login' => $login
        ]);
        exit;

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}
?>
