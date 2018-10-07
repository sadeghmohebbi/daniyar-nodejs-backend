const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tradeItemSchema = new Schema({
    user_id: { type: Schema.ObjectId, required: true },
    type: { type: String, enum: [
        "request",
        "sale",
        "free"
    ]},
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    is_hidden: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true }
});

var TradeItem = mongoose.model('TradeItem', tradeItemSchema);
module.exports = { TradeItem };