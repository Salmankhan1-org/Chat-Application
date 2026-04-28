const express = require('express');
const { LoginValidator } = require('../../validators/User/user.login.validator');
const ValidateRequest = require('../../middlewares/validate.request');
const { LoginUserController } = require('../../controllers/User/user.login.controller');
const SanitizeRequest = require('../../middlewares/sanitize.request.middleware');
const { CreateNewUserController } = require('../../controllers/User/user.create.account.controller');
const { upload } = require('../../middlewares/multer.middleware');
const { CreateNewUserValidator } = require('../../validators/User/create.user.validator');
const { VerifyUserEmailController } = require('../../controllers/User/verify.user.email.controller');
const { SendOtpToVerifyEmailToChangePasswordController, VerifyOTPToResetPasswordController, CreateNewPasswordController } = require('../../controllers/User/reset.password.controller');
const { VerifyOTPValidator } = require('../../validators/User/verify.otp.validator');
const { ResetPasswordValidator } = require('../../validators/User/reset.password.validator');
const { GetUserDetailsController } = require('../../controllers/User/get.user.details.controller');
const { GetFriendsController } = require('../../controllers/User/get.friends.controller');
const { IsAuthenticated } = require('../../middlewares/auth.middleware');
const { LogoutUserController } = require('../../controllers/User/logout');
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

router.get('/logout',
    SanitizeRequest,
    IsAuthenticated,
    LogoutUserController
)
router.post('/verify/email', 
    SanitizeRequest,
    VerifyUserEmailController
)


router.post('/forgot-password/send-otp',
    SanitizeRequest,
    SendOtpToVerifyEmailToChangePasswordController
)


router.post('/forgot-password/verify-otp',
    SanitizeRequest,
    VerifyOTPValidator,
    ValidateRequest,
    VerifyOTPToResetPasswordController
)

router.post('/forgot-password/reset-password',
    SanitizeRequest,
    ResetPasswordValidator,
    ValidateRequest,
    CreateNewPasswordController
)


router.get('/me',
    SanitizeRequest,
    IsAuthenticated,
    GetUserDetailsController
)

router.get('/friends',
    SanitizeRequest,
    GetFriendsController
)

module.exports = router;