const express = require('express');
const router = express.Router();

router.use('/v1', require('./api-v1'));

//default version of api
router.use('/', require('./api-v1'));

module.exports = router;