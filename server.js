const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/database'); 
const mainRoutes = require('./routes/mainRoutes');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
    session({
        secret: process.env.SESSION_SECRET, 
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
);

// Middleware
app.use(bodyParser.json());

// Define routes
app.use('/auth', authRoutes); 
app.use('/', mainRoutes);

// Route for index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/profile.html', (req, res) => {
    // Optional: Check if user is logged in
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Example route to test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()'); 
        res.json({ message: 'Database connection successful', time: result.rows[0] });
    } catch (err) {
        console.error('Database query error', err);
        res.status(500).json({ message: 'Database connection error', error: err.message });
    }
});

app.get('/auth/get-user', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const user = await User.findByPk(req.session.user.id);
        if (user) {
            res.json({
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                joinedDate: user.createdAt,
            });
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Error fetching user');
    }
});

app.delete('/auth/delete-account', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }
    User.destroy({ where: { id: req.session.user.id } })
        .then(() => {
            req.session.destroy();
            res.sendStatus(200);
        })
        .catch(err => res.status(500).send('Error deleting account'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
