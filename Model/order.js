const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user_details:[ {
        user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    user_name:{
        type:String,
        required:true
    }
    }],
    product_details: [{
        product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
        },
        product_name:{
            type:String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending'
    },
    shipping_address: [{
        address:{
            type:String
        },
        landmark:{
            type:String
        },
        city: {
            type: String
        },
        state:{
            type: String
        },
        country:{
            type:String
        },
        pincode:{
            type:Number
        }       
    }],
    payment_detials:[{
        totalprice: {
            type: Number,
            required: true
        },
        discount_details:[{
            applicable:{
                type: Boolean,
                required: true
            },
            discount_percentage:{
                type:Number,
                default:0
            },
            discount_price:{
                type: Number,
                default:0
            }
        }],
        finalprice:{
            type:Number,
            required:true
        }
    }]
});

module.exports = mongoose.model('order', OrderSchema);
