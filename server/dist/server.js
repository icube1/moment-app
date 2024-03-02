"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const rooms = {
    room1: { status: 'waiting', groupNumber: 1, chat: [] },
    room2: { status: 'waiting', groupNumber: 2, chat: [] },
    room3: { status: 'waiting', groupNumber: 3, chat: [] },
    room4: { status: 'waiting', groupNumber: 4, chat: [] },
    room5: { status: 'waiting', groupNumber: 5, chat: [] },
    room6: { status: 'waiting', groupNumber: 6, chat: [] },
};
io.on('connection', (socket) => {
    socket.on('joinRoom', (roomNumber) => {
        const roomKey = `room${roomNumber}`;
        if (roomNumber >= 1 && roomNumber <= 6) {
            if (!rooms[roomKey]) {
                rooms[roomKey] = { status: 'waiting', groupNumber: roomNumber, chat: [] };
            }
            socket.join(roomKey);
            io.to(roomKey).emit('roomStatus', rooms[roomKey]);
        }
    });
    socket.on('changeStatus', (roomNumber, status, groupNumber) => {
        const roomKey = `room${roomNumber}`;
        if (roomNumber >= 1 && roomNumber <= 6 && ['waiting', 'ready-to-go', 'going'].includes(status)) {
            if (rooms[roomKey]) {
                rooms[roomKey] = { status, groupNumber, chat: rooms[roomKey].chat };
                io.to(roomKey).emit('roomStatus', rooms[roomKey]);
            }
        }
    });
    socket.on('chatMessage', (roomNumber, message) => {
        const roomKey = `room${roomNumber}`;
        if (roomNumber >= 1 && roomNumber <= 6 && rooms[roomKey]) {
            rooms[roomKey].chat.push(message);
            io.to(roomKey).emit('chatMessage', rooms[roomKey].chat);
        }
    });
});
app.get('/', (_req, res) => {
    res.send('ok');
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map