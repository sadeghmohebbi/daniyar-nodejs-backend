const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/universities', require('./universities'));

module.exports = router;