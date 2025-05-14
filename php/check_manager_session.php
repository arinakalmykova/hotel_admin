<?php
session_start();
header('Content-Type: application/json');

echo json_encode([
    'isManager' => ($_SESSION['admin_role'] ?? '') === 'manager'
]);
?>