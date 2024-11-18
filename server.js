const express = require('express');
const session = require('express-session');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');
const db = require('./db'); // Import the database connection
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/database'); // Sequelize instance
const cors = require('cors');
require('dotenv').config(); // Load .env file

const app = express();
const PORT = 3000;
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure session middleware (move this above the routes)
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Use the secret from .env
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
);

// Middleware
app.use(bodyParser.json());

// Define routes
app.use('/auth', authRoutes); // Now req.session will work here
app.use('/', mainRoutes);

// Route for index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Example route to test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()'); // Simple query to check connection
        res.json({ message: 'Database connection successful', time: result.rows[0] });
    } catch (err) {
        console.error('Database query error', err);
        res.status(500).json({ message: 'Database connection error', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
