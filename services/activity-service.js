const activity = require('../models/activity');

exports.aggregateTotalBetween = async function(name, start, end) {
    try {
        var match = {user: name, timestamp: {'$gte':start, '$lte':end}};
        var group = {_id: '$user', total: {$sum: '$usage'}};
        var pipeline = [{$match: match}, {$group: group}];

        var doc = await activity.aggregate(pipeline);
        return {total: doc[0]['total']};
    } catch(err) {
        throw(err);
    }
}
exports.getAllActivityBetween = async function(name, start, end) {
    try {
        userActivity = await activity.find({user: name, timestamp: {'$gte':start, '$lte':end}});
        return userActivity;
    } catch(err) {
        throw(err);
    }
}