const { University } = require('../../models/University');
const _ = require('lodash');
const tools = require('../../utils/tools');
const validateMessage = require('../../utils/validator-message');

const pick_items = ['name', 'website', 'majors', 'city', 'address', 'postal_code', 'logo_image_url'];

exports.validate_university = (req, res, next) => {
    req.checkBody('name', 'name is not string').isString();
    req.checkBody('website', 'website is not url').isURL();
    req.checkBody('majors', 'majors is not valid array').isArray().isLength({ min: 1});
    req.checkBody('city', 'city is not valid mongo id').isMongoId();
    req.checkBody('address', 'address is not string').isString();
    req.checkBody('postal_code', 'postal_code is not string').isString();
    req.checkBody('logo_image_url', 'logo_image_url is not string').isString();
    return validateMessage(req, res, next);
}

exports.get_universities = (req, res, next) => {
    return University.find(_.assign(_.mapValues(_.pickBy(req.query, _.identity), (key, value) => {
        return _.includes(['name', 'address', 'postal_code', 'website'], key) ? new RegExp(value) : value;
    }), {is_active: true, is_hidden: false})).select('-created_at -updated_at -is_active -is_hidden').exec((err, universities) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({universities: tools.paginate(universities, req.query.limit, req.query.page), count: universities.length});
    });
}

exports.get_university_by_id = (req, res, next) => {
    const { params: { id } } = req;
    return University.findById(id).exec((err, university) => {
        if (err) {
            return res.status(400).send(err);
        } else if (!university) {
            return res.sendStatus(404);
        }

        return res.json({ university });
    });
}

exports.create_new_university = (req, res) => {
    return University.create(_.pick(_.pickBy(req.body, _.identity), pick_items), (err, university) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(201).json({ university });
    });
}