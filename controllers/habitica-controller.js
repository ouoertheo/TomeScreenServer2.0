

exports.habiticaTask = async (req,res) => {
    res.status(200).send("Hooked!")
    let reqHabiticaId = req.body.task.userId
    console.debug(reqHabiticaId)
    let taskType = req.body.task.type
    let taskName = req.body.task.text
    if (taskType === "reward" && taskName == "1 hour of screen time"){
        console.log("Increasing bonus time ")

        user.findOne({habiticaId: reqHabiticaId}).then(doc => {
            console.debug("Retrieved user: " + doc.name)
            console.debug(doc)

            doc.bonusLimit = doc.bonusLimit + 3600000
    
            doc.save().then(doc => {
                console.debug("Updated user: " + doc.name)
                console.debug(doc)
                //res.status(201).send(doc)
            }).catch(err => {
                console.error("Error updating: " + err.message)
                //res.status(500).send("Error updating: " + err.message)
            })
        }).catch(err => {
            console.error("Error updating: " + err.message)
            //res.status(500).send("Error retrieving: " + err.message)
        })
    }
}