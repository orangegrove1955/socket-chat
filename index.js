const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

// Display messages when incoming
socket.on("chat-message", (data) => {
  appendMessage(data);
});

// Add event listener to send message when message form is submitted
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

/** Send new message to the server */
const sendMessage = () => {
  const message = messageInput.value;
  socket.emit("send-message", message);
  messageInput.value = "";
};

/** Append a new message to the chat */
const appendMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
};
