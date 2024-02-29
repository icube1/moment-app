// server.ts
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms: { [key: string]: { status: string, groupNumber: number, chat: string[] } } = {};

io.on('connection', (socket: Socket) => {
  socket.on('joinRoom', (roomNumber: number) => {
    if (roomNumber >= 1 && roomNumber <= 6) {
      socket.join(`room${roomNumber}`);
      rooms[`room${roomNumber}`] = { status: 'waiting', groupNumber: 0, chat: [] };
      io.to(`room${roomNumber}`).emit('roomStatus', rooms[`room${roomNumber}`]);
    }
  });

  socket.on('changeStatus', (roomNumber: number, status: string, groupNumber: number) => {
    if (roomNumber >= 1 && roomNumber <= 6 && ['waiting', 'ready-to-go', 'going'].includes(status)) {
      rooms[`room${roomNumber}`] = { status, groupNumber, chat: rooms[`room${roomNumber}`].chat };
      io.to(`room${roomNumber}`).emit('roomStatus', rooms[`room${roomNumber}`]);
    }
  });

  socket.on('chatMessage', (roomNumber: number, message: string) => {
    if (roomNumber >= 1 && roomNumber <= 6) {
      rooms[`room${roomNumber}`].chat.push(message);
      io.to(`room${roomNumber}`).emit('chatMessage', rooms[`room${roomNumber}`].chat);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});