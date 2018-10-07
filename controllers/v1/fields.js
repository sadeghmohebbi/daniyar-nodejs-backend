const { Field } = require('../../models/Field');
const _ = require('lodash');
const tools = require('../../utils/tools');
const validateMessage = require('../../utils/validator-message');

const pick_items = ["name", "name_en"];

exports.validate_field = (req, res, next) => {
    req.checkBody('name', 'name is not string').isString();
    req.checkBody('name_en', 'name_en is not string').isString();
    req.checkBody('major', 'name_en is not mongo id').isMongoId();
    return validateMessage(req, res, next);
}

exports.get_fields = (req, res, next) => {
    return Field.find(_.assign(_.mapValues(_.pickBy(req.query, _.identity), (key, value) => {
        return _.includes(['name', 'name_en'], key) ? new RegExp(value) : value;
    }), {is_active: true, is_hidden: false})).select('-created_at -updated_at -is_active -is_hidden').exec((err, fields) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({fields: tools.paginate(fields, req.query.limit, req.query.page), count: fields.length});
    });
}

exports.get_field_by_id = (req, res, next) => {
    const { params: { id }} = req;
    return Field.findById(id).exec((err, field) => {
        if (err || !field) {
            return res.status(400).send(err);
        }

        return res.json({ field });
    });
}

exports.create_new_field = (req, res, next) => {
    return Field.create(_.pick(_.pickBy(req.body, _.identity), pick_items), (err, field) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({ field })
    });
}