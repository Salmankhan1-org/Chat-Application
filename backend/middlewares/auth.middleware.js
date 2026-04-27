const jwt = require("jsonwebtoken");
const { GetAccessToken } = require("../utils/JWT/get.token");
const redisClient = require("../config/redis");
const User = require("../models/User/user.model");


exports.IsAuthenticated = 
  async (request, response, next) => {

    try {

        const token = GetAccessToken(request);

  

        if (token) {
            let decodedData;
    
            decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        
            if(decodedData && decodedData.id){
                const redisKey = `user:${decodedData.id}`;
                const cachedUser = await redisClient.get(redisKey);

                if (cachedUser) {
                    request.user = JSON.parse(cachedUser);
                    if(!request?.user?.isActive || request?.user?.isDeleted){
                        return response.status(403).json({
                            statusCode: 403,
                            success: false,
                            error:[
                                {
                                    field: 'popup',
                                    message: 'Your Account is either inactive or suspended. Please contact to ChitChat Team'
                                }
                            ],
                            message: ''
                        })
                    }
                    return next();
                }

                const user = await User.findById(decodedData.id);

                if (user) {
                    await redisClient.set(redisKey, JSON.stringify(user), { EX: 900 });

                    request.user = user;

                    if(!request?.user?.isActive || request?.user?.isDeleted){
                        return response.status(403).json({
                            statusCode: 403,
                            success: false,
                            error:[
                                {
                                    field: 'popup',
                                    message: 'Your Account is either inactive or suspended. Please contact to ChitChat Team'
                                }
                            ],
                            message: ''
                        })
                    }

                    next();
                }else{
                    response.status(401).json({
                        statusCode: 401,
                        success: false,
                        error: [
                            {
                                field: "popup",
                                message: "Authentication Failed. User not Found"
                            }
                        ],
                        message: ""
                    })
                }

                
            }
        }else{
            response.status(401).json({
                statusCode: 401,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Authentication Failed. Token Missing"
                    }
                ],
                message: ""
            })
        }
        
    } catch (error) {
        response.status(401).json({
            statusCode: 401,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "Authentication Failed. Invalid Token"
                }
            ],
            message: ""
        })
    }

  }



// Check if user is Admin or not
exports.isAdmin = async(request,response,next)=>{
    try {
        const user = req.user;
        

        if(user.role === "admin"){
            next();
        }else{

            response.status(403).json({
                statusCode: 403,
                success: false,
                error:[
                    {
                        field: "popup",
                        message: "Access Denied. Admins only"
                    }
                ],
                message: ""
            })
        }

        
        
    } catch (error) {
        response.status(500).json({
            statusCode: 500,
            success: false,
            error:[
                {
                    field: "popup",
                    message: "Error in Admin Authentication"
                }
            ],
            message: ""
        })
    }
}