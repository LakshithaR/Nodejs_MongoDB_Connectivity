const express=require('express');

const router=express.Router();

const async_handler=require('../Middleware/async_handler');

const {
    getallotps,
    DeleteOtpById,
    verifyOTP
} = require('../Controller/otp');

// router.route('/create').post(async_handler(CreateUser));

router.route('/getallotps').get(async_handler(getallotps));

router.route('/deleteotpbyId/:id').delete(async_handler(DeleteOtpById));

router.route('/verifyotp').post(async_handler(verifyOTP));

module.exports=router;

