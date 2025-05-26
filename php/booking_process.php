<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set('error_log', __DIR__ . '/php_errors.log');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset( $_POST['dateinput'], $_POST['dateoutput'], $_POST['adults'], $_POST['children'])) {
    try {
 

        $dateinput=$_POST['dateinput'];
        $dateoutput=$_POST['dateoutput'];
        $adults=$_POST['adults'];
        $children=$_POST['children'];
        $totalGuests = $adults + $children;

        $pdo->beginTransaction();
        // Получаем ID свободного номера нужной категории
                        $sql = "SELECT 
                        n.код_номера AS room_id,
                        n.вместимость AS capacity,
                        n.стоимость_за_ночь AS price_per_night,
                        kn.название_категории AS category_name
                    FROM номер n
                    JOIN категории_номера kn ON n.код_категории = kn.код_категории
                    WHERE n.вместимость >= :total_guests
                    AND n.код_номера NOT IN (
                        SELECT бр.код_номера
                        FROM бронь бр
                        WHERE 
                                бр.дата_начала_бронирования <= :check_out
                                AND бр.дата_окончания_бронирования >= :check_in
                    )
                    ORDER BY n.стоимость_за_ночь ASC";

                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                ':total_guests' => $totalGuests,
                ':check_in' => $dateinput,
                ':check_out' =>$dateoutput
                ]);
                $availableRooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
           if (! $availableRooms) {
               throw new Exception("Нет доступных номеров выбранной категории на указанные даты");
           }
        $pdo->commit();

        echo json_encode(['success' => true, 'message' => 'бронирование успешено', 'rooms' => $availableRooms]);
        exit;

    } catch (Exception $e) {
        if (isset($pdo) && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}
?>