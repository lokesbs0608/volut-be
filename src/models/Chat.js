const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  messages: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: false },
    text: String,
    image: String,
    file: String,
    timestamp: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('Chat', ChatSchema);
