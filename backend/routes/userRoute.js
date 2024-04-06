const express=require("express")
const { registerUser,loginUser, logOut, forgotPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getOneUsers, deleteUser } = require("../controllers/userController")
const {isAuthenticatedUser,authorizedRole} = require("../middleware/auth")
const router=express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logOut)
router.route('/password/forgot').post(forgotPassword)
router.route('/me').get(isAuthenticatedUser,getUserDetails)
router.route('/updatepassword').put(isAuthenticatedUser,updatePassword)
router.route('/me/update').put(isAuthenticatedUser,updateProfile)
router.route('/admin/allusers').get(isAuthenticatedUser,authorizedRole("admin"),getAllUsers)
router.route('/admin/singleuser/:id').get(isAuthenticatedUser,authorizedRole("admin"),getOneUsers)
router.route('/admin/deleteuser/:id').delete(isAuthenticatedUser,authorizedRole("admin"),deleteUser)

module.exports=router;