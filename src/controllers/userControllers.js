const User = require('../models/Users');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, interestedFields, resume } = req.body;

    // Validate input
    if (!name || !email || !password || !interestedFields || !resume) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({ name, email, password: hashedPassword, interestedFields, resume });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve a user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, interestedFields, resume } = req.body;

    // Validate input
    if (!name || !email || !interestedFields || !resume) {
      return res.status(400).json({ error: 'Name, email, interested fields, and resume are required.' });
    }

    // Find and update the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Optionally update the password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.name = name;
    user.email = email;
    user.interestedFields = interestedFields;
    user.resume = resume;

    const updatedUser = await user.save();

    res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
