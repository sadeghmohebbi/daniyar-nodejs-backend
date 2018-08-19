const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var universitySchema = new Schema({
    name: { type: String, required: true },
    name_en: { type: String, required: true },
    website: { type: String, required: true },
    majors: [{ type: Schema.ObjectId, ref: 'Major' }],
    fields: [{ type: Schema.ObjectId, ref: 'Field' }],
    city: { type: Schema.ObjectId, ref: 'City' },
    address: { type: String, required: true },
    postal_code: { type: String, required: true },
    cover_image_url: String,
    logo_image_url: String,
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: false},
    created_at: { type: Number, default: moment().unix() },
    updated_at: { type: Number, default: moment().unix() }
});

module.exports = mongoose.model('University', universitySchema);