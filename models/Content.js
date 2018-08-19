const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var contentSchema = new Schema({
    user_id: { type: Schema.ObjectId, required: true },
    type: { type: String, enum: [
        "handwrited-lesson",
        "sample-exam",
        "article",
        "abstracted-lesson",
        "blog-post"
    ]},
    featured_image: String,
    title: String,
    attachments: [String],
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: false},
    created_at: { type: Number, default: moment().unix() },
    updated_at: { type: Number, default: moment().unix() }
});

module.exports = mongoose.model('Content', contentSchema);