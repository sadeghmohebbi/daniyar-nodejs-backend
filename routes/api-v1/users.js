const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = require('../../models/User');
const { check } = require('express-validator/check');
const messageValidator = require('../../utils/validator-message-util');
const _ = require('lodash');
const moment = require('moment');

router.post('/', [
    check('user.email').isEmail(),
    check('user.password').isLength({ min: 6 })
], messageValidator, auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    return User.findOne({"email": user.email}).exec((err, user) => {
        if (err) {
            return next(err);
        } else {
            if (user) {
                return res.status(409).json({errors: [{'email': 'alrealy exist'}]});
            } else {
                const user_object = new User(user);
            
                user_object.setPassword(user.password);
            
                return user_object.save().then(() => res.json({
                    user: user_object.toAuthJSON() 
                }));
            }
        }
    });
});

//POST login route (optional, everyone has access)
router.post('/login', [
    check('user.email').isEmail(),
    check('user.password').isLength({ min: 6 })
], messageValidator, auth.optional, (req, res, next) => {
    // const { body: { user } } = req;

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return res.status(400).json(info);
    })(req, res, next);
});

//GET me route (required, only authenticated user have access)
router.get('/me', auth.required, (req, res, next) => {
    const { sub: { id } } = req;

    return User.findById(id).then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }

        return res.json({ user });
    });
});

router.get('/token', auth.basic, (req, res, next) => {
    const { sub: { id } } = req;
    
    return User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).send(err);
        }
        
        return res.json({ access_token: user.generateJWT() });
    });
});

router.put('/', auth.required, (req, res, next) => {
    const { sub: { id } } = req;

    var user_finder = { _id: id, is_active: true, is_hidden: false };
    return User.countDocuments(user_finder, (err, count) => {
        if (err) {
            return res.status(400).send(err || 'user not found');
        } else {
            if (Object.keys(_.pickBy(req.body, _.identity)).length > 0) {
                return User.update(user_finder, _.assign(_.omit(_.pickBy(req.body, _.identity), ['_id']), {updated_at: moment().unix()}), (err) => {
                    if (err) {
                        return res.status(400).send(err);
                    } else {
                        return res.json({ result: 'ok'});
                    }
                });
            } else {
                return res.sendStatus(204);
            }
        }
    });
});

//TODO: router.get('/auth/google')

//TODO: router.get('/auth/google/callback')

module.exports = router;