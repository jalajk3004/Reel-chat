"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:3001`;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Socket server is running!");
});
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('user-message', (message) => {
        console.log('Received message:', message);
        socket.broadcast.emit('message', { text: message, socketId: socket.id });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
server.listen(9000, () => {
    console.log(`Server is running on PORT: 9000`);
});
exports.default = server;
