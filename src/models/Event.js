const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
});

module.exports = mongoose.model('Event', EventSchema);
