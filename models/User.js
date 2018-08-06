const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const jwtOptions = { "expiresIn": '2h' };

var userSchema = new Schema({
    email: String,
    hash: String,
    salt: String,
});

userSchema.methods.setPassword = function(password) {
    this.salt = bcrypt.genSaltSync(saltRounds);
    this.hash = bcrypt.hashSync(password, salt);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

userSchema.methods.generateJWT = function() {
    return jwt.sign({
        email: this.email,
        id: this._id,
    }, 'secret', jwtOptions);
}

userSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model('User', userSchema);