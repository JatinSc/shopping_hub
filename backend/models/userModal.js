const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: [true, 'firstName is required'] },
    lastName: { type: String, required: [true, 'lastName is required'] },
    email: { type: String, unique: true, required: [true, 'email is required'] },
    password: { type: String, required: [true, 'password is required'] }, // Store hashed password
    gender: { type: String, default: null },
    address: {
        type: Object,
        default: null,
    },
    userPhoto: { type: String, default: null }, // URL or file path to user's profile photo
    storeLogo: { type: String, default: null }, // URL or file path to the store's logo
    storeName: { type: String, default: null }, // Name of the user's store (if applicable)
    storeBanner: { type: String, default: null },
    joined: {
        type: String, default: new Date().toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'utc'
            }
        )
    },
    updatedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
});

// Create a User model
const User = mongoose.model('User', userSchema);

module.exports = User;
