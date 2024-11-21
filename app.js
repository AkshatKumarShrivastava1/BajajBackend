const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mime = require("mime-types");

app.use(bodyParser.json());

// Utility function to check for prime numbers
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid data" });
  }

  // Separate numbers and alphabets
  const numbers = data.filter((item) => !isNaN(item)).map(Number);
  const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));

  // Find the highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter((char) => char === char.toLowerCase());
  const highestLowercaseAlphabet = lowercaseAlphabets.sort().slice(-1);

  // Check for prime numbers
  const primeFound = numbers.some(isPrime);

  // Handle file processing
  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKB = null;

  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");
      fileSizeKB = (buffer.length / 1024).toFixed(2);
      fileMimeType = mime.lookup(buffer) || "unknown";
      fileValid = true;
    } catch (error) {
      fileValid = false;
    }
}

// Response object
const response = {
  is_success: true,
  user_id: "your_name_ddmmyyyy",
  email: "your_email@example.com",
  roll_number: "your_roll_number",
  numbers,
  alphabets,
  highest_lowercase_alphabet: highestLowercaseAlphabet,
  is_prime_found: primeFound,
  file_valid: fileValid,
  file_mime_type: fileMimeType,
  file_size_kb: fileSizeKB,
};

res.json(response);
});

app.get("/bfhl", (req, res) => {
res.status(200).json({ operation_code: 1 });
});

app.listen(port, () => {
console.log(`http://localhost:${port}/bfhl`);
});