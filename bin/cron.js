var cron = require('node-cron');
var userController = require('../controllers/user-controller')

exports.init = () => {
    cron.schedule('0 21 * * *', function() {
        userController.resetDailyStates().catch((err) => {
            console.error("Failed reset daily states: " + err.message)
        });
    })
};
