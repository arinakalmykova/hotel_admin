<?php
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// Получаем параметры
$startDate = $_GET['start'] ?? '';
$endDate = $_GET['end'] ?? '';
$reportType = $_GET['type'] ?? 'occupancy';

// Создаем документ Excel
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// Заполняем данными (ваша логика)
$sheet->setCellValue('A1', 'Отчет за период');
$sheet->setCellValue('A2', 'С ' . $startDate . ' по ' . $endDate);
// ... остальное заполнение данных

// Устанавливаем заголовки для скачивания
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="Отчет_' . $reportType . '_' . $startDate . '_' . $endDate . '.xlsx"');
header('Cache-Control: max-age=0');

// Отправляем файл
$writer = new Xlsx($spreadsheet);
$writer->save('php://output');
exit;
?>