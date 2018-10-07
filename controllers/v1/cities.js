const { City } = require('../../models/City');
const _ = require('lodash');
const tools = require('../../utils/tools');
const validateMessage = require('../../utils/validator-message');

const pick_items = ['name', 'name_en', 'province'];

exports.validate_city = (req, res, next) => {
    req.checkBody('name', 'name is not string').isString();
    req.checkBody('name_en', 'name_en is not string').isString();
    req.checkBody('province', 'province is not string').isString();
    return validateMessage(req, res, next);
}

exports.get_cities = (req, res, next) => {
    return City.find(_.assign(_.mapValues(_.pickBy(req.query, _.identity), (key, value) => {
        return _.includes(['name', 'province'], key) ? new RegExp(value) : value;
    }), {is_active: true, is_hidden: false})).select('-created_at -updated_at -is_active -is_hidden').exec((err, cities) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.json({ cities:  tools.paginate(cities, req.query.limit, req.query.page), count: cities.length});
    });
}

exports.get_city_by_id = (req, res, next) => {
    const { params: { id } } = req;

    return City.findById(id).exec((err, city) => {
        if (err || !city) {
            return res.status(400).send(err || "city not found");
        }
        return res.json({ city });
    });
}

exports.create_new_city = (req, res, next) => {
    return City.create(_.pick(_.pickBy(req.body, _.identity), pick_items), (err, city) => {
        if (err) {
            return res.status(400).send(err);
        }
        
        return res.json({city});
    });
}