const User = require("../../models/User/user.model");
const { GenerateOTP } = require("../../utils/System/generate.otp");
const { SendEmail } = require("../../utils/System/send.email");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { GenerateOTPTemplate } = require("../../templates/send.email.template");

exports.SendOtpToVerifyEmailToChangePasswordController = async(request, response)=>{
    try {

        const {email} = request.body;

        if(!email.trim()){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'email',
                        message: 'Email is not provided'
                    }
                ],
                message: 'Email is not provided'
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'user',
                        message: 'User not Found'
                    }
                ],
                message: 'User not Found'
            })
        }

        // Generate OTP and send to user's email for verification

        const OTP = GenerateOTP(6);

        user.verificationToken = crypto.createHash("sha256").update(OTP).digest("hex");
        user.verificationTokenExpiry =  Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save();

        // const EmailTemplate = GenerateOTPTemplate(OTP, user.username);

        const EmailTemplate = GenerateOTPTemplate(OTP, user.username)

        await SendEmail({
            to: email,
            subject: 'Verify Email - ChitChat',
            html: EmailTemplate,
            text: `Your OTP for ChitChat email verification is ${OTP}. It is valid for 10 minutes.`
        })

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'OTP has been sent to you email'
        })
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'server',
                    message: error?.message
                }
            ],
            message: error?.message
        })
    }
}


// Verify email before reseting password

exports.VerifyOTPToResetPasswordController = async(request, response)=>{
    try {

        const {otp, email} = request.body;

        if(otp?.length !== 6){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'OTP',
                        message: 'OTP not provided'
                    }
                ],
                message: 'OTP not provided'
            })
        }

        if(!email){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'email',
                        message: 'Email is not provided'
                    }
                ],
                message: 'Email is not provided'
            })
        }


        const user = await User.findOne({email});

        if(!user){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'user',
                        message: 'User not Found'
                    }
                ],
                message: 'User not Found'
            })
        }


        const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

        if(user.verificationToken !== hashedOTP || user.verificationTokenExpiry < Date.now()){
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'OTP',
                        message: 'Invalid or Expired OTP'
                    }
                ],
                message: 'User not Found'
            })
        }

        user.isOTPVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save();

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'OTP Verified Successfully'
        });

        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'server',
                    message: error?.message
                }
            ],
            message: error?.message
        })
    }
}

exports.CreateNewPasswordController = async(request, response)=>{
    try {

        const {newPassword, confirmPassword, email} = request.body;

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'password',
                        message: 'New Password and Confirm Password do not match'
                    }
                ],
                message: 'New Password and Confirm Password do not match'
            })
        }

        const user = await User.findOne({email, isActive:true, isDeleted: false});

        if(!user){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'user',
                        message: 'User not found'
                    }
                ],
                message: 'User not found'
            })
        }

        if(!user.isOTPVerified){
            return response.status(403).json({
                statusCode: 403,
                success: false,
                error:[
                    { 
                        field: 'otp', 
                        message: 'OTP verification required' 
                    }
                ],
                message: 'OTP verification required'
            })
        }


        // Hash new Password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;

        user.isOTPVerified = false;

        await user.save();

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            message: 'Password has been reset successfully. Login again'
        });

        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: 'server',
                    message: error?.message
                }
            ],
            message: error?.message
        })
    }
}