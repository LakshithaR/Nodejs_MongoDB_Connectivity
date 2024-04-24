const express = require('express');

const connectdb = require('./db');

const app=express();

const dotenv = require('dotenv');

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// // Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


app.get("/getuser", (request,response)=>{

    response.json({
        name:'Lakshitha',
    })
})


const error_handler=require('./Middleware/error_handler');

// app.use(error_handler);


const UserRoute = require('./Routes/user');

const ProductRoute = require('./Routes/product');

const OrderRoute = require('./Routes/order');

const OtpRoute = require('./Routes/otp');

app.use('/otp',OtpRoute);

app.use('/user',UserRoute);

app.use('/product',ProductRoute);

app.use('/order',OrderRoute);

const not_found_middleware=require('./Middleware/not_found_middleware');

app.use(not_found_middleware);

app.use(error_handler);


connectdb('mongodb://localhost:27017').then(()=>{
    console.log("Database Connected");
    app.listen(5000,()=> {
        console.log("Server Running.");
    })
}).catch((err)=>{
    console.log(err);
});


app.post('/userpost',(req,res) =>{
    console.log(req.body);
    res.send(req.body);
    
})

/* const CreateUser = async(req,res) =>{
    const {
        name, email
    } = req.body;

    if(!name || !email){
        return res.json({
            Success: false,
            Message: "Name and Email are required"
        })
    }

    const data= await UserSchema.create({
        name: name,
        email: email 
    })
    res.json({
        Success: true,
        Message: "User Created Successfully",
        data
    });
    // res.send('Hello');
}
 */