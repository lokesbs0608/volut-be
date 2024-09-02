const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');

// Create a new organization
exports.registerOrganization = async (req, res) => {
  try {
    const { name, email, password, description } = req.body;

    // Validate input
    if (!name || !email || !password || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if organization already exists
    const existingOrganization = await Organization.findOne({ email });
    if (existingOrganization) {
      return res.status(409).json({ error: 'Organization with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new organization
    const organization = new Organization({ name, email, password: hashedPassword, description });
    await organization.save();

    res.status(201).json({ message: 'Organization registered successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve all organizations
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve an organization by ID
exports.getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.status(200).json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an organization by ID
exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, description } = req.body;

    // Validate input
    if (!name || !email || !description) {
      return res.status(400).json({ error: 'Name, email, and description are required.' });
    }

    // Find and update the organization
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Optionally update password if provided
    if (password) {
      organization.password = await bcrypt.hash(password, 10);
    }

    organization.name = name;
    organization.email = email;
    organization.description = description;
    await organization.save();

    res.status(200).json({ message: 'Organization updated successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an organization by ID
exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByIdAndDelete(id);

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.status(200).json({ message: 'Organization deleted successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
