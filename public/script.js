const promptInput = document.getElementById("prompt");
const submitButton = document.getElementById("submit");
const resultDiv = document.getElementById("result");

submitButton.addEventListener("click", generateText);

async function generateText() {
  const prompt = promptInput.value;

  if (!prompt) {
    alert("Please enter a prompt");
    return;
  }

  submitButton.disabled = true;
  resultDiv.textContent = "Generating...";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    resultDiv.textContent = data.generatedText;
  } catch (error) {
    console.error("Error occurred:", error);
    resultDiv.textContent = "An error occurred while generating text.";
  } finally {
    submitButton.disabled = false;
  }
}
