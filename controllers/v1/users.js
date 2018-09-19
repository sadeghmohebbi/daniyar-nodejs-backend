const _ = require('lodash');
const moment = require('moment');
const passport = require('passport');
const { User } = require('../../models/User');
const del = require('del');
const validateMessage = require('../../utils/validator-message');

exports.validate_user_payload = (req, res, next) => {
    req.checkBody('user.email', 'email is not valid').isEmail();
    req.checkBody('user.password', 'password is not valid').isLength({ min: 6 });
    validateMessage(req, res, next);
}

exports.validate_delete_avatar = (req, res, next) => {
    req.checkQuery('avater_url', 'avatar_url is not string').isString();
    validateMessage(req, res, next);
}

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

exports.save_avater = (req, res, next) => {
    if (req.file) {
        const {sub: { id } } = req;

        return User.findOneAndUpdate({ _id: id, is_active: true, is_hidden: false }, {"$push": '/images/uploads/'+req.file.filename}, (err, user) => {
            if (err || !user) {
                return res.status(400).send(err || "user not found");
            }

            return res.json({ result: 'ok' });
        });
    } else {
        return res.sendStatus(204);
    }
}

exports.delete_avatar = (req, res, next) => {
    const { params: { avatar_url }} = req;

    return del('!public'+avatar_url).then(paths => {
        if (paths && paths.length > 0) {
            return res.json({ result: 'ok' });
        } else {
            return res.sendStatus(204);
        }
    });
}

exports.update_user = (req, res, next) => {
    const { sub: { id } } = req;

    return User.countDocuments(user_finder, (err, count) => {
        if (err) {
            return res.status(400).send(err || 'user not found');
        } else {
            if (Object.keys(_.pickBy(req.body, _.identity)).length > 0) {
                return User.findOneAndUpdate({ _id: id, is_active: true, is_hidden: false }, _.assign(_.omit(_.pickBy(req.body, _.identity), ['_id', 'password', 'email']), {updated_at: moment().unix()}), (err, user) => {
                    if (err || !user) {
                        return res.status(400).send(err || "user not found");
                    }

                    return res.json({ result: 'ok'});
                });
            } else {
                return res.sendStatus(204);
            }
        }
    });
}