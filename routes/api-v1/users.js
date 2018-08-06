const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = require('../../models/User');
const { check } = require('express-validator/check');
const validatorMessage = require('../../utils/validator-message-util');

//POST new user route (optional, everyone has access)
router.post('/', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], validatorMessage, auth.optional, (req, res, next) => {
    const { body: { user } } = req;
    
    const user_object = new User(user);

    user_object.setPassword(user.password);

    return user_object.save().then(() => res.json({ data: user_object.toAuthJSON() }));
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