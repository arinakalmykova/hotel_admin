<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $query = "SELECT 
                клиент.код_клиента as id,
                CONCAT(клиент.фамилия, ' ', клиент.имя, ' ', COALESCE(клиент.отчество, '')) as full_name,
                клиент.номер_телефона as phone,
                клиент.почта as email,
                (SELECT MAX(заселение.дата_заселения) FROM заселение WHERE заселение.код_клиента = клиент.код_клиента) as last_visit,
                (SELECT COUNT(*) FROM заселение WHERE заселение.код_клиента = клиент.код_клиента) as visits_count,
                CASE 
                    WHEN (SELECT COUNT(*) FROM заселение WHERE заселение.код_клиента = клиент.код_клиента) > 3 THEN 'Постоянный'
                    ELSE 'Новый'
                END as status,
                -- Получаем детей для клиента
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'lastName', дети.фамилия,
                        'firstName', дети.имя,
                        'middleName', дети.отчество,
                        'birthDate', дети.дата_рождения
                    )
                ) as children
              FROM клиент
              LEFT JOIN дети ON клиент.код_клиента = дети.код_клиента
              GROUP BY клиент.код_клиента
              ORDER BY клиент.фамилия, клиент.имя";
    
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
