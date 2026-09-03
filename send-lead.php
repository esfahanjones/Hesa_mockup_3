<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['email']) || empty($input['name'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Name and Email are required.']);
    exit;
}

$name    = htmlspecialchars($input['name']);
$email   = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$company = htmlspecialchars($input['company'] ?? 'N/A');
$phone   = htmlspecialchars($input['phone'] ?? 'N/A');
$pdf     = htmlspecialchars($input['pdfRequested'] ?? 'Company Profile');
$date    = date('Y-m-d H:i:s');

// 1. Save entry to leads.csv as a backup log
$csvFile = 'leads.csv';
$fileData = [$date, $name, $email, $company, $phone, $pdf];
$fp = fopen($csvFile, 'a');
if ($fp) {
    fputcsv($fp, $fileData);
    fclose($fp);
}

// 2. Send email notification
$to = "hesasia.sb@gmail.com";
$subject = "New PDF Lead: " . $name;

$message = "
<html>
<head><title>New PDF Access Request</title></head>
<body style='font-family: Arial, sans-serif; color: #333;'>
  <h2>New PDF Access Request</h2>
  <p><strong>Requested File:</strong> {$pdf}</p>
  <hr style='border: 0; border-top: 1px solid #ccc;'>
  <p><strong>Name:</strong> {$name}</p>
  <p><strong>Work Email:</strong> {$email}</p>
  <p><strong>Company:</strong> {$company}</p>
  <p><strong>Phone:</strong> {$phone}</p>
  <p><strong>Timestamp:</strong> {$date}</p>
</body>
</html>
";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: HES Asia Website <no-reply@" . $_SERVER['SERVER_NAME'] . ">\r\n";
$headers .= "Reply-To: {$email}\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['status' => 'success']);
} else {
    // Email dispatch failed, but lead is safely stored in leads.csv
    echo json_encode(['status' => 'success', 'note' => 'Saved to CSV log']);
}