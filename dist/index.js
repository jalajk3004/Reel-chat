"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const http_1 = require("http");
const reelsRoutes_1 = __importDefault(require("./routes/reelsRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Connect to MongoDB
(0, db_1.default)();
// Middleware
app.use(express_1.default.json());
// Routers
app.use('/api/auth', authRoutes_1.default);
app.use('/api/reels', reelsRoutes_1.default);
// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('This is a test web page!');
});
// Create HTTP server and attach the Express app
const httpServer = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});
exports.default = httpServer;
