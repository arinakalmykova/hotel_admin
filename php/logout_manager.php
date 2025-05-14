<?php
session_start();

// Очищаем только данные менеджера
unset($_SESSION['manager_id']);
unset($_SESSION['manager_login']);
unset($_SESSION['manager_name']);
unset($_SESSION['admin_role']);

// Не разрушаем всю сессию, если нужны другие данные
// session_destroy();

echo json_encode(['success' => true]);
?>