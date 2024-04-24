const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    otp_number:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        sparse:true
    },
    expiry_time:{
        type:Date
    }
});

module.exports = mongoose.model('otp', OtpSchema);
