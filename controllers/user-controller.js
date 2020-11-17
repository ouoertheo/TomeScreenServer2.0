var user = require('../models/user');


// Create a user
exports.createUser = async (req, res) => {
    try {
        _user = await user.create(req.body);
        res.status(201).send(_user)
    } catch(error) {
        res.status(500).send(error.message)
    }
}

// Get User
exports.getUser = (req,res) => {
    user.findOne({name: req.params.name}).then(doc => {
        if (doc){
            res.status(200).send(doc)
        } else {
            res.status(404).send("User not found")
        }
    }).catch(err => {
        res.status(500).send("Error retrieving: " + err.message)
    })
}

// List Users
exports.listUsers = async (req, res) => {
    try {
        var users = await user.find();
        if (users){
            res.status(200).send(users);
        } else {
            res.status(404).send("No users found");
        }
    } catch(err) {
        res.status(500).send(err.message);
    }
}

// Update User
exports.updateUser = (req, res) => {
    console.log(req.params.name)
    user.findOneAndUpdate({name: req.params.name}, req.body,{new: true}).then(doc => {
        console.info("Updated user: " + req.params.name)
        console.debug(doc)
        res.status(200).send(doc)
    }).catch(err => {
        res.status(500).send(err.message)
    })
}

// Delete User
exports.deleteUser = (req,res) => {
    user.findOneAndDelete({name: req.params.name}).then(doc => {
        console.debug(doc)
        res.status(204).send(doc)
    }).catch(err => {
        res.status(500).send(err.message)
    })
}

// Reset User's daily info 
exports.clearUserDailyConfigs = async (req,res) => {
    console.info('Wiping daily configs');
    try{
        await user.updateMany({$set: {'break.lastFreeDuration': 0, 'break.lastBreakTime': 0, "break.onBreak": false, bonusLimit:0}});
    } catch(err) {
        res.status(500).send(err.message);
    }
}