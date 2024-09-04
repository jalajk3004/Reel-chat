import http, { createServer } from "http";
import express from "express";
import cors from 'cors';
import { Server } from "socket.io";

const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:3001`;

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(cors({
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

export default server;
