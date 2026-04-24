const express = require('express');
const { LoginValidator } = require('../../validators/User/user.login.validator');
const ValidateRequest = require('../../middlewares/validate.request');
const { LoginUserController } = require('../../controllers/User/user.login.controller');
const SanitizeRequest = require('../../middlewares/sanitize.request.middleware');
const { CreateNewUserController } = require('../../controllers/User/user.create.account.controller');
const { upload } = require('../../middlewares/multer.middleware');
const { CreateNewUserValidator } = require('../../validators/User/create.user.validator');
const { VerifyUserEmailController } = require('../../controllers/User/verify.user.email.controller');
const router = express.Router({});


router.post('/create/new',
    upload.single('profileImage'),
    SanitizeRequest,
    CreateNewUserValidator,
    ValidateRequest,
    CreateNewUserController
)

router.post('/login',
    SanitizeRequest,
    LoginValidator,
    ValidateRequest,
    LoginUserController
)

router.post('/verify/email', 
    SanitizeRequest,
    VerifyUserEmailController
)


module.exports = router;