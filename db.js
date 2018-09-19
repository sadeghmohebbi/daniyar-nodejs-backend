var mongoose = require('mongoose').set('debug', true);
var Promise = require('promise');
var timestamps = require('mongoose-timestamp');

//global plugins
mongoose.plugin(timestamps,  {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


const TAG = "[db]"

//for using models in project it should be defined before server start
function defineModels() {
    require('./models/User');
    require('./models/City');
    require('./models/Content');
    require('./models/Field');
    require('./models/Major');
    require('./models/University');
    return true;
}

function start() {
    return new Promise((resolve, reject) => {
        // var mongoDB = process.env.MONGOLAB_URL || 'mongodb://localhost:27017/serat_db_1';
        var mongoDB = 'mongodb://sadeghmohebbi:Sadegh2221689@ds145412.mlab.com:45412/prototype_sadeghdev';
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