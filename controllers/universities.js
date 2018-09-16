const { University } = require('../models/University');
const _ = require('lodash');

const pick_items = [
    ['name', 'name_en', 'website', 'majors', 'fields', 'city', 'address', 'postal_code', 'cover_image_url', 'logo_image_url']
];

exports.check_items = [
    check('name').isString(),
    check('name_en').isString(),
    check('website').isURL(),
    check('majors').isArray().isLength({ min: 1}),
    check('fields').isArray().isLength({ min: 1}),
    check('city').isMongoId(),
    check('address').isString(),
    check('postal_code').isString()
];

exports.get_universities = (req, res, next) => {
    return University.find(_.assign(_.mapValues(_.pickBy(req.query, _.identity), (key, value) => {
        return _.includes(['name', 'name_en', 'address', 'postal_code', 'website'], key) ? new RegExp(value) : value;
    }), {is_active: true, is_hidden: false})).exec((err, universities) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({ universities });
    });
}

exports.get_university_by_id = (req, res, next) => {
    const { params: { id } } = req;
    return University.findById(id).exec((err, university) => {
        if (err || !university) {
            return res.status(400).send(err);
        }

        return res.json({ university });
    });
}

exports.create_new_university = (req, res) => {
    University.create(_.pickBy(_.pick(req.body, _.identity), pick_items), (err, university) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(201).json({ university });
    });
}

