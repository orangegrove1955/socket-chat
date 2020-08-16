const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

window.onload = () => {
  const name = prompt("What is your name?");
  appendMessage("You have joined the chat");
  socket.emit("new-user", name);
};

// Display messages when incoming
socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

/* Display when new users join the chat */
socket.on("user-connected", (name) => {
  appendMessage(`${name} has joined the chat`);
});

/* Display when a user leaves the chat */
socket.on("user-disconnected", (name) => {
  appendMessage(`${name} has left the chat`);
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
  appendMessage(`You: ${message}`);
  messageInput.value = "";
};

/** Append a new message to the chat */
const appendMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
};
