const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/universities', require('./universities'));
router.use('/cities', require('./cities'));
router.use('/fields', require('./fields'));

module.exports = router;