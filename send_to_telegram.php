<?php
/**
 * Septima - Telegram Lead Forwarder
 * Скрипт приёма заявок с сайта и мгновенной пересылки в Telegram-группу
 */

header('Content-Type: application/json; charset=utf-8');

// =========================================================================
// НАСТРОЙКИ TELEGRAM (Заполните вашими данными бота и группы)
// =========================================================================
$botToken = 'YOUR_TELEGRAM_BOT_TOKEN'; // Токен бота от @BotFather (например: 123456789:ABCdefGhIJKlmNoPQRstuVWXyz)
$chatId   = 'YOUR_TELEGRAM_CHAT_ID';   // ID группы или канала (например: -1001234567890 или @channel_name)

// =========================================================================
// ПРИЕМ И ОБРАБОТКА ДАННЫХ
// =========================================================================
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$name     = !empty($data['name']) ? trim($data['name']) : 'Не указано';
$phone    = !empty($data['phone']) ? trim($data['phone']) : 'Не указано';
$docName  = !empty($data['doc_name']) ? trim($data['doc_name']) : (!empty($data['doc_type']) ? trim($data['doc_type']) : 'Общая консультация');
$comment  = !empty($data['comment']) ? trim($data['comment']) : '—';
$source   = !empty($data['form_source']) ? trim($data['form_source']) : 'Главная страница (Septima)';
$userIp   = $_SERVER['REMOTE_ADDR'] ?? 'Не определен';
$dateTime = date('d.m.Y H:i:s');

// Формирование текста сообщения
$text = "🔥 *НОВАЯ ЗАЯВКА С САЙТА SEPTIMA*\n";
$text .= "━━━━━━━━━━━━━━━━━━━━━━\n";
$text .= "👤 *Имя:* " . htmlspecialchars($name) . "\n";
$text .= "📞 *Телефон:* `" . htmlspecialchars($phone) . "`\n";
$text .= "📄 *Документ:* " . htmlspecialchars($docName) . "\n";
$text .= "💬 *Комментарий:* " . htmlspecialchars($comment) . "\n";
$text .= "📍 *Источник формы:* " . htmlspecialchars($source) . "\n";
$text .= "🕒 *Время заявки:* " . $dateTime . "\n";
$text .= "🌐 *IP клиента:* " . $userIp . "\n";
$text .= "━━━━━━━━━━━━━━━━━━━━━━";

// Если токен еще не настроен — логируем в файл и возвращаем статус
if ($botToken === 'YOUR_TELEGRAM_BOT_TOKEN') {
    file_put_contents(__DIR__ . '/leads_backup.log', "[$dateTime] $phone | $name | $docName\n", FILE_APPEND);
    echo json_encode([
        'status' => 'success',
        'message' => 'Lead received and saved to backup log (Telegram bot token pending)'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Отправка в Telegram Bot API
$url = "https://api.telegram.org/bot{$botToken}/sendMessage";
$postFields = [
    'chat_id' => $chatId,
    'text' => $text,
    'parse_mode' => 'Markdown'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo json_encode(['status' => 'success', 'message' => 'Sent to Telegram']);
} else {
    // В случае сбоя сети сохраняем в резервный лог
    file_put_contents(__DIR__ . '/leads_backup.log', "[$dateTime] $phone | $name | $docName | TG ERR: $response\n", FILE_APPEND);
    echo json_encode(['status' => 'partial_success', 'message' => 'Logged locally']);
}
