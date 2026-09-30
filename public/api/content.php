<?php
require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = content_path();

if ($method === 'GET') {
  if (!is_file($path)) {
    json_response(['ok' => false, 'error' => 'Content file missing'], 404);
  }
  $raw = file_get_contents($path);
  $data = json_decode($raw, true);
  if (!is_array($data)) {
    json_response(['ok' => false, 'error' => 'Corrupt content file'], 500);
  }
  json_response(['ok' => true, 'content' => $data]);
}

if ($method === 'PUT' || $method === 'POST') {
  require_auth();
  $body = read_json_body();
  $content = isset($body['content']) && is_array($body['content']) ? $body['content'] : $body;

  if (!isset($content['version']) || !isset($content['contact']) || !isset($content['blogPosts'])) {
    json_response(['ok' => false, 'error' => 'Content missing required fields'], 400);
  }

  $dir = dirname($path);
  if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    json_response(['ok' => false, 'error' => 'Cannot create content directory'], 500);
  }

  $encoded = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  if ($encoded === false) {
    json_response(['ok' => false, 'error' => 'Failed to encode content'], 500);
  }

  $tmp = $path . '.tmp';
  if (file_put_contents($tmp, $encoded . "\n", LOCK_EX) === false) {
    json_response(['ok' => false, 'error' => 'Failed to write content'], 500);
  }
  if (!rename($tmp, $path)) {
    @unlink($tmp);
    json_response(['ok' => false, 'error' => 'Failed to publish content'], 500);
  }

  json_response(['ok' => true, 'saved' => true]);
}

json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
