const mongoose = require('mongoose');
const Schema = mongoose.Schema

const activitySchema = new Schema({
    user: String,
    device: String,
    timestamp: Date,
    activity: String,
    usage: Number
})

activitySchema.statics.aggregateTotalBetween = async function(name, start, end) {
    try {
        var match = {user: name, timestamp: {'$gte':start, '$lte':end}};
        var group = {_id: '$user', total: {$sum: '$usage'}};
        var pipeline = [{$match: match}, {$group: group}];

        var doc = await this.aggregate(pipeline);
        return {total: doc[0]['total']};
    } catch(err) {
        throw(err);
    }
}

module.exports = mongoose.model('activity', activitySchema)