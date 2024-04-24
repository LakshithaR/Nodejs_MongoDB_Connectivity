const express=require('express');

const router=express.Router();

const async_handler=require('../Middleware/async_handler');

const {
    CreateProduct,
    GetAllProducts,
    DeleteProductById,
    UpdateProductById,
    ReduceInventoryQuantity,
}=require('../Controller/product');

router.route('/create').post(async_handler(CreateProduct));

router.route('/getallproducts').post(async_handler(GetAllProducts));

router.route('/deleteproductbyid/:product_id').delete(async_handler(DeleteProductById));

router.route('/updateproductbyid/:product_id').patch(async_handler(UpdateProductById));

router.route('/reduceinventoryquantity/:product_id').post(async_handler(ReduceInventoryQuantity));

module.exports=router;
