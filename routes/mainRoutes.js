const express = require('express');
const router = express.Router();
const mainController = require('../public/js/controllers/mainController');
const isAuthenticated = require('../Middleware/isAuthenticated'); // Import middleware

// Example of session or token-based user fetching
router.get('/get-user', (req, res) => {
    // Assuming user info is stored in session
    if (req.session && req.session.user) {
        return res.json({ username: req.session.user.username });
    }

    // Handle unauthenticated case
    res.status(401).json({ error: 'User not logged in' });
});

// Protect the route with isAuthenticated middleware
router.get('/protected-route', isAuthenticated, (req, res) => {
    res.json({ message: 'You have access to this protected route' });
});

router.get('/', mainController.renderHomePage);

module.exports = router;
