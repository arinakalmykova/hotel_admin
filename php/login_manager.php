<?php
session_start();
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $login = trim($data['login']);
        $pass = trim($data['pass']);
        
        // Проверяем учетные данные управляющего
        $stmt = $pdo->prepare("SELECT *, b.фамилия, b.имя 
                              FROM админ_учет a
                              JOIN администратор b ON a.код_администратора = b.код_администратора
                              WHERE a.логин = ? AND b.роль = 'управляющий'");
        $stmt->execute([$login]);
        $manager = $stmt->fetch();
        
        if (!$manager || !password_verify($pass, $manager['пароль'])) {
            throw new Exception("Неверный логин или пароль");
        }
        
        // Устанавливаем сессию
        $_SESSION['manager_id'] = $manager['код_администратора'];
        $_SESSION['manager_login'] = $login;
        $_SESSION['manager_name'] = $manager['имя'] . ' ' . $manager['фамилия'];
        $_SESSION['admin_role'] = 'manager';
        
        echo json_encode([
            'success' => true,
            'name' => $manager['имя'] . ' ' . $manager['фамилия']
        ]);
        
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?>