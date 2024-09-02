const Event = require('../models/Event');
const Organization = require('../models/Organization');
const Chat = require('../models/Chat');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const {
            name,
            description,
            date,
            organizationId,
            location,
            city,
            coordinators // Make sure to include this field if you need it
        } = req.body;

        // Validate input
        if (!name || !description || !date || !organizationId || !location || !city) {
            return res.status(400).json({ error: 'All required fields are not provided.' });
        }

        // Check if organization exists
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found.' });
        }

        // Create and save the new event
        const event = new Event({
            name,
            description,
            date,
            organization: organizationId,
            location, // Add the location
            city, // Add the city
            coordinators // Add the coordinators if provided
        });

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

// Request to volunteer for an event
exports.requestToVolunteer = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        // Validate input
        if (!eventId || !userId) {
            return res.status(400).json({ error: 'Event ID and User ID are required.' });
        }

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Check if the user is already in the requested volunteers list
        if (event.req_volunteers.includes(userId)) {
            return res.status(400).json({ error: 'User has already requested to volunteer for this event.' });
        }

        // Add the user to the req_volunteers array
        event.req_volunteers.push(userId);
        await event.save();

        res.status(200).json({ message: 'Request to volunteer sent successfully.', event });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Accept a volunteer request
exports.acceptVolunteer = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        // Validate input
        if (!eventId || !userId) {
            return res.status(400).json({ error: 'Event ID and User ID are required.' });
        }

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Check if the user is in the requested volunteers list
        if (!event.req_volunteers.includes(userId)) {
            return res.status(400).json({ error: 'User has not requested to volunteer for this event.' });
        }

        // Remove the user from req_volunteers and add to accepted_volunteers
        event.req_volunteers.pull(userId);
        event.accepted_volunteers.push(userId);
        await event.save();

        res.status(200).json({ message: 'Volunteer request accepted successfully.', event });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all events associated with an organization
exports.getEventsByOrganizationId = async (req, res) => {
    try {
        const { organizationId } = req.params;

        // Validate input
        if (!organizationId) {
            return res.status(400).json({ error: 'Organization ID is required.' });
        }

        // Check if the organization exists
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found.' });
        }

        // Retrieve events associated with the organization, excluding specific fields
        const events = await Event.find({ organization: organizationId })
            .select('-reg_volunteers -accepted_volunteers -chat'); // Exclude specific fields

        res.status(200).json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};