const _ = require('lodash');
const moment = require('moment');
const passport = require('passport');
const User = require('../models/User');
const { check } = require('express-validator/check');

exports.check_items = [
    check('user.email').isEmail(),
    check('user.password').isLength({ min: 6 })
];

exports.register_new_user = (req, res, next) => {
    const { body: { user } } = req;

    return User.findOne({"email": user.email}).exec((err, found_user) => {
        if (err) {
            return next(err);
        } else {
            if (found_user) {
                return res.status(409).json({errors: [{'email': 'alrealy exist'}]});
            } else {
                var user_object = new User(user);

                user_object.setPassword(user.password);

                user_object.save((err) => {
                    if (err) {
                        return res.status(400).send(err);
                    } else {
                        return res.json({ user: user_object.toAuthJSON() });
                    }
                });
            }
        }
    });
}

exports.login = (req, res, next) => {
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
}

exports.get_current_user_detail = (req, res, next) => {
    const { sub: { id } } = req;

    return User.findById(id).then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }

        return res.json({ user });
    });
}

exports.renew_token = (req, res, next) => {
    const { sub: { id } } = req;
    
    return User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).send(err);
        }
        
        return res.json({ access_token: user.generateJWT() });
    });
}

exports.update_user = (req, res, next) => {
    const { sub: { id } } = req;

    var user_finder = { _id: id, is_active: true, is_hidden: false };
    return User.countDocuments(user_finder, (err, count) => {
        if (err) {
            return res.status(400).send(err || 'user not found');
        } else {
            if (Object.keys(_.pickBy(req.body, _.identity)).length > 0) {
                return User.findOneAndUpdate(user_finder, _.assign(_.omit(_.pickBy(req.body, _.identity), ['_id']), {updated_at: moment().unix()}), (err, user) => {
                    if (err || !user) {
                        return res.status(400).send(err || "user not found");
                    } else {
                        return res.json({ result: 'ok'});
                    }
                });
            } else {
                return res.sendStatus(204);
            }
        }
    });
}