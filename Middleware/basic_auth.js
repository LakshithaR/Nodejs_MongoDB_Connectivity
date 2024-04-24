const auth = require('basic-auth');
require('dotenv').config();

// dotenv.config();


const basic_auth_middleware = async(req, res, next)=>{
    const user = await auth(req);
    console.log(user);
    const USERNAME = process.env.AUTHNAME;
    // const USERNAME = "testing";

    console.log(USERNAME);
    const PASSWORD = process.env.AUTHPASSWORD;
    console.log(PASSWORD);

    if (!user.name || !user.pass){
        return res.json({
            Success: false,
            Message: "No Credentials Found"
        })
    }

    if (user?.name == USERNAME && user?.pass == PASSWORD){
        next();
    } else {
        return res.json({
            Success: false,
            Message: "Invalid Credentials"
        })
    }
}

module.exports=basic_auth_middleware;