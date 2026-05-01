$response = Invoke-WebRequest -Uri "http://localhost:8082/api/images/test" -Method Head -ErrorAction SilentlyContinue
$statusCode = if ($response) { $response.StatusCode } else { "Failed" }
Set-Content -Path "test.txt" -Value $statusCode
