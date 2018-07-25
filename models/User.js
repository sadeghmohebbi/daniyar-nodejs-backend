const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;
const saltRounds = 10;
const jwtOptions = { "expiresIn": '2h' };

const UserSchema = new Schema({
    email: String,
    hash: String,
    salt: String,
});

UserSchema.methods.setPassword = function(password) {
    this.salt = bcrypt.genSaltSync(saltRounds);
    this.hash = bcrypt.hashSync(password, salt);
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

UserSchema.methods.generateJWT = function() {
    return jwt.sign({
        email: this.email,
        id: this._id,
    }, 'secret', jwtOptions);
}

UserSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model('User', UserSchema);