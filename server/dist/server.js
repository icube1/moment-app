"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const rooms = {};
io.on('connection', (socket) => {
    socket.on('joinRoom', (roomNumber) => {
        if (roomNumber >= 1 && roomNumber <= 6) {
            socket.join(`room${roomNumber}`);
            rooms[`room${roomNumber}`] = { status: 'waiting', groupNumber: 0, chat: [] };
            io.to(`room${roomNumber}`).emit('roomStatus', rooms[`room${roomNumber}`]);
        }
    });
    socket.on('changeStatus', (roomNumber, status, groupNumber) => {
        if (roomNumber >= 1 && roomNumber <= 6 && ['waiting', 'ready-to-go', 'going'].includes(status)) {
            rooms[`room${roomNumber}`] = { status, groupNumber, chat: rooms[`room${roomNumber}`].chat };
            io.to(`room${roomNumber}`).emit('roomStatus', rooms[`room${roomNumber}`]);
        }
    });
    socket.on('chatMessage', (roomNumber, message) => {
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
//# sourceMappingURL=server.js.map