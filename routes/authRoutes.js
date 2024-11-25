const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Sequelize User model

const router = express.Router();

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

        // Store user data in session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Get Current User Route
router.get('/get-user', (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json(req.session.user);
    }
    res.status(401).json({ error: 'Not authenticated' });
});

module.exports = router;
