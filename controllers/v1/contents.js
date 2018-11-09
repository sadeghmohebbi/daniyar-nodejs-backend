const { Content } = require('../../models/Content');
const _ = require('lodash');
const tools = require('../../utils/tools');
const validateMessage = require('../../utils/validator-message');

const pick_items = ['type', 'featured_image', 'title', 'body', 'attachments', 'images'];

exports.validate_content = (req, res, next) => {
    req.checkBody('type', 'type is not valid').isString().isIn([
        "handwrited-lesson",
        "sample-exam",
        "article",
        "abstracted-lesson",
        "blog-post"
    ]);
    req.checkBody('title', 'title is not string').isString();
    req.checkBody('body', 'body is not string').isString();
    return validateMessage(req, res, next);
}

exports.get_contents = (req, res, next) => {
    const { params: { user_id } } = req;

    var content_finder = {is_active: true, is_hidden: false};
    if (user_id) {
        content_finder["user_id"] = user_id;
    }
    
    return Content.find(_.assign(_.mapValues(_.pickBy(req.query, _.identity), (key, value) => {
        return _.includes(['title', 'body'], key) ? new RegExp(value) : value;
    }), content_finder)).select('-is_active -is_hidden').exec((err, contents) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({contents: tools.paginate(contents, req.query.limit, req.query.page), count: contents.length});
    });
}

exports.get_contents_by_id = (req, res, next) => {
    const { params: { id } } = req;
    return Content.findById(id).exec((err, content) => {
        if (err) {
            return res.status(400).send(err);
        } else if (!content) {
            return res.sendStatus(404);
        }

        return res.json({ content });
    });
}

exports.create_new_content = (req, res, next) => {
    //getting user id from token header
    const { sub: { id } } = req;
    return Content.create(_.chain(req.body).pickBy(_.identity).pick(pick_items).assign({ user_id: id }).value(), (err, content) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.status(201).json({ content });
    });
}

exports.get_content_types = (req, res, next) => {
    //get list of content types as key/value array
    return res.json({
        content_types: [
            {
                key: "handwrited-lesson", 
                value: "جزوه"
            },
            {
                key: "sample-exam",
                value: "نمونه سوال"
            },
            {
                key: "article",
                value: "مقاله"
            },
            {
                key: "abstracted-lesson",
                value: "خلاصه کتاب"
            },
            {
                key: "blog-post",
                value: "مطلب"
            }
        ]
    });
}