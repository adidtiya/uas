const express = require('express');
const router = express.Router();
const mainController = require('../public/js/controllers/mainController');

router.get('/', mainController.renderHomePage);

module.exports = router;
