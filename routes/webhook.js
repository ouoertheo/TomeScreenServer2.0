var express = require('express');
var router = express.Router();
var habiticaController = require('../controllers/habitica-controller');
const { route } = require('./activity');

// Handle the 
router.post('/habiticaTask', habiticaController.habiticaTask);

module.exports = router;