var userController = require('./user-controller')
var user = require('../models/user');

exports.admin = async (req,res) => {
    users = await user.find()
    res.render('admin', { title: 'Admin Console', data: users });
    // res.send("hi")
}