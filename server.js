require('dotenv').config();

const express = require('express');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');
const db = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', mainRoutes);

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
