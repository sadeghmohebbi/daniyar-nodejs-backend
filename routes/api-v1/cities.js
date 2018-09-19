const router = require('express').Router();
const auth = require('../middlewares/auth');
const permit = require('../middlewares/permission');
const citiesController = require('../../controllers/v1/cities');

router.get('/', citiesController.get_cities);

router.get('/:id', citiesController.get_city_by_id);

router.post('/', auth.required, permit('admin'), citiesController.validate_city, citiesController.create_new_city);

module.exports = router;