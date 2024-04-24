const OrderSchema=require('../Model/order');

const sendmail=require('../Utils/sendmail');

const UserSchema=require('../Model/user');

const ProductSchema=require('../Model/product');

const PDFDocument = require('pdfkit'); // Require pdfkit

const fs = require('fs');

const path = require('path');

// const CreateOrder = async(req,res) =>{
//     const {
//         user_details,
//         product_details,
//         quantity,
//         status,
//         shipping_address,
//         payment_details
//     } = req.body;

//     if(!user_details || !product_details){
//         return res.json({
//             Success: false,
//             Message: "Order Details are required"
//         })
//     }
// doc.moveDown(); // Move down a line
// doc.fontSize(14).text('Order Details:', { underline: true });
// doc.moveDown(); // Move down a line

// product_details.forEach((product, index) => {
//     doc.text(`${index + 1}. Product: ${product.product_name}`);
//     doc.text(`   Quantity: ${quantity}`);
//     // Add more details as needed
//     doc.moveDown(); // Move down a line
// });

// doc.moveDown(); // Move down a line
// doc.fontSize(14).text('Shipping Address:', { underline: true });
// doc.moveDown(); // Move down a line
// doc.text(`Address: ${shipping_address.address}`);
// doc.text(`Landmark: ${shipping_address.landmark}`);
// doc.text(`City: ${shipping_address.city}`);
// doc.text(`State: ${shipping_address.state}`);
// doc.text(`Country: ${shipping_address.country}`);
// doc.text(`Pincode: ${shipping_address.pincode}`);
// doc.moveDown(); // Move down a line

// // Add payment details
// doc.fontSize(14).text('Payment Details:', { underline: true });
// doc.moveDown(); // Move down a line
// doc.text(`Total Price: ${payment_details.totalprice}`);
// doc.text(`Discount Applied: ${payment_details.discount_details[0].applicable ? 'Yes' : 'No'}`);
// doc.text(`Final Price: ${payment_details.finalprice}`);
// doc.moveDown(); // Move down a line

// doc.end(); 
//     const data= await OrderSchema.create({
//         user_details:user_details,
//         product_details:product_details,
//         quantity:quantity,
//         status:status,
//         shipping_address:shipping_address,
//         payment_details:payment_details
//     })

//     const user=await UserSchema.findById(user_details[0].user_id);

//     await sendmail({
//         email:user.email,
//         subject:"Your Orcer has been Placed!!!",
//         html:`<!DOCTYPE html>
//         <html>
//         <head>
//         <title>Order</title>
//         </head>
//         <body>
        
//         <h1>Your Order has been placed</h1>
//         <p>Your Order Id is : ${data._id}. </p>
        
//         </body>
//         </html>`
//     })

//     res.json({
//         Success: true,
//         Message: "Order Placed Successfully",
//         data
//     });
// }

const CreateOrder = async (req, res) => {
    const {
        user_details,
        product_details,
        quantity,
        status,
        shipping_address,
        payment_details
    } = req.body;

    const users = await UserSchema.findById(user_details[0].user_id);
    if (!users.is_verified) {
        return res.json({
            Success: false,
            Message: "User is not verified. Please verify your account before placing an order."
        });
    }

    if (!user_details || !product_details) {
        return res.json({
            Success: false,
            Message: "Order Details are required"
        });
    }

    for (const product of product_details) {
        const productId = product.product_id;
        const orderedQuantity = quantity;
        const prod = await ProductSchema.findById(productId);
        // console.log(prod);
        if (prod.global_inventory[0].quantity && prod.seller_details[0].inventory[0].quantity>= orderedQuantity){
            prod.global_inventory[0].quantity-=orderedQuantity;
            prod.seller_details[0].inventory[0].quantity-=orderedQuantity
            await prod.save();
        } else{
            return res.json({
                Success: false,
                Message:"Product Not Availabale"
            })
        }

    }
         
    const data = await OrderSchema.create({
        user_details: user_details,
        product_details: product_details,
        quantity: quantity,
        status: status,
        shipping_address: shipping_address,
        payment_details: payment_details
    });

    const user = await UserSchema.findById(user_details[0].user_id);

    const doc = new PDFDocument();

    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.moveDown();

    doc.moveDown();

    doc.fontSize(16).text(`Order ID: ${data._id}`);
    doc.moveDown();
    doc.text(`User: ${user.name}`);

// Add product details
    doc.moveDown();
    doc.fontSize(16).text('Product Details', { underline: true });
    for (const product of product_details) {
        const prod = await ProductSchema.findById(product.product_id);
        doc.moveDown().text(`Product Name: ${prod.name}`);
        doc.text(`Price: ${payment_details[0].totalprice}`);
        doc.text(`Quantity: ${quantity}`);
    }

    doc.moveDown();
    doc.fontSize(16).text('Payment Details', { underline: true });
    // Add payment details here...

    doc.moveDown().fontSize(16).text(`Total Amount: ${payment_details[0].finalprice}`);

    // Add payment details


// Add shipping address
    doc.moveDown();
    doc.fontSize(16).text('Shipping Address', { underline: true });
    doc.moveDown().text(`Address: ${shipping_address[0].address}`);

    // Add footer
    doc.moveDown();
    doc.fontSize(12).text('Thank you for your purchase!', { align: 'center' });

    // Create a buffer to store the PDF in memory
    const pdfBuffer = await new Promise((resolve, reject) => {
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.end();
    });
    
    // Send email with attachment
    await sendmail({
        email: user.email,
        subject: "Your Order has been Placed!!!",
        html:`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
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
        <h1>Your Order has been placed</h1>
        <p>Thank you for your order. Your Order ID is: <strong>${data._id}</strong>.</p>
        <p>We'll notify you once your order is processed and shipped.</p>
        <p>If you have any questions or concerns, feel free to contact us.</p>
        <div class="footer">
            This is an automated email, please do not reply.
        </div>
    </div>
</body>
</html>       `,
        attachments: [{ // Attach invoice to email
            // filename: `invoice_${data._id}.pdf`,
            // path: invoicePath
            filename: `hello_${data._id}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
        }]
    });

    res.json({
        Success: true,
        Message: "Order Placed Successfully",
        data
    });
};



const GetAllOrders=async(req,res)=>{
    // let {page=1, limit=5} = req.query;
    // const skip=(page-1)*limit;
    // const total_documents=await OrderSchemaSchema.countDocuments();
    const orders=await OrderSchema.find({});
    res.json({
        Success: true,
        length:orders.length,
        Message:"Orders Placed Successfully",
        data: orders, 
        // limit:parseInt(limit),page,total_documents
    })
}

const DeleteOrderById=async(req,res)=>{
    const order_id=req.params.order_id;
    const delete_order=await OrderSchema.findByIdAndDelete(order_id);
    res.json({
        Success:true,
        Message:"Order Deleted Successfully",
        data:delete_order
    })
}

const UpdateOrderById = async (req, res) => {
    const order_id = req.params.order_id;
    const { status, quantity } = req.body;
    const update_detail = await OrderSchema.findByIdAndUpdate(order_id, {status, quantity }, { new: true });
    res.json({
        Success: true,
        Message: "Order Updated Successfully",
        data: update_detail
    })
}

module.exports={
    CreateOrder,
    GetAllOrders,
    DeleteOrderById,
    UpdateOrderById,
}