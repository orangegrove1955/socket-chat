// Start server on port 3000
const io = require("socket.io")(3000);

io.on("connection", (socket) => {
  console.log(socket);
  socket.emit("chat-message", "hello world");
});
