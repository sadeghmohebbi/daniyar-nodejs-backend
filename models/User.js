const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const moment = require('moment');
const CryptoJS = require("crypto-js");

const saltRounds = 10;
const jwtOptions = { "expiresIn": '5h' };

var userSchema = new Schema({
    email: { type: String, required: true },
    hash: String,
    google_id: String,
    salt: String,
    user_name: String,
    full_name: String,
    student_email: String,
    address: String,
    bio: String,
    mobile_number: String,
    university: { type: Schema.ObjectId, ref: 'University'},
    major: { type: Schema.ObjectId, ref: 'Major' },
    field: { type: Schema.ObjectId, ref: 'Field' },
    city: { type: Schema.ObjectId, ref: 'City' },
    image_urls: [String],
    role: { type: String, default: "user", enum: [
        "user",
        "admin"
    ]},
    is_hidden: { type: Boolean, default: false},
    is_active: { type: Boolean, default: true},
    created_at: { type: Number, default: moment().unix() },
    updated_at: { type: Number, default: moment().unix() }
});

userSchema.methods.setPassword = function(password) {
    this.salt = bcrypt.genSaltSync(saltRounds);
    this.hash = bcrypt.hashSync(password, this.salt);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

userSchema.methods.generateJWT = function() {
    return jwt.sign({
        email: this.email,
        id: this._id,
    }, config.secret, jwtOptions);
}

userSchema.methods.generateAES = function() {
    return CryptoJS.AES.encrypt(this._id+':'+this.email, config.secret).toString();
}

userSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        access_token: this.generateJWT(),
        refresh_token: this.generateAES()
    };
};

userSchema.index({ user_name: 1}, { unique: true });
userSchema.index({ email: 1}, { unique: true });

module.exports = mongoose.model('User', userSchema);