const router = require('express').Router();
const auth = require('../middlewares/auth');
const permit = require('../middlewares/permission');
const universitiesController = require('../../controllers/universities');

router.get('/', auth.optional, universitiesController.get_universities);

router.get('/:id', auth.optional, universitiesController.get_university_by_id);

router.post('/', universitiesController.check_items, auth.required, permit("admin"), universitiesController.create_new_university);

//TODO: put and post routers

module.exports = router;

