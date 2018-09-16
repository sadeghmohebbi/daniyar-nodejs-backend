const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersController = require('../../controllers/users');

router.post('/', usersController.check_items, usersController.register_new_user);

//POST login route (optional, everyone has access)
router.post('/login', usersController.check_items, usersController.login);

//GET me route (required, only authenticated user have access)
router.get('/me', auth.required, usersController.get_current_user_detail);

router.get('/token', auth.basic, usersController.renew_token);

router.put('/', auth.required, usersController.update_user);

//TODO: router.get('/auth/google')

//TODO: router.get('/auth/google/callback')

module.exports = router;