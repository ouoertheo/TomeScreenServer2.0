const user = require('../models/user');

exports.habiticaTask = async (req,res) => {
    res.status(200).send("Hooked!");

    let reqHabiticaId = req.body.task.userId;
    let taskType = req.body.task.type;
    let taskName = req.body.task.text;
    let notes = req.body.task.notes;

    timeValue = parseInt(notes.match("^[0-9]*"));
    timeType = notes.match("[a-z]")[0];

    if (taskType === "reward" && taskName == "add screen time"){
        try{
            switch(timeType) {
                case "m":
                    timeValue = timeValue * 60 * 1000;
                    break;
                case "h":
                    timeValue = timeValue * 60 * 60 * 1000;
                    break;
                default:
                    throw("Invalid time parameter specified in notes field")
            }
        } catch(err) {
            throw("Invalid time parameter specified in notes field. " + err)
        }
        try {
            thisUser = await user.findOne({habiticaId: reqHabiticaId});
            thisUser.bonusLimit = thisUser.bonusLimit + timeValue;
            await thisUser.save();
            console.debug(thisUser.bonusLimit)
        } catch(err) {
            throw("Update user failed")
        }
    } else {
        throw("Habitica Task Unhandled")
    }
    // TODO: Break the logic for this out into a service
}