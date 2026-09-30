<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

json_response([
  'ok' => true,
  'authenticated' => !empty($_SESSION['ccf_authenticated']),
]);
