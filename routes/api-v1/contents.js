//    Copyright 2018 Sadegh Mohebbi
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//        http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

const router = require('express').Router();
const auth = require('../middlewares/auth');
const permit = require('../middlewares/permission');
const contentController = require('../../controllers/v1/contents');

router.get('/', auth.optional, contentController.get_contents);

router.get('/types', auth.optional, contentController.get_content_types);

router.get('/:id', auth.optional, contentController.get_contents_by_id);

router.post('/', contentController.validate_content, auth.required, contentController.create_new_content);


module.exports = router;

