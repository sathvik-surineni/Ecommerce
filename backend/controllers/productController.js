const Product=require("../models/productModel")
const expressAsyncHandler=require('express-async-handler')

// creating product----------------------------------------------------------------------------------------------------------------------
const createProduct=expressAsyncHandler(async(req,res,next)=>{
    const product=await Product.create(req.body);
    res.status(200).json({success:true,product})
})
// getting all products------------------------------------------------------------------------------------------------------------------
const getProductData = expressAsyncHandler(async (req, res, next) => {
    const pageSize = 5; // Set your desired page size
    const page = parseInt(req.query.page) || 1;
    let query = {};
    // Advanced search and filter options
    if (req.query.keyword) {
        // Search by keyword in product name or description
        query.$or = [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
        ];
    }
    if (req.query.category) {
        // Filter by category
        query.category = { $regex: req.query.category, $options: 'i' };
    }
    // Price filter
    if (req.query.Price) {
        const priceFilter = {};

        const operators = ['gte', 'lte', 'gt', 'lt'];
        for (const operator of operators) {
            if (req.query.Price[operator]) {
                priceFilter[`$${operator}`] = parseFloat(req.query.Price[operator]);
            }
        }
        if (Object.keys(priceFilter).length > 0) {
            query.price = priceFilter;
        }
    }
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageSize);

    query = Product.find(query)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    const products = await query;

    res.status(200).json({
        success: true,
        page,
        totalPages,
        pageSize,
        totalProducts,
        products,
    });
});


// -----------------------------------------------------------------------------------------------------------------------------------------
  
// updatinng the product --Admin
const updateproduct=expressAsyncHandler(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return res.status(400).json({
            success:false,
            message:"Product Not Found"
        })
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})
res.status(200).json({success:true,product})
})
//---------------------------------------------------------------------------------------------------------------------------------------
// delete product --Admin
const deleteProduct=expressAsyncHandler(async(req,res,next)=>{
    let product=await Product.findById(req.params.id)
    if(!product){
        return res.status(400).json({success:false,message:"Product not Found"})
    }
    product=await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true,message:"Product Deleted"})


})

// get product details--------------------------------------------------------------------------------------------------
const getproduct=expressAsyncHandler(async(req,res,next)=>{
    const product=await Product.findById(req.params.id)
    if(!product){
        return res.status(400).json({
            success:false,
            message:"Product not found"
        })
    }
    res.status(200).json({success:true,product})

})

module.exports={createProduct,getProductData,updateproduct,deleteProduct,getproduct}