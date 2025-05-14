<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $query = "SELECT 
                Клиент.код_клиента as id,
                CONCAT(Клиент.фамилия, ' ', Клиент.имя, ' ', COALESCE(Клиент.отчество, '')) as full_name,
                Клиент.номер_телефона as phone,
                Клиент.почта as email,
                (SELECT MAX(Заселение.дата_заселения) FROM Заселение WHERE Заселение.код_клиента = Клиент.код_клиента) as last_visit,
                (SELECT COUNT(*) FROM Заселение WHERE Заселение.код_клиента = Клиент.код_клиента) as visits_count,
                CASE 
                    WHEN (SELECT COUNT(*) FROM Заселение WHERE Заселение.код_клиента = Клиент.код_клиента) > 3 THEN 'Постоянный'
                    ELSE 'Новый'
                END as status,
                -- Получаем детей для клиента
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'lastName', Дети.фамилия,
                        'firstName', Дети.имя,
                        'middleName', Дети.отчество,
                        'birthDate', Дети.дата_рождения
                    )
                ) as children
              FROM Клиент
              LEFT JOIN Дети ON Клиент.код_клиента = Дети.код_клиента
              GROUP BY Клиент.код_клиента
              ORDER BY Клиент.фамилия, Клиент.имя";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($clients)) {
        echo json_encode([]);
    } else {
        echo json_encode($clients);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>
