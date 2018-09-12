const jwt = require('express-jwt');
const CryptoJS = require("crypto-js");
const config = require('../../config');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }
    return null;
};

const basicAuth = (req, res, next) => {
    const { headers: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Basic') {
        const user_basic = CryptoJS.AES.decrypt(authorization.split(' ')[1], config.secret).toString(CryptoJS.enc.Utf8);
        if (user_basic) {
            req.sub = {
                id: user_basic.split(':')[0],
                email: user_basic.split(':')[1]
            }
            return next();
        } else {
            return res.sendStatus(401);
        }
    } else {
        return res.sendStatus(401);
    }
}

const auth = {
    required: jwt({
        secret: config.secret,
        userProperty: 'sub',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: config.secret,
        userProperty: 'sub',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
    basic: basicAuth
};

module.exports = auth;