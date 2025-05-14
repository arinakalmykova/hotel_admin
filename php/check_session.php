<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['logged_in' => false]);
    exit;
}

echo json_encode([
    'logged_in' => true,
    'role' => $_SESSION['admin_role'],
    'name' => $_SESSION['admin_name']
]);
?>