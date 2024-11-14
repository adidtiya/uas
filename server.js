const express = require('express');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');

const app = express();
const PORT = 3000;

// Serve static files (CSS, JS, Images) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Use the main routes
app.use('/', mainRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
