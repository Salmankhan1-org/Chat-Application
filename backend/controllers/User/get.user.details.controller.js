const User = require("../../models/User/user.model");

exports.GetUserDetailsController = async(request, response)=>{
    try {

        const user = request.user;

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            data:user,
            message: 'User Details'
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