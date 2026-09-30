<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$config = require __DIR__ . '/config.php';
$body = read_json_body();
$password = isset($body['password']) ? (string) $body['password'] : '';

if (!hash_equals((string) $config['password'], $password)) {
  json_response(['ok' => false, 'error' => 'Invalid password'], 401);
}

$_SESSION['ccf_authenticated'] = true;
json_response(['ok' => true, 'authenticated' => true]);
