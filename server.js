// Start server on port 3000
const io = require("socket.io")(3000);

io.on("connection", (socket) => {
  socket.emit("chat-message", "Welcome to the chat!");
  socket.on("send-message", (message) => {
    socket.broadcast.emit("chat-message", message);
  });
});
