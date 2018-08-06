var mongoose = require('mongoose').set('debug', true);
var Promise = require('promise');

const TAG = "[db]"

function defineModels() {
    let models = {};
    models["User"] = require('./models/User');
    return models;
}

function start() {
    return new Promise((resolve, reject) => {
        var mongoDB = 'mongodb://localhost:27017/serat_db_1';
        mongoose.Promise = Promise;
        var options = {
            autoIndex: true,
            useNewUrlParser: true
        };
        mongoose.connect(mongoDB, options, function (error) {
            if (error) {
                console.log(TAG, error);
                reject(error);
            } else {
                console.log(TAG, "models defined and mongoose connected");
                resolve(defineModels());
            }
        });
    });
}

exports.start = start;