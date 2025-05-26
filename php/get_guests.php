<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT код_клиента AS id, фамилия AS lastname, имя AS firstname, отчество AS middlename FROM клиент");
    $guests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($guests);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>