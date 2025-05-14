<?php
session_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {

        if (isset($_POST['action']) && $_POST['action'] === 'logout') {
            if (isset($_SESSION['admin_id'])) {
                $stmt = $pdo->prepare("UPDATE админ_учет SET статус = 'не активен', `последний вход` = NOW() WHERE код_администратора = ?");
                $stmt->execute([$_SESSION['admin_id']]);
            }
            
            session_unset();
            session_destroy();
            
            echo json_encode(['success' => true]);
            exit;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Ошибка при выходе: ' . $e->getMessage()
        ]);
        error_log('Logout error: ' . $e->getMessage());
        exit;
    }
}
?>