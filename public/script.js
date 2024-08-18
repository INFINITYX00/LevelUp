document.addEventListener("DOMContentLoaded", () => {
  // Initialize conversation on page load
  fetchPrompt();

  document.getElementById("submit").addEventListener("click", async () => {
    const userInput = document.getElementById("prompt").value;

    if (userInput.trim() === "") return;

    // Clear the input box
    document.getElementById("prompt").value = "";

    // Send user input and get the next prompt or response
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      if (data.prompt) {
        // Display the prompt for the next question
        document.getElementById("result").innerHTML = `<p>${data.prompt}</p>`;
      } else if (data.response) {
        // Display final response or recommendations
        document.getElementById("result").innerHTML = `<p>${data.response}</p>`;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

// Function to fetch the initial prompt
async function fetchPrompt() {
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.prompt) {
      document.getElementById("result").innerHTML = `<p>${data.prompt}</p>`;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
