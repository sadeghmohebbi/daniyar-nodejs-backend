const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var fieldSchema = new Schema({
    name: { type: String, required: true },
    name_en: { type: String, required: true },
    field: { type: Schema.ObjectId, ref: 'Field' },
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: false},
    created_at: { type: Number, default: moment().unix() },
    updated_at: { type: Number, default: moment().unix() }
});

module.exports = mongoose.model('Field', fieldSchema);