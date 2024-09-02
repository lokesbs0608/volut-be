const Event = require('../models/Event');
const Organization = require('../models/Organization');
const Chat = require('../models/Chat');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { name, description, date, organizationId } = req.body;

        // Validate input
        if (!name || !description || !date || !organizationId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if organization exists
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found.' });
        }

        // Create and save the new event
        const event = new Event({ name, description, date, organization: organizationId });
        const savedEvent = await event.save();

        // Automatically create a chat for the event
        const chat = new Chat({ event: savedEvent._id });
        await chat.save();

        savedEvent.chat = chat._id;
        await savedEvent.save();

        // Add event to organization
        organization.events.push(savedEvent._id);
        await organization.save();

        res.status(201).json({ message: 'Event created successfully!', event: savedEvent });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Retrieve all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organization');
        res.status(200).json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Retrieve an event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('organization').populate('chat');

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, date, organizationId } = req.body;

        // Validate input
        if (!name || !description || !date || !organizationId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Find and update the event
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Optionally update the event
        event.name = name;
        event.description = description;
        event.date = date;
        event.organization = organizationId;

        const updatedEvent = await event.save();

        res.status(200).json({ message: 'Event updated successfully!', event: updatedEvent });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the event
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Remove event from organization
        const organization = await Organization.findById(event.organization);
        if (organization) {
            organization.events.pull(event._id);
            await organization.save();
        }

        // Optionally, delete the associated chat
        await Chat.findByIdAndDelete(event.chat);

        res.status(200).json({ message: 'Event deleted successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
