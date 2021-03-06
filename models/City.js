const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
    name: { type: String, required: true },
    name_en: { type: String, required: true },
    province: { type: String, required: true },
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: true}
});

var City = mongoose.model('City', citySchema);
module.exports = { City }