const jwt = require('jsonwebtoken');

const authentication_middleware = async(req,res,next) =>{
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")){
        return res.json({
            Success: false,
            Message:"No Token Provided"
        })
    }
    console.log(token);
    
    const is_token_valid = jwt.verify(token.split(" ")[1],"hhbasbcacbccjn");
    console.log(is_token_valid);
    // jwt.verify(token,"hhbasbcacbccjn");
    next();
    } catch (error) {
        return res.json({
            Success: false,
            Message:"Invalid Token",
            error
        })
    }
}
    

module.exports=authentication_middleware;