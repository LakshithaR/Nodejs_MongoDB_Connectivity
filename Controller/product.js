const ProductSchema=require('../Model/product');

const CreateProduct = async(req,res) =>{
    const {
        name, 
        category,
        seller_details,
        global_inventory,
        rating,
        description,
        photos
    } = req.body;

    if(!name || !category){
        return res.json({
            Success: false,
            Message: "Name and Category are required"
        })
    }

    const data= await ProductSchema.create({
        name: name,
        category: category,
        seller_details: seller_details,
        global_inventory: global_inventory,
        rating: rating,
        description: description,
        photos: photos
    })
    res.json({
        Success: true,
        Message: "Product Created Successfully",
        data
    });
}

const GetAllProducts=async(req,res)=>{
    let {page=1, limit=5} = req.query;
    const skip=(page-1)*limit;
    // console.log(page);
    // console.log(limit);
    // console.log(skip);
    const total_documents=await ProductSchema.countDocuments();
    const products=await ProductSchema.find({}).skip(skip).limit(limit);
    res.json({
        Success: true,
        length:products.length,
        Message:"Products Created Successfully",
        data: products, 
        limit:parseInt(limit),page,total_documents
    })
}

const DeleteProductById=async(req,res)=>{
    const product_id=req.params.product_id;
    const delete_product=await ProductSchema.findByIdAndDelete(product_id);
    res.json({
        Success:true,
        Message:"{product_id} Deleted Successfully",
        data:delete_product
    })
}

const UpdateProductById = async (req, res) => {
    const product_id = req.params.product_id;
    const { name, category } = req.body;
    const update_detail = await ProductSchema.findByIdAndUpdate(product_id, { name, category }, { new: true });
    res.json({
        Success: true,
        Message: "Product Updated Successfully",
        data: update_detail
    })
}

const ReduceInventoryQuantity = async(req,res)=>{
    const product_id = req.params.product_id;
    const { color, quantity } = req.body;
    let product = await ProductSchema.findById(product_id);
    if (!product) {
        return res.status(404).json({
            Success: false,
            Message: "Product not found"
        });
    }
    product.seller_details.forEach(seller => {
        const inventoryItem = seller.inventory.find(item => item.color === color);
        if (inventoryItem) {
            inventoryItem.quantity -= quantity;
        }
    });

    // Reduce quantity in global_inventory
    const globalInventoryItem = product.global_inventory.find(item => item.color === color);
    if (globalInventoryItem) {
        globalInventoryItem.quantity -= quantity;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    res.json({
        Success: true,
        Message: "Inventory quantities reduced successfully",
        data: updatedProduct
    });
}


module.exports={
    CreateProduct,
    GetAllProducts,
    DeleteProductById,
    UpdateProductById,
    ReduceInventoryQuantity
}