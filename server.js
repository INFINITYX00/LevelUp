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
      hostname: "api.openai.com",
      path: "/v1/chat/completions",
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
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `OpenAI API returned status code ${res.statusCode}: ${responseData}`
            )
          );
        } else {
          resolve(JSON.parse(responseData));
        }
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

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res
      .status(400)
      .json({ error: "Prompt is required and must be a non-empty string." });
  }

  try {
    const data = await makeOpenAIRequest({
      model: process.env.OPENAI_MODEL_ID,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150, // Adjust based on your needs
      temperature: 0.7, // Adjust for more creative or deterministic responses
    });

    res.json({ generatedText: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Detailed Error:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      response: error.response ? error.response.data : null,
    });

    res.status(500).json({ error: "An error occurred while generating text." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
