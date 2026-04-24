const User = require("../../models/User/user.model");
const crypto = require('crypto');
const { generateToken } = require("../../utils/JWT/generate.jwt.token");

exports.VerifyUserEmailController = async(request, response) =>{
    try {
        const {otp, email} = request.body;

        if(!otp || !email){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'data',
                        message: 'OTP or Email is required'
                    }
                ],
                message:''
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return response.status(400).json({
                statusCode: 404,
                success: false,
                error:[
                    {
                        field: 'email',
                        message:'User with provided email does not exist'
                    }
                ],
                message: ''
            })
        }

        const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

        if(user.verificationToken !== hashedOTP || user.verificationTokenExpiry < Date.now()){

            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'otp',
                        message: 'Invalid or Expired OTP'
                    }
                ],
                message:'Invalid or Expired OTP'
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save();

        generateToken(response, user, 200, 'Email Verified Successfully');

    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: error?.field || 'server',
                    message:error?.message || 'Internal Server Error'
                }
            ],
            message:''
        })
    }
}