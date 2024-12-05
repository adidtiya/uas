const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Sequelize User model
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder tempat file disimpan
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Format nama file
    },
});
const upload = multer({ storage });

// Utility function for error handling
const handleError = (res, err, message = 'Internal server error') => {
    console.error(err);
    res.status(500).json({ error: message, details: err.message });
};

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'Signup successful', userId: newUser.id });
    } catch (err) {
        handleError(res, err);
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

        req.session.user = { id: user.id, username: user.username, email: user.email, profilePhoto: user.profilePhoto };
        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (err) {
        handleError(res, err);
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Get Current User Route
router.get('/get-user', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            profilePhoto: user.profilePhoto,
            joinedDate: user.createdAt,
        });
    } catch (err) {
        handleError(res, err);
    }
});

// Update Profile Route
router.put('/update-profile', upload.single('profilePhoto'), async (req, res) => {
    const { username } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username || user.username;
        if (photoUrl) user.profilePhoto = photoUrl;
        await user.save();

        req.session.user.username = user.username;
        req.session.user.profilePhoto = user.profilePhoto;

        res.json({ message: 'Profile updated successfully', photoUrl });
    } catch (err) {
        handleError(res, err, 'Failed to update profile');
    }
});

// Delete Account Route
router.delete('/delete-account', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const deletedUser = await User.destroy({ where: { id: req.session.user.id } });
        if (deletedUser) {
            req.session.destroy();
            res.status(200).json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        handleError(res, err, 'Failed to delete account');
    }
});

module.exports = router;
