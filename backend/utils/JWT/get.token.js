exports.GetAccessToken = (req)=>{
    const accessToken = req.cookies?.accessToken;
    return accessToken;
    
}