module.exports = (req, res, next) => {
    console.log('Session data:', req.session); // Debug session data
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
};
