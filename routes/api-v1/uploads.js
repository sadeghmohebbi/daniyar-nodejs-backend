const router = require('express').Router();
const auth = require('../middlewares/auth');
const permit = require('../middlewares/permission');
const { multerUpload } = require('../../utils/tools');
const uploadsController = require('../../controllers/v1/uploads');

router.post('/image', auth.required, permit('admin'), multerUpload().single('image'), uploadsController.upload_controller);

module.exports = router;