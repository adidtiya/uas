const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Route to handle the home page
router.get('/', mainController.renderHomePage);

module.exports = router;
