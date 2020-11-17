var express = require('express');
var router = express.Router();
var activityController = require('../controllers/activity-controller');

/* GET users listing. */
router.get('/getToday/:name', activityController.getToday);
router.get('/getDate', activityController.getDate);
router.post('/poll', activityController.poll);
router.post('/clearAll', activityController.clearAll);

router.get('/getDateDebug/:name', activityController.getDateDebug);
router.get('/getTodayDebug/:name', activityController.getTodayDebug);

module.exports = router;
