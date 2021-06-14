const socket = io("https://socket-chat-plain.herokuapp.com/");
const roomList = document.getElementById("room-list");

// Display new name when room is created
socket.on("room-created", (room) => {
  appendRoomName(room);
});

/** Add new room to list */
const appendRoomName = (room) => {
  const roomWrapper = document.createElement("div");
  roomWrapper.classList.add('roomWrapper');
  const roomElement = document.createElement("div");
  roomElement.classList.add('roomName');
  roomElement.innerText = room;
  const roomLink = document.createElement("a");
  roomLink.classList.add('roomLink');
  roomLink.href = `/${room}`;
  roomLink.innerText = "Join";
  roomWrapper.append(roomElement);
  roomWrapper.append(roomLink);
  roomList.append(roomWrapper)
};
