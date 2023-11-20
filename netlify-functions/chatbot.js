// chatbot.js
document.addEventListener('DOMContentLoaded', function () {
  const chatContainer = document.getElementById('chatContainer');
  const chatbotButton = document.getElementById('chatbotButton');

  chatbotButton.addEventListener('click', function () {
    // Replace this with your chatbot logic or API calls
    const message = 'Hello, I am your chatbot!';
    displayMessage(message);
  });

  function displayMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
  }
});
