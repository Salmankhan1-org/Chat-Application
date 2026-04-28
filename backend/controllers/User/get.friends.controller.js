const User = require("../../models/User/user.model");

exports.GetFriendsController = async(request, response)=>{
    try {

        const allFriends = await User.find({});

        response.status(200).json({
            statusCode: 200,
            success: true,
            error:[],
            data:allFriends,
            message: 'My Friends'
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