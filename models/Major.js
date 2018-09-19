const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var majorSchema = new Schema({
    name: { type: String, required: true },
    name_en: { type: String, required: true },
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: false}
});

var Major = mongoose.model('Major', majorSchema);
module.exports = { Major };