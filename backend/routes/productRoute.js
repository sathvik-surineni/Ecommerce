
const express=require("express")
const { createProduct,getProductData,updateproduct,deleteProduct,getproduct } = require("../controllers/productController")
const {isAuthenticatedUser,authorizedRole} = require("../middleware/auth")
const router=express.Router()
router.use(express.json())

router.route('/products').get(getProductData)
router
.route('/createproduct')
.post(isAuthenticatedUser,authorizedRole("admin"),createProduct)
router
.route('/product/:id')
.put(isAuthenticatedUser,authorizedRole("admin"),updateproduct)
.delete(isAuthenticatedUser,authorizedRole("admin"),deleteProduct)
.get(getproduct)


module.exports=router;