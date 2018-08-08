const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = require('../../models/User');
const { check } = require('express-validator/check');
const validatorMessage = require('../../utils/validator-message-util');

/**
 * 
 * @api {psot} /users auth user
 * @apiName authUser
 * @apiGroup User
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Object} user email, password
 * 
 * @apiSuccess (200) {Object} data _id, email, token
 * 
 * @apiParamExample  {Object} Request-Example:
 * {
 *  user: {
 *      email: "mohebbi.sadegh@gmail.com"
 *      password: "123456"
 *  }
 * }
 * 
 * 
 * @apiSuccessExample {Object} Success-Response:
 *  HTTP 200 OK
 *  {
 *      data: {
 *          "_id": "5b69ebd4ae9c84038f318bb4",
 *          "email": "mohebbi.sadegh@gmail.com",
 *          "token": "<TOKEN>"
 *      }
 *  }
 */
router.post('/', [
    check('user.email').isEmail(),
    check('user.password').isLength({ min: 6 })
], validatorMessage, auth.optional, (req, res, next) => {
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
                    data: user_object.toAuthJSON() 
                }));
            }
        }
    });
});

//POST login route (optional, everyone has access)
router.post('/login', [
    check('user.email').isEmail(),
    check('user.password').isLength({ min: 6 })
], validatorMessage, auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ data: user.toAuthJSON() });
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

        return res.json({ data: user.toAuthJSON() });
    });
});

module.exports = router;