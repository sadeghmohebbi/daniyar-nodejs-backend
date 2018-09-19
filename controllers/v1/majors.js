const { Major } = require('../../models/Major');
const _ = require('lodash');
const tools = require('../../utils/tools');
const validateMessage = require('../../utils/validator-message');

const pick_items = ["name", "name_en"];

exports.validate_major = (req, res, next) => {
    req.checkBody('name', 'name is not string').isString();
    req.checkBody('name_en', 'name_en is not string').isString();
    validateMessage(req, res, next);
}

exports.get_majors = (req, res, next) => {
    return Major.find(_.assign(_.mapValues(_.pickBy(req.query, _.identity), (key, value) => {
        return _.includes(['name', 'name_en'], key) ? new RegExp(value) : value;
    }), {is_active: true, is_hidden: false})).select('-created_at -updated_at -is_active -is_hidden').exec((err, majors) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({majors: tools.paginate(majors, req.query.limit, req.query.page), count: majors.length});
    });
}

exports.get_major_by_id = (req, res, next) => {
    const {params: { id }} = req;
    return Major.findById(id).exec((err, major) => {
        if (err || !major) {
            return res.status(400).send(err || "major not found");
        }

        return res.json({ major });
    });
}

exports.create_new_major = (req, res, next) => {
    return Major.create(_.pick(_.pickBy(req.body, _.identity), pick_items), (err, major) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({ major });
    });
}