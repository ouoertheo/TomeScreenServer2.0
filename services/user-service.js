var user = require('../models/user');

exports.isOverLimit = (user, total) => {}

exports.isOnBreak = (user, total) => {
    if (usedTime === 0 && thisUser.break.lastBreakTime == 0){
        if (playTimeInCycle > thisUser.break.freeDuration){
            console.debug("-------Initial Break Time---------")
            thisUser.break.lastBreakTime = Date.now()
            onBreak = true 
        }

    // Start free time. Handle returning from break. Currently on break.
    } else if (Date.now() >= nextFreeTime && onBreak === true){
        console.debug("-------Start Free Time---------")
        thisUser.break.lastFreeDuration = usedTime
        onBreak = false

    // Start break. Handle going on break after initial break. Currently on free time.
    } else if (usedTime >= nextBreak && onBreak === false){
        console.debug("-------Start Break Time---------")
        thisUser.break.lastBreakTime = Date.now()
        onBreak = true
    }
}

