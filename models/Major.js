const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var majorSchema = new Schema({
    name: { type: String, required: true },
    name_en: { type: String, required: true },
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: false},
    created_at: { type: Number, default: moment().unix() },
    updated_at: { type: Number, default: moment().unix() }
});

var Major = mongoose.model('Major', majorSchema);
module.exports = { Major };