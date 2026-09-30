<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$config = require __DIR__ . '/config.php';
session_name($config['session_name']);
session_start([
  'cookie_httponly' => true,
  'cookie_samesite' => 'Lax',
  'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);

function json_response($data, $status = 200) {
  http_response_code($status);
  echo json_encode($data);
  exit;
}

function require_auth() {
  if (empty($_SESSION['ccf_authenticated'])) {
    json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
  }
}

function read_json_body() {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  if (!is_array($data)) {
    json_response(['ok' => false, 'error' => 'Invalid JSON body'], 400);
  }
  return $data;
}

function content_path() {
  return dirname(__DIR__) . '/content/site-content.json';
}
