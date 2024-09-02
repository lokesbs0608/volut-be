const mongoose = require('mongoose');

const CoordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  title: String, // Title of the coordinator (e.g., 'Event Manager', 'Volunteer Coordinator')
  department: String // Department the coordinator belongs to (e.g., 'Events', 'Public Relations')
});

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  logo: String, // URL or path to the logo image
  contactNumber: String, // Primary contact number
  website: String, // Website address
  bannerImage: String, // URL or path to the banner image
  locationAlternateNumber: String, // Alternate contact number for the location
  alternateEmail: String, // Alternate email address
  coordinators: [CoordinatorSchema], // List of coordinators
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  status: { type: Boolean }
});

module.exports = mongoose.model('Organization', OrganizationSchema);
