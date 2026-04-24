const User = require("../../models/User/user.model");
const { generateToken } = require("../../utils/JWT/generate.jwt.token");
const axios = require('axios');

exports.LoginUserController = async(request, response) =>{
    try {

        const {email, password, captchaToken} = request.body;

        // Verify the captcha token 

        const captchaResponse = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaToken
            }
            }
        );

        if (!captchaResponse.data.success) {
            return response.status(400).json({
                statusCode: 400,
                success:false,
                error:[
                    {
                        field: 'captcha',
                        message: 'Captcha Verification failed'
                    }
                ],
                message: ''
            })
        }

        // find user using email

        const user = await User.findOne({email}).select('+password');

        if(!user){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'user',
                        message: 'Invalid Email or Password'
                    }
                ],
                message:''
            })
        }

        const isCorrectPassword = await user.comparePassword( password, user.password);

        if(!isCorrectPassword){
             return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: 'user',
                        message: 'Invalid Email or Password'
                    }
                ],
                message:''
            })
        }

        // remove the password before sending to user

        user.password = undefined;

        // Both email or password are correct , Generate a JWT Token to start the session

        generateToken(response, user, 200, 'User Logged in Successfully');

        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: true,
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