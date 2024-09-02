const Chat = require('../models/Chat');
const path = require('path');
const multer = require('multer');
const Event = require('../models/Event');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Middleware to handle file uploads
exports.uploadFile = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]);

// Create a new message in the chat
exports.createMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { user, organization, text } = req.body;
    const image = req.files && req.files.image ? req.files.image[0].path : '';
    const file = req.files && req.files.file ? req.files.file[0].path : '';

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    // Find the event associated with this chat
    const event = await Event.findById(chat.event);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // Check if the user is in the accepted_volunteers list
    if (!event.accepted_volunteers.includes(user)) {
      return res.status(403).json({ error: 'You are not authorized to chat in this event.' });
    }

    const newMessage = {
      user: user || undefined,
      organization: organization || undefined,
      text: text || '',
      image: image || '',
      file: file || '',
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Emit the message to all clients in the room
    req.io.to(chatId).emit('message', newMessage);

    res.status(201).json({ message: 'Message added successfully!', chat });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Retrieve all messages for a specific event (chat)
exports.getChatByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const chat = await Chat.findOne({ event: eventId }).populate('messages.user', 'name email').populate('messages.organization', 'name email');
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found for this event.' });
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
