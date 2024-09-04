"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const http_1 = require("http");
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const reelsRoutes_1 = __importDefault(require("./routes/reelsRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
// Call connectDB to connect to MongoDB
(0, db_1.default)();
// Middleware
app.use(express_1.default.json());
// Use the correct routers with their respective paths
app.use('/api/auth', authRoutes_1.default);
app.use('/api/reels', reelsRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('This is a test web page!');
});
// Create HTTP server and attach the Express app
const httpServer = (0, http_1.createServer)(app);
// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});
// Export the HTTP server for use in WebSocket setup or other purposes
exports.default = httpServer;
