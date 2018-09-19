const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var universitySchema = new Schema({
    name: { type: String, required: true },
    website: { type: String, required: true },
    majors: [{ type: Schema.ObjectId, ref: 'Major' }],
    fields: [{ type: Schema.ObjectId, ref: 'Field' }],
    city: { type: Schema.ObjectId, ref: 'City' },
    address: { type: String, required: true },
    postal_code: { type: String, required: true },
    logo_image_url: { type: String, required: true },
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: false}
});

var University = mongoose.model('University', universitySchema);
module.exports = { University }