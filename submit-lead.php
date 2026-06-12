<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$firstName = trim($input['firstName'] ?? '');
$lastName  = trim($input['lastName']  ?? '');
$email     = trim($input['email']     ?? '');
$company   = trim($input['company']   ?? '');
$message   = trim($input['message']   ?? '');

if (!$firstName || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

require_once __DIR__ . '/notion-config.php';

$name = trim("$firstName $lastName");

$properties = [
    'Project Name'  => ['title' => [['text' => ['content' => $name]]]],
    'Contact Email' => ['email' => $email],
    'Status'        => ['status' => ['name' => 'Not Contacted']],
];
if ($company) {
    $properties['Client'] = ['rich_text' => [['type' => 'text', 'text' => ['content' => $company]]]];
}

$body = [
    'parent'     => ['database_id' => $DATABASE_ID],
    'properties' => $properties,
    'children'   => [
        [
            'object' => 'block', 'type' => 'heading_3',
            'heading_3' => ['rich_text' => [['type' => 'text', 'text' => ['content' => 'Message from website']]]],
        ],
        [
            'object' => 'block', 'type' => 'paragraph',
            'paragraph' => ['rich_text' => [['type' => 'text', 'text' => ['content' => $message]]]],
        ],
    ],
];

$ch = curl_init('https://api.notion.com/v1/pages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($body),
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $NOTION_TOKEN,
        'Notion-Version: 2022-06-28',
        'Content-Type: application/json',
    ],
]);

$response   = curl_exec($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpStatus === 200) {
    echo json_encode(['ok' => true]);
} else {
    $detail = json_decode($response, true);
    http_response_code(500);
    echo json_encode(['error' => $detail['message'] ?? 'Failed to create lead']);
}
