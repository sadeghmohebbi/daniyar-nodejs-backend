const router = require('express').Router();
const auth = require('../middlewares/auth');
const permit = require('../middlewares/permission');
const fieldsController = require('../../controllers/v1/fields');

router.get('/', fieldsController.get_fields);

router.get('/:id', fieldsController.get_field_by_id);

router.post('/', auth.required, permit('admin'), fieldsController.validate_field, fieldsController.create_new_field);

module.exports = router;