const express = require('express');
const {
    createMessage,
    uploadFile,
    getChatByEventId
} = require('../controllers/chatController');
const router = express.Router();

// Middleware to attach io object to req
router.use((req, res, next) => {
    req.io = req.app.get('io');
    next();
});

// Endpoint to handle file uploads and create a message
router.post('/:chatId/message', uploadFile, createMessage);

// Endpoint to get all messages for a specific event (chat)
router.get('/event/:eventId', getChatByEventId);

module.exports = router;
