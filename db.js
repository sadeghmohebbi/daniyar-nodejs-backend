var mongoose = require('mongoose').set('debug', true);
var Promise = require('promise');

function difineModels() {
    var definedModels = new Object();
    definedModels.User = require('./models/User');
    return definedModels;
}

function start() {
    return new Promise(function(resolve, reject) {
        var mongoDB = 'mongodb://127.0.0.1:27017/serat_db_1';
        mongoose.Promise = Promise;
        var options = {
            useMongoClient: true,
            autoIndex: true
        };
        mongoose.connect(mongoDB, options, function (error) {
            if (error) {
                console.log(error);
                resolve(null);
            } else {
                resolve(difineModels());
            }
        });
    });
}

exports.start = start;