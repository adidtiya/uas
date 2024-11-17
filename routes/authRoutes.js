const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // User model
const userController = require('../controllers/userController'); // Import the userController

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        const newUser = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        // Handle specific errors (e.g., unique constraint violation)
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Email or username already exists' });
        } else {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }
});




// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err });
    }
});

module.exports = router;
