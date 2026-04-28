const redisClient = require("../../config/redis");
const { GetAccessToken } = require("../../utils/JWT/get.token");


exports.LogoutUserController = async(request, response) =>{
    try{

        const userId = request.user?._id;

        const token = GetAccessToken(request);

        if(token){

            response.clearCookie("accessToken", { path: "/" });

            // remove user from redis cache
            const redisKey = `user:${userId}`;
            await redisClient.del(redisKey);

            response.status(200).json({
                statusCode: 200,
                success: true,
                error: [],
                message: "User Logged Out Successfully",
                data: ''
            })

        }else{
            response.status(400).json({
                statusCode: 401,
                success: false,
                error:[
                    {
                        field: "popup",
                        message: "User already Logged Out"
                    }
                ],
                message: ''
            })
        }

    }catch(error){
        response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: error?.message || "Logout Failed."
                }
            ],
            message: ''
        })
    }
}