const router = require('express').Router();
const auth = require('../auth');
const permit = require('../permission');
const { check } = require('express-validator/check');
const messageValidator = require('../../utils/validator-message-util');
const University = require('../../models/University');
const moment = require('moment');

const check_items = [
    check('name').isString(),
    check('name_en').isString(),
    check('website').isURL(),
    check('majors').isArray().isLength({ min: 1}),
    check('fields').isArray().isLength({ min: 1}),
    check('city').isMongoId(),
    check('address').isString(),
    check('postal_code').isString()
];

const pick_items = [
    ['name', 'name_en', 'website', 'majors', 'fields', 'city', 'address', 'postal_code', 'cover_image_url', 'logo_image_url']
];

router.get('/', auth.optional, (req, res) => {
    University.find(_.assign(_.mapValues(_.pickBy(req.query, _.identity), (key, value) => {
        return _.includes(['name', 'name_en', 'address', 'postal_code', 'website'], key) ? new RegExp(value) : value;
    }), {is_active: true, is_hidden: false})).exec((err, universities) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({ universities });
    });
});

router.get('/:id', auth.optional, (req, res) => {
    const { params: { id } } = req;
    University.findById(id).exec((err, university) => {
        if (err || !university) {
            return res.status(400).send(err);
        }

        return res.json({ university });
    });
});

router.post('/', check_items, messageValidator, auth.required, permit("admin"), (req, res) => {
    University.create(req.body, (err, university) => {
        res.status(201).json({ university });
    });
});

//TODO: put and post routers

module.exports = router;

