<?php
$password = 'Bionika17'; // предполагаемый пароль
$hash = '$2y$10$NCZIqLPETCAL13V0hpt/meI3EED93t9uLkekxWnTFcjdgnInHjId.';

if (password_verify($password, $hash)) {
    echo "Пароль верный!";
} else {
    echo "Пароль НЕ совпадает.";
}
?>