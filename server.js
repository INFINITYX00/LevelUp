const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  // Ensure message is provided
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Prepare options for the HTTPS request
  const options = {
    hostname: "api.chatgpt.com",
    port: 443,
    path: "/g/g-nsEAu6Ns7-powering-futures-advisor",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify({ message })),
    },
  };

  // Create the request
  const reqOpenAI = https.request(options, (response) => {
    let data = "";

    // Collect response data
    response.on("data", (chunk) => {
      data += chunk;
    });

    // Handle end of response
    response.on("end", () => {
      try {
        const responseData = JSON.parse(data);
        const responseMessage = responseData.message; // Adjust based on actual response format
        res.json({ response: responseMessage });
      } catch (error) {
        console.error("Error parsing response:", error);
        res.status(500).json({ error: "Failed to parse response" });
      }
    });
  });

  // Handle request errors
  reqOpenAI.on("error", (error) => {
    console.error("Request error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  });

  // Write request body
  reqOpenAI.write(JSON.stringify({ message }));

  // End request
  reqOpenAI.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
