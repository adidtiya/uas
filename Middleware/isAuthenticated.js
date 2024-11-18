module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    }
    res.status(401).json({ error: 'Unauthorized access' });
};
