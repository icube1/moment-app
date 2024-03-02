import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms: { [key: string]: { status: string, groupNumber: number, chat: string[] } } = {
  room1: { status: 'waiting', groupNumber: 1, chat: [] },
  room2: { status: 'waiting', groupNumber: 2, chat: [] },
  room3: { status: 'waiting', groupNumber: 3, chat: [] },
  room4: { status: 'waiting', groupNumber: 4, chat: [] },
  room5: { status: 'waiting', groupNumber: 5, chat: [] },
  room6: { status: 'waiting', groupNumber: 6, chat: [] },
};

io.on('connection', (socket: Socket) => {
  socket.on('joinRoom', (roomNumber: number) => {
    const roomKey = `room${roomNumber}`;
    if (roomNumber >= 1 && roomNumber <= 6) {
      if (!rooms[roomKey]) {
        rooms[roomKey] = { status: 'waiting', groupNumber: roomNumber, chat: [] };
      }
      socket.join(roomKey);
      io.to(roomKey).emit('roomStatus', rooms[roomKey]);
    }
  });

  socket.on('changeStatus', (roomNumber: number, status: string, groupNumber: number) => {
    const roomKey = `room${roomNumber}`;
    if (roomNumber >= 1 && roomNumber <= 6 && ['waiting', 'ready-to-go', 'going'].includes(status)) {
      if (rooms[roomKey]) {
        rooms[roomKey] = { status, groupNumber, chat: rooms[roomKey].chat };
        io.to(roomKey).emit('roomStatus', rooms[roomKey]);
      }
    }
  });

  socket.on('chatMessage', (roomNumber: number, message: string) => {
    const roomKey = `room${roomNumber}`;
    if (roomNumber >= 1 && roomNumber <= 6 && rooms[roomKey]) {
      rooms[roomKey].chat.push(message);
      io.to(roomKey).emit('chatMessage', rooms[roomKey].chat);
    }
  });
});


app.get('/', (_req, res) => {
  res.send('ok');
})

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
