<?php
$user='root';
$passward='1234';
$dbname='hostel';
$host='localhost';
$port='3306';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try{
    $pdo = new PDO($dsn, $user, $passward, $options);
}
catch(PDOException $e){
    echo $e->getMessage();
}
?>