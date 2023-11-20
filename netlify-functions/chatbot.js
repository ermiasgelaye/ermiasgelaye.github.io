// netlify-functions/chatbot.js
exports.handler = async function (event, context) {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello, I am your chatbot!' }),
  };

  return response;
};