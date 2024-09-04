import express from 'express';
import connectDB from './config/db';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatRouter from './routes/chatRoutes';
import reelsRouter from './routes/reelsRoutes';
import userRouter from './routes/authRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routers
app.use('/api/auth', userRouter);
app.use('/api/reels', reelsRouter);

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('This is a test web page!');
});



// Create HTTP server and attach the Express app
const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});

export default httpServer;
