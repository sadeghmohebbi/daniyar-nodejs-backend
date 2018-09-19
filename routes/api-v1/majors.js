const router = require('express').Router();
const auth = require('../middlewares/auth');
const permit = require('../middlewares/permission');
const majorsController = require('../../controllers/v1/majors');

router.get('/', majorsController.get_majors);

router.get('/:id', majorsController.get_major_by_id);

router.post('/', auth.required, permit('admin'), majorsController.validate_major, majorsController.create_new_major);

module.exports = router;