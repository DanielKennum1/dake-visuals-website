<?php
// Lead endpoint for the Meta Ads landing page.
// Saves each lead to the same Notion database as the main site's contact form.
// Credentials: put a notion-config.php ($NOTION_TOKEN, $DATABASE_ID) next to this
// file, or leave it out and the main site's ../notion-config.php is used.

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Honeypot: real people never see or fill this field. Pretend it worked.
if (!empty($input['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function field($input, $key, $max) {
    $v = trim((string)($input[$key] ?? ''));
    return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
}

$name      = field($input, 'name', 120);
$phone     = field($input, 'phone', 40);
$email     = field($input, 'email', 160);
$company   = field($input, 'company', 160);
$need      = field($input, 'need', 1500);

if (!$name || !$phone || !$company
    || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$config = file_exists(__DIR__ . '/notion-config.php')
    ? __DIR__ . '/notion-config.php'
    : __DIR__ . '/../notion-config.php';
if (!file_exists($config)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server not configured']);
    exit;
}
require_once $config;

function rt($text) {
    return [['type' => 'text', 'text' => ['content' => $text]]];
}

// These properties already exist in the leads database (same as the contact form).
$base = [
    'Name'    => ['title' => rt($company)],
    'Email'   => ['email' => $email],
    'Status'  => ['select' => ['name' => 'Not Contacted']],
    'Person'  => ['rich_text' => rt($name)],
    'Company' => ['rich_text' => rt($company)],
];
// Used only if the database has them ("Phone" = phone property, "Source" = select).
// If it doesn't, the lead is saved without them; phone and source are always in the page body.
$extra = [
    'Phone'  => ['phone_number' => $phone],
    'Source' => ['select' => ['name' => 'Meta Ads']],
];

function heading($text) {
    return ['object' => 'block', 'type' => 'heading_3', 'heading_3' => ['rich_text' => rt($text)]];
}
function para($text) {
    return ['object' => 'block', 'type' => 'paragraph', 'paragraph' => ['rich_text' => rt($text)]];
}

$children = [
    heading('Booking fra dakevisuals.com/book (Meta Ads)'),
    para("Navn: $name\nTelefon: $phone\nE-mail: $email\nVirksomhed: $company"),
    heading('Kommentar'),
    para($need !== '' ? $need : 'Ingen kommentar.'),
];

function create_page($properties, $children, $token, $dbId) {
    $ch = curl_init('https://api.notion.com/v1/pages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_POSTFIELDS     => json_encode([
            'parent'     => ['database_id' => $dbId],
            'properties' => $properties,
            'children'   => $children,
        ]),
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $token,
            'Notion-Version: 2022-06-28',
            'Content-Type: application/json',
        ],
    ]);
    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$status, $response];
}

[$status, $response] = create_page(array_merge($base, $extra), $children, $NOTION_TOKEN, $DATABASE_ID);
if ($status === 400) {
    // Most likely the database has no Phone/Source property: retry without them.
    [$status, $response] = create_page($base, $children, $NOTION_TOKEN, $DATABASE_ID);
}

if ($status === 200) {
    echo json_encode(['ok' => true]);
} else {
    $detail = json_decode($response, true);
    http_response_code(500);
    echo json_encode(['error' => $detail['message'] ?? 'Failed to create lead']);
}
