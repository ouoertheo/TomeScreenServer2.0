var express = require('express');
var router = express.Router();
var userController = require('../controllers/user-controller');

/* GET users listing. */
router.get('/', userController.listUsers);
router.get('/:name', userController.getUser);
router.post('/', userController.createUser);
router.post('/clearDaily',clearUserDailyConfigs)
router.patch('/:name', userController.updateUser);
router.delete('/:name', userController.deleteUser);


module.exports = router;
