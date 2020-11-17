let secrets = require('./secrets')
var config = {
    "mongo_password":secrets.mongoPassword,
    "mongo_user":'jamin',
    "mongo_db":'TimeServer'
};

config.mongo_url = `mongodb+srv://${config.mongo_user}:${config.mongo_password}@cluster0.s0yse.mongodb.net/${config.mongo_db}?retryWrites=true&w=majority`

module.exports = config;