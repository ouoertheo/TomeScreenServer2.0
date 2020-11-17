var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin-controller');

router.get('/',adminController.admin);

module.exports = router;