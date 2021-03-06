const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersController = require('../../controllers/v1/users');
const { multerUpload } = require('../../utils/tools');

router.post('/', usersController.validate_user_payload, usersController.register_new_user);

//POST login route (optional, everyone has access)
router.post('/login', usersController.validate_user_payload, usersController.login);

//GET me route (required, only authenticated user have access)
router.get('/me', auth.required, usersController.get_current_user_detail);

router.get('/token', auth.basic, usersController.renew_token);

router.put('/', auth.required, usersController.update_user);

router.put('/avater', auth.required, multerUpload().single("avatar"), usersController.save_avatar);

router.delete('/avatar', auth.required, usersController.validate_delete_avatar, usersController.delete_avatar);

//TODO: router.get('/auth/google')

//TODO: router.get('/auth/google/callback')

module.exports = router;