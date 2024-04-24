// const { mongo } = require('mongoose');
const UserSchema=require('../Model/user');



const { createOTP } = require('../Controller/otp'); // Importing function to create OTP
const sendMail = require('../Utils/sendotp'); // Importing function to send OTP via email

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const CreateUser = async (req, res) => {
    const { name, email,password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            Success: false,
            Message: "Name and Email are required"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password,salt);


    // Create the user
    const data = await UserSchema.create({
        name: name,
        email: email,
        password:pass
    });

    // Generate OTP

    const otpData = await createOTP(data.email);

    // Send OTP via email
    await sendMail({
        email: data.email,
        subject: "OTP To Verify Your Account",
        // html: `<!DOCTYPE html>
        // <html>
        // <head>
        // <title>Order</title>
        // </head>
        // <body> 
        // <p> Hello ${name}, </p>      
        // <p>Your OTP is: ${otpData.otp_number} </p>        
        // </body>
        // </html>`
        html:`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #0066cc;
                }
                p {
                    margin-bottom: 20px;
                    line-height: 1.6;
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    background-color: #f5f5f5;
                    padding: 10px 20px;
                    border-radius: 5px;
                    border: 2px solid #0066cc;
                    display: inline-block;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Verify Your Account</h1>
                <p>Hello ${name},</p>
                <p>Your OTP (One Time Password) for account verification is:</p>
                <p class="otp">${otpData.otp_number}</p>
                <p>Please enter this OTP to complete your registration process.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <div class="footer">
                    This is an automated email, please do not reply.
                </div>
            </div>
        </body>
        </html>        
        `
    });

    // Send response after creating user and sending OTP
    res.json({
        Success: true,
        Message: "User Created Successfully",
        data
    });
};

const login = async(req,res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.json({
            Success: false,
            Message: "Password and Email are required"
        });
    }

    const user = await UserSchema.findOne({email});

    if (!user){
        return res.json({
            Success:false,
            Message:"User Does Not Exist"
        })
    }
    const verified = user.is_verified;
    if (!verified){
        return res.json({
            Success:false,
            Message:"User Is Not Verified"
        })
    }
    const verify_password = await bcrypt.compare(password,user.password);
    if (verify_password){
        const token = jwt.sign({},"hhbasbcacbccjn",{expiresIn: "1d"});
        return res.json({
            Success:true,
            Message:"Login Successful",
            token
        })
    } else {
        return res.json({
            Success:false,
            Message:"Password is Incorrect"
        })
    }
}

const getallusers =async(req,res) => {
    const users = await UserSchema.find({});
    res.json({
        Success: true,
        Message: "Users Fetched Successfully",
        data: users
    })
}

const getuserbyid = async (req, res) => {
    const userId = req.params.id;
    const user = await UserSchema.findById(userId);
    res.json({
        Success: true,
        Message: "User Created Successfully",
        data: user
    })
}

const getuserbyname = async(req,res) => {
    const username=req.params.name;
    const user= await UserSchema.findOne({name:username});
    res.json({
        Success: true,
        Message: "User Created Successfully",
        data: user
    })
}

const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    const user = await UserSchema.findByIdAndUpdate(userId, { name, email }, { new: true });
    res.json({
        Success: true,
        Message: "User Created Successfully",
        data: user
    })
}

const DeleteUserById=async(req,res)=>{
    const user_id=req.params.id;
    const delete_user=await UserSchema.findByIdAndDelete(user_id);
    res.json({
        Success:true,
        Message:"{user_id} Deleted Successfully",
        data:delete_user
    })
}


module.exports={
    CreateUser,
    getallusers,
    getuserbyid,
    getuserbyname,
    updateUserById,
    DeleteUserById,
    login
};

