const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const CoordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  title: String,
  department: String,
});
const EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  reg_volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  accepted_volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  location: { type: String, },
  city: { type: String, },
  coordinators: [CoordinatorSchema],
});

module.exports = mongoose.model("Event", EventSchema);
