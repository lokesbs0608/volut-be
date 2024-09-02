const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const organizationRoutes = require('./routes/organization');
const eventRoutes = require('./routes/event');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/chats', chatRoutes);

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Handle incoming messages
    socket.on('sendMessage', (message) => {
        const { roomId, text, userId, organizationId } = message;

        // Broadcast message to the room
        io.to(roomId).emit('message', { text, userId, organizationId });

        // Optionally save the message to the database
        // saveMessageToDB(roomId, text, userId, organizationId);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
