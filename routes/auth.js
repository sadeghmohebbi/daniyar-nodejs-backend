const jwt = require('express-jwt');
const config = require('../config');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    if(authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }
    return null;
};

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
};

module.exports = auth;