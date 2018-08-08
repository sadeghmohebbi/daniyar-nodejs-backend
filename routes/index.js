const express = require('express');
const router = express.Router();


router.use('/v1', require('./api-v1'));

module.exports = router;