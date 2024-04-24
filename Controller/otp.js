const OtpSchema = require('../Model/otp');
const UserSchema=require('../Model/user');

const createOTP = async (email) => {
    try {
        // Generate a random OTP
        const otpNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP

        // Set expiry time (2 minutes from now)
        const expiryTime = new Date(Date.now() + 120000); // 2 minutes

        // Create OTP record in the database
        const otpData = await OtpSchema.create({
            otp_number: otpNumber,
            email: email,
            expiry_time: expiryTime
        });

        return otpData;

    } catch (error) {
        throw new Error("Error generating OTP");
    }
};



const getallotps =async(req,res) => {
    const otp = await OtpSchema.find({});
    res.json({
        Success: true,
        Message: "OTP Created Successfully",
        data: otp
    })
}

const DeleteOtpById=async(req,res)=>{
    const otp_id=req.params.id;
    const delete_otp=await OtpSchema.findByIdAndDelete(otp_id);
    res.json({
        Success:true,
        Message:"OTP Deleted Successfully",
        data:delete_otp
    })
}

const verifyOTP = async (req, res) => {
    const { email, otp } = req.query;

    // Check if email and OTP are provided in the URL
    if (!email || !otp) {
        return res.status(400).json({
            Success: false,
            Message: "Email and OTP are required in the URL"
        });
    }

    // Find the OTP record in the database
    const otpData = await OtpSchema.findOne({ email: email });

    // Check if OTP record exists for the provided email
    if (!otpData) {
        return res.status(400).json({
            Success: false,
            Message: "OTP record not found for the provided email"
        });
    }

    // Check if the OTP is expired
    // if (new Date() > otpData.expiry_time) {
    //     return res.status(400).json({
    //         Success: false,
    //         Message: "OTP has expired"
    //     });
    // }

    // Check if the provided OTP matches the stored OTP
    if (otpData.otp_number !== parseInt(otp)) {
        return res.status(400).json({
            Success: false,
            Message: "Incorrect OTP"
        });
    }

    // If all checks pass, return success message

    const user = await UserSchema.findOneAndUpdate({ email: email }, { is_verified: true }, { new: true });
    // await otpData.save();
    await user.save();

    res.json({
        Success: true,
        Message: "OTP verified successfully"
    });
};

module.exports = {
    createOTP,
    getallotps,
    DeleteOtpById,
    verifyOTP
};
