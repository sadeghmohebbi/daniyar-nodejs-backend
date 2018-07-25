const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');
const { check } = require('express-validator/check');
const validatorMessage = require('../validatorMessageUtil');

//POST new user route (optional, everyone has access)
router.post('/', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], validatorMessage, auth.optional, (req, res, next) => {
    const { body: { user } } = req;
    
    const user = new User(user);

    user.setPassword(user.password);

    return user.save().then(() => res.json({ data: user.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
router.post('/login', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], validatorMessage, auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ data: user.toAuthJSON() });
        }

        return status(400).info;
    })(req, res, next);
});

//GET me route (required, only authenticated user have access)
router.get('/me', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return User.findById(id).then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }

        return res.json({ data: user.toAuthJSON() });
    });
});

module.exports = router;