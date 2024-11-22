const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Sequelize User model

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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

// Fetch user data
router.get('/get-user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    res.json(req.session.user);
});

// Update profile
router.put('/update-profile', upload.single('profilePhoto'), (req, res) => {
    console.log('Received username:', req.body.username);
    console.log('Received file:', req.file);

    if (!req.body.username && !req.file) {
        return res.status(400).json({ message: 'No updates provided' });
    }

    // Update username
    if (req.body.username) {
        req.session.user.username = req.body.username;
    }

    // Update photo profile if file is uploaded
    if (req.file) {
        const photoUrl = `/uploads/${req.file.filename}`;
        req.session.user.profilePhoto = photoUrl;
    }

    res.json({
        message: 'Profile updated successfully',
        photoUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
