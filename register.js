const response = await fetch(
  "http://localhost/telemedicine_platform/backend/register.php",
  {
    method: "POST",
    body: formData,
  }
);
