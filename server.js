const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Object of empty rooms
const rooms = {};

// Render the homepage
app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});

app.post("/createRoom", (req, res) => {
  if (rooms[req.body.roomName] != null) {
    // return res.send({ status: 400, message: "Room already exists" });
    // TODO - add redirect to home with error popup for room already exists
    return res.redirect(req.body.roomName);
  }
  if (req.body.roomName) {
    rooms[req.body.roomName] = { users: {} };
    console.log(`Created new room ${req.body.roomName}`);
    res.redirect(req.body.roomName);

    // Send message that new room was created
    io.emit("room-created", req.body.roomName);
    return;
  }
  return res.send({ status: 400, message: "Failed to create room" });
});

// Render a room passed by URL param
app.get("/:room", (req, res) => {
  if (rooms[req.params.room]) {
    return res.render("room", { roomName: req.params.room });
  }
  return res.redirect("/");
});

io.on("connection", (socket) => {
  /** New user has joined the chat */
  socket.on("new-user", (roomName, name) => {
    socket.join(roomName);
    rooms[roomName].users[socket.id] = name;
    socket.to(roomName).broadcast.emit("user-connected", name);
  });

  /** Message has been received from a user */
  socket.on("send-message", (roomName, message) => {
    socket.to(roomName).broadcast.emit("chat-message", {
      message: message,
      name: rooms[roomName].users[socket.id],
    });
  });

  /** User has left the chat */
  socket.on("disconnect", () => {
    getUserRooms(socket).forEach(roomName => {
      socket.to(roomName).broadcast.emit("user-disconnected", rooms[roomName].users[socket.id]);
      delete rooms[roomName].users[socket.id];
    });
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] !== null) names.push(name);
    return names;
  }, [])
}

http.listen(port, () => {
  console.log(`Listening on ${port}`);
});
