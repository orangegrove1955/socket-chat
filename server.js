// Start server on port 3000
const io = require("socket.io")(3000);

const users = {};

io.on("connection", (socket) => {
  /** New user has joined the chat */
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  /** Message has been received from a user */
  socket.on("send-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  /** User has left the chat */
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
