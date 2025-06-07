<?php
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;

$name = $_POST['name'] ?? 'Не указано';
$phone = $_POST['phone'] ?? 'Не указано';
$form_type = $_POST['form_type'] ?? 'unknown';
$ref = $_SERVER['HTTP_REFERER'] ?? 'не определено';


$body = "<h2>Новая заявка с сайта</h2>";
$body .= "<b>Имя:</b> " . htmlspecialchars($name) . "<br>";
$body .= "<b>Телефон:</b> " . htmlspecialchars($phone) . "<br>";
$body .= "<b>Страница отправки:</b> $ref<br><br>";

switch ($form_type) {
    case 'quiz':
        $body .= "<h3>Ответы на квиз:</h3>";
        foreach ($_POST as $key => $val) {
            if (strpos($key, 'question-') === 0) {
                $body .= "<b>$key:</b> " . htmlspecialchars($val) . "<br>";
            }
        }
        $title = "Заявка с квиза";
        break;

    case 'reception':
        $title = "Заявка на диагностику";
        break;

    case 'call':
        $title = "Заявка на обратный звонок";
        break;

    default:
        $title = "Неопознанная заявка";
        break;
}


$mail = new PHPMailer();
try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth = true;

    $mail->Host = 'smtp.yandex.ru';
    $mail->Username = 'email@email.ru';
    $mail->Password = 'password';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->setFrom('email@email.ru', 'Сайт');

    $mail->addAddress('email@email.ru');

    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;

    $mail->send();
    echo json_encode(['result' => 'success']);
} catch (Exception $e) {
    echo json_encode([
        'result' => 'error',
        'message' => $mail->ErrorInfo
    ]);
}
