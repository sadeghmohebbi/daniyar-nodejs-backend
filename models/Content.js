const mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    body: String,
    attachments: [String],
    images: [String],
    is_hidden: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true }
}, { toJSON: { virtuals: true } });

contentSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

var Content = mongoose.model('Content', contentSchema);
module.exports = { Content };