const express = require('express');
const router = express.Router();
const mainController = require('../public/js/controllers/mainController');
const isAuthenticated = require('../Middleware/isAuthenticated');
const Review = require('../models/review');
const User = require('../models/user');

// Error Handler
const handleError = (res, error, message = 'Internal server error') => {
    console.error(error);
    res.status(500).json({ error: message, details: error.message });
};

// Route untuk mendapatkan data user
router.get('/get-user', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ username: req.session.user.username });
    }
    res.status(401).json({ error: 'User not logged in' });
});

// Route untuk melindungi path dengan middleware isAuthenticated
router.get('/protected-route', isAuthenticated, (req, res) => {
    res.json({ message: 'You have access to this protected route' });
});

// Ambil semua review
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: { model: User, attributes: ['username'] },
            order: [['createdAt', 'DESC']],
        });
        res.json(reviews);
    } catch (error) {
        handleError(res, error, 'Failed to fetch reviews');
    }
});

// Tambahkan review baru
router.post('/reviews', isAuthenticated, async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Review content cannot be empty' });
    }

    try {
        const newReview = await Review.create({
            userId: req.session.user.id, 
            content,
        });
        res.status(201).json(newReview);
    } catch (error) {
        handleError(res, error, 'Failed to create review');
    }
});

// Route untuk halaman utama
router.get('/', mainController.renderHomePage);

module.exports = router;
