const path = require('path');

// Controller function to render the main page
exports.renderHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
};
