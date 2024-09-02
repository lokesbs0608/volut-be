const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    if (process.env.MONGO_URI) {
        try {
            // Establish the MongoDB connection with options
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB connected');
        } catch (err) {
            console.error('MongoDB connection failed', err);
            process.exit(1);
        }
    } else {
        console.error('MONGO_URI not found in environment variables');
        process.exit(1);
    }
};

module.exports = connectDB;
