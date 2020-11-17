var activity = require('../models/activity')
var user = require('../models/user')
var async = require('async');

// Accept a poll from a client
exports.poll = (req,res) => {
    console.log("Received request. Submitting to Mongo")
    this_activity = new activity(req.body)
    console.log(this_activity)
    this_activity.save().then(() => {
        //console.log('Logged activity: ')
        // console.log(req.body)
        res.send()
    }).catch(error => {
        console.log(error)
    })
}

exports.getToday = (req,res) => {
    var name = req.params.name
    name = decodeURIComponent(name)
    //
    // Get the user object associated with the current host. 
    //
    findUserQuery = user.findOne({"devices.user" : name})

    //
    // Get all the activities from today for that user
    //
    startOfDay = new Date(new Date().setHours(0,0,0,0))
    endOfDay = new Date(new Date().setHours(23,59,59,999))


    var match = {user: name, timestamp: {'$gte': startOfDay, '$lte':endOfDay}}
    var group = {_id: '$user', used: {$sum: '$usage'}}
    var pipeline2 = [{$match: match}, {$group: group}]

    // Make the call. 
    aggregateQueryNew = activity.aggregate(pipeline2)

    // Wait for user and aggregate total. 
    Promise.all([findUserQuery,aggregateQueryNew]).then(values => {            
        // Get the total used time
        usedTime = values[1][0]['used']

        // Set initial response to client
        responseJson = {
            state: "N/A", 
            total: 0, 
            nextBreak: -1, 
            nextFreeTime: -1,
            breakTimeLeft: -1,
            freeTimeLeft: -1,
            onBreak: false
        }

        //
        // Get the total alotted time. This might not be populeted if the user is not registered,
        // if not, then we change the response logic to simply return how much time is spent, rather than left.
        // Oh yeah, also added break logic here. 
        //

        // User Exists
        if (values[0]){
            thisUser = values[0]

            let totalLimit = thisUser.dailyLimit + thisUser.bonusLimit
            responseJson.total = totalLimit - usedTime
            responseJson.state = "time left"

            console.debug("Device is associated with user, sending time left")
            console.debug("Queried: " + name + " | Response: " + values[0].name + " | Time used\\total: " + usedTime + "\\" + totalLimit)

            //
            // Handle breaks
            //
            if(thisUser.break.freeDuration && thisUser.break.breakDuration){


                onBreak = thisUser.break.onBreak

                // Did the user take a natural break?

                // Set period start/stop from whatever
                playCycle = thisUser.break.lastBreakTime + thisUser.break.breakDuration
                playCycleStart = new Date(new Date().getTime() - (playCycle))
                playCycleEnd = new Date()
                
                var match = {user: name, timestamp: {"$gte": playCycleStart, '$lte': playCycleEnd}}
                var group = {_id: '$user', total: {$sum: '$usage'}}
                var pipeline = [{$match: match}, {$group: group}]
        
                activity.aggregate(pipeline).then( agg => {
                    playTimeInCycle = agg[0].total
                    naturalBreakTimeInCycle = playCycle - playTimeInCycle

                    nextBreak = thisUser.break.lastFreeDuration + thisUser.break.freeDuration
                    nextFreeTime = thisUser.break.lastBreakTime + thisUser.break.breakDuration - naturalBreakTimeInCycle

                    console.debug("playCycle: " + playCycle + " playTimeInCycle: " + playTimeInCycle + " naturalBreakTimeInCycle: " + naturalBreakTimeInCycle)
                
                    // First Break of the day, we expect break.last to be blank from the scheduled job. Ignores value of onBreak
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
                    
                    if (onBreak){
                        responseJson.total = 0
                        console.debug("Time until break is up: " + (nextFreeTime - Date.now()))
                    }
                    
                    // Update response to client
                    responseJson.nextBreak = nextBreak
                    responseJson.nextFreeTime = nextFreeTime
                    responseJson.onBreak = onBreak
                    responseJson.breakTimeLeft = Math.max(nextFreeTime - Date.now(), 0)
                    responseJson.freeTimeLeft = Math.max(nextBreak - usedTime, 0)

                    
                    console.debug("lastFreeDuration: " + thisUser.break.lastFreeDuration + " lastBreakTime: " + thisUser.break.lastBreakTime + " now: " + Date.now())

                    thisUser.break.onBreak = onBreak
                    thisUser.save()

                    console.info(responseJson)
                    res.send(responseJson)
                }).catch((err) => {
                    console.error(err)
                    res.send(err)
                })

            } else {
                console.info("No break configured")

                console.info(responseJson)
                res.send(responseJson)
            }

        // User does not exist
        } else {
            // Or just send current time total
            console.debug("Device is not associated with a user, sending time used")
            responseJson.state = "time used"

            console.info(responseJson)
            res.send(responseJson)
        }

    }).catch(err =>{
        res.send(err)
    })
}

exports.getDate = async (req,res) => {
    var name = req.params.name
    var date = req.query.date
    let total
    console.log(date)
    todayQueryString = '^'+date

    var match = {user: name, timestamp: RegExp(todayQueryString)}
    var group = {_id: '$user', total: {$sum: '$usage'}}
    var pipeline = [{$match: match}, {$group: group}]
    
    console.log(pipeline)
    collection.aggregate(pipeline).toArray().then(results =>{
        total = {total: results[0]['total']}
        console.log(total)
        res.send(total)
    }
    ).catch(err =>{
        res.send(err)
    })
    
}

// Clear all polling data
exports.clearAll = (req,res) => {
    collection.deleteMany({}).then( result =>{
        console.log('Deleted: ' + result.deletedCount + " items.")
        res.send('Deleted: ' + result.deletedCount + " items.")
    }).catch(error => {
        console.log(error)
        res.send(error)
    })
}

// Get poll information for a user on a specific day
// Call should look like /getDate/username?date=Y-mm-dd
exports.getDateDebug = (req,res) => {
    var name = req.params.name
    var date = req.query.date
    let total
    console.log(date)
    todayQueryString = '^'+date

    var query = {user: name, timestamp: RegExp(todayQueryString)}
    //var query = {user: name}
    console.log(query)
    collection.find(query).toArray().then(results =>{
            res.send(results)
        }
    ).catch(err =>{
        res.send(err)
    })
    
}

exports.getTodayDebug = (req,res) => {
    var name = req.params.name
    var today = new Date().toISOString().slice(0, 10)
    todayQueryString = '^'+today
    var query = {user: name, timestamp: RegExp(todayQueryString)}
    //var query = {user: name}
    console.log(query)
    collection.find(query).toArray().then(results =>{
            res.send(results)
        }
    ).catch(err =>{
        res.send(err)
    })
}