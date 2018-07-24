var mongoose = require('mongoose').set('debug', true);
var Promise = require('promise');
var models = require('./models.js');

function difineModels() {
    var definedModels = new Object();
    
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
                resolve(models.difineModels());
            }
        });
    });
}

exports.start = start;