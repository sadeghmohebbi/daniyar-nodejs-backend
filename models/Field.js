const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldSchema = new Schema({
    name: { type: String, required: true },
    name_en: { type: String, required: true },
    major: { type: Schema.ObjectId, ref: 'Major' },
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: true}
});

var Field = mongoose.model('Field', fieldSchema);
module.exports = { Field };