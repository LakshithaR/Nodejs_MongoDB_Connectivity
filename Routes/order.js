const express=require('express');

const router=express.Router();

const async_handler=require('../Middleware/async_handler');

const {
    CreateOrder,
    GetAllOrders,
    DeleteOrderById,
    UpdateOrderById
}=require('../Controller/order');

router.route('/create').post(async_handler(CreateOrder));

router.route('/getallorders').get(async_handler(GetAllOrders));

router.route('/deleteorderbyid/:order_id').delete(async_handler(DeleteOrderById));

router.route('/updateorderbyid/:order_id').patch(async_handler(UpdateOrderById));

module.exports=router;
