require("dotenv").config();
const express = require("express");
const https = require("https");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Array of questions to ask the user
const questions = [
  "Hi there! I'm Hustle Ninja, your AI sidekick! I'm going to ask you some questions to help you level up your future! In the box to the left of me, type your response and hit 'LEVEL UP'. Let's get started! What are you interested in?",
  "What subjects or activities do you enjoy the most at school or in your free time?",
  "Are there any hobbies or projects you’ve worked on that you’re particularly proud of? Tell me more about them.",
  "What kind of tasks do you find most satisfying—working with your hands, solving problems, leading a team, or something else?",
  "Do you prefer working in a team environment, or do you enjoy working independently more?",
  "What are some things you want to achieve in your career—are you looking for a role with a lot of variety, one that offers opportunities for advancement, or perhaps something with a strong focus on a particular area?",
];

// Array of job recommendations with placeholder recommendations
const jobRecommendations = [
  {
    title: "Data Analyst",
    description:
      "Data Analysts interpret data to help companies make informed decisions.",
    reasons: [
      "If you enjoy working with numbers and solving puzzles, this role could be a great fit.",
      "It offers opportunities to work in various industries, including finance, healthcare, and technology.",
      "You can often start in this role with an apprenticeship or certification, which is an excellent way to get your foot in the door.",
    ],
  },
  {
    title: "Graphic Designer",
    description:
      "Graphic Designers create visual content for print and digital media.",
    reasons: [
      "If you have a passion for art and design, this role allows you to be creative daily.",
      "It provides opportunities to work on diverse projects, from marketing materials to website designs.",
      "Building a strong portfolio can help you get started, even if you start with freelance or internship experiences.",
    ],
  },
  {
    title: "IT Support Specialist",
    description:
      "IT Support Specialists assist with computer and software issues, ensuring smooth operations within an organization.",
    reasons: [
      "If you like solving technical problems and helping others, this role is a great way to start.",
      "It offers a clear career path with opportunities for advancement in IT fields.",
      "Many entry-level positions require minimal experience and can be accessed through certifications.",
    ],
  },
];

let currentQuestionIndex = 0;
let userResponses = [];

// Function to generate a response based on user input
function generateResponse(input) {
  // Simple logic to generate a response based on user input
  if (input.toLowerCase().includes("interested in technology")) {
    return "Based on your interest in technology, roles like IT Support Specialist or Data Analyst might be a good fit.";
  } else if (input.toLowerCase().includes("creative")) {
    return "If you're creative, you might enjoy roles like Graphic Designer or Marketing Associate.";
  } else if (input.toLowerCase().includes("working with people")) {
    return "If you like working with people, consider roles like Customer Service or Human Resources Assistant.";
  } else {
    return "Thanks for sharing! Based on what you've told me, I'll recommend some roles for you shortly.";
  }
}

app.post("/chat", async (req, res) => {
  const { userInput } = req.body;

  // Initialize conversation state or handle incoming response
  if (!userInput) {
    // Start the conversation
    return res.json({ prompt: questions[currentQuestionIndex] });
  }

  if (currentQuestionIndex < questions.length) {
    // Store user responses
    userResponses.push(userInput);

    // Generate a response based on user input
    const response = generateResponse(userInput);

    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      return res.json({
        response: `<p>${response}</p>`,
        prompt: questions[currentQuestionIndex],
      });
    } else {
      // After all questions, provide job recommendations
      const recommendations = jobRecommendations
        .map(
          (job) => `
        <div class="job-recommendation">
          <h3>${job.title}</h3>
          <p><strong>Description:</strong> ${job.description}</p>
          <p><strong>Why I recommend it:</strong></p>
          <ul>
            ${job.reasons.map((reason) => `<li>${reason}</li>`).join("")}
          </ul>
          <p>Do any of these roles sound interesting to you?</p>
        </div>
      `
        )
        .join("");

      return res.json({
        response: `
        <h2>Here are some job roles you might consider:</h2>
        ${recommendations}
        <p>If you’d like to know more about any of these roles or need further assistance, just let me know!</p>
      `,
      });
    }
  } else {
    // Additional responses after recommendation
    return res.json({
      response:
        "Thank you for chatting with us! If you have any other questions, feel free to ask.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
