import { Server } from "socket.io"

const io = new Server({ 
  cors: "*"
});

io.on("connection", (socket) => {
  socket.on("hello", (username) => {
    socket.emit("hello",`hello ${username}`);
  }); 
});

io.listen(3000);