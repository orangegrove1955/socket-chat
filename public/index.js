const socket = io("http://socket-chat-plain.herokuapp.com/");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

window.onload = () => {
  const name = prompt("What is your name?");
  appendNotificationMessage("You have joined the chat");
  socket.emit("new-user", name);
};

// Display messages when incoming
socket.on("chat-message", (data) => {
  appendServerMessage(data.name, data.message);
});

/* Display when new users join the chat */
socket.on("user-connected", (name) => {
  appendNotificationMessage(`${name} has joined the chat`);
});

/* Display when a user leaves the chat */
socket.on("user-disconnected", (name) => {
  appendNotificationMessage(`${name} has left the chat`);
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
  appendMessage(message);
  messageInput.value = "";
};

/** Append a new message to the chat */
const appendMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("self");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
};

/** Append a new server message to the chat */
const appendServerMessage = (name, message) => {
  const containerElement = document.createElement("div");
  containerElement.classList.add("server");
  // Add name
  const nameElement = document.createElement("p");
  nameElement.classList.add("name");
  nameElement.innerText = name;
  // Add message
  const messageElement = document.createElement("p");
  messageElement.classList.add("server-message");
  messageElement.innerText = message;

  containerElement.append(nameElement);
  containerElement.append(messageElement);
  messageContainer.append(containerElement);
};

/** Append a new server message to the chat */
const appendNotificationMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("notification");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
};
