require("dotenv").config();
const express = require("express");
const https = require("https");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function makeOpenAIRequest(data) {
  return new Promise((resolve, reject) => {
    const options = {
      //   hostname: "api.openai.com",
      //   path: "/v1/chat/completions", // Updated endpoint
      hostname: "api.openai.com",
      path: "/g/g-nsEAu6Ns7-powering-futures-advisor",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(responseData));
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const data = await makeOpenAIRequest({
      model: "gpt-3.5-turbo", // Specify the model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });
    res.json({ generatedText: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while generating text." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
