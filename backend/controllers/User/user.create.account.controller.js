const User = require("../../models/User/user.model");
const UploadOnCloudinary = require("../../utils/Cloudinary/upload.on.cloudinary");

const { generateToken } = require("../../utils/JWT/generate.jwt.token");
const bcrypt = require('bcryptjs');
const { GenerateOTP } = require("../../utils/System/generate.otp");
const crypto = require('crypto');
const { GenerateOTPTemplate } = require("../../templates/send.email.template");
const { SendEmail } = require("../../utils/System/send.email");

exports.CreateNewUserController = async(request, response)=>{
    try {

        const {email, password, username, bio} = request.body;

        const isAlreadyExist = await User.findOne({$or: [{email}, {username}]});

        if(isAlreadyExist){
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error:[
                    {
                        field: isAlreadyExist.email === email ? 'email' : 'username',
                        message: isAlreadyExist.email === email ? 'Email is already in use' : 'Username is already taken'
                    }
                ],
                message:''
            })
        }

        let profileImageData = null;

        if(request?.file){
            const {path, originalname, mimetype } = request.file;
            const cloudinaryResponse = await UploadOnCloudinary(path, originalname, mimetype);

            if(cloudinaryResponse.success){
                profileImageData = cloudinaryResponse.media;
            }
        }

        const imageData = profileImageData ? {
            publicId:profileImageData?.publicId,
            url: profileImageData?.url,
            resourceType: profileImageData?.resourceType,
            originalName: profileImageData?.originalName,
            mimetype: profileImageData?.mimetype
        } : null;

        // Hash your password
        const HashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            email,
            username,
            password: HashedPassword,
            bio,
            profileImage: imageData,
            isVerified: false
        })

        // Generate OTP and send to user's email for verification

        const OTP = GenerateOTP(6); // 6 digits

        // save hashed OTP and expiry time

        newUser.verificationToken = crypto.createHash("sha256").update(OTP).digest("hex");
        newUser.verificationTokenExpiry =  Date.now() + 10 * 60 * 1000; // 10 mins

        await newUser.save();

        const EmailTemplate = GenerateOTPTemplate(OTP, newUser.username);

        await SendEmail({
            to: email,
            subject: 'Verify Email - ChitChat',
            html: EmailTemplate,
            text: `Your OTP for ChitChat email verification is ${OTP}. It is valid for 10 minutes.`
        })


        response.status(201).json({
            statusCode: 201,
            success: true,
            error:[],
            message: 'Account Create and OTP sent to email successfully'
        });

        
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