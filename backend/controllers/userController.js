const expressAsyncHandler=require('express-async-handler')
const bcryptjs=require("bcryptjs")
const User=require('../models/userModel')
const sendToken = require('../utils/jwtToken')
const sendEmail=require("../utils/sendEmail")

// Creating User
const registerUser=expressAsyncHandler(async(req,res,next)=>{
    let {name,email,password}=req.body
    // checking for dublicate data
    const dubUser=await User.findOne({email:email})
    if(dubUser!=null){
        res.status(200).json({success:true,message:"User already existing"})
    }else{
        const hashPassword=await bcryptjs.hash(password,5)
        password=hashPassword;
        const user=await User.create({
            name,email,password,avatar:{
                public_id:"This is public id",
                url:"This is url of product"
            }
        })
     sendToken(user,201,res);
    }
    
})


// LoginUser
const loginUser=expressAsyncHandler(async(req,res,next)=>{
    const user=req.body;
    const userVerif=await User.findOne({email:user.email})
    if(userVerif==null){
        res.status(200).json({success:false,message:"Invalid Email"})
    }else{
        // verifying password
        let isEqual=await bcryptjs.compare(user.password,userVerif.password)
        if(isEqual===false){
            res.status(200).json({success:false,message:"Password is in correct"})
        }else{

            sendToken(user,201,res)
        }
    }
})


// LogOut
const logOut=expressAsyncHandler(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({success:true,message:"Logged Out"})
})

// Forgot Password------------------------------------------------------------------------------------
const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate reset token
      const resetToken = user.generateResetToken();
      await user.save();
  
      // Send email with reset token
      const resetUrl = `http://yourwebsite.com/reset-password/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) has requested the reset of the password. Please click on the following link to reset your password: \n\n ${resetUrl}`;
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message
      });
  
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //Reset Password----------------------------------



//Get User Details
const getUserDetails=expressAsyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("-password")
    res.status(200).json({success:true,user})
})

// Change Password
const updatePassword = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        const isEqual = await bcryptjs.compare(oldPassword, user.password);
        if (!isEqual) {
            return res.status(400).json({ success: false, message: "Old Password is incorrect" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password does not match" });
        }

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(newPassword,5);
        user.password = hashedPassword;
        await user.save();

        // Sending token after saving user
        sendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Serer Error" });
    }
});

// Update user Profile
const updateProfile=expressAsyncHandler(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    };
    // we will add cloudinary later
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({success:true,user})
})


// getting all user(admin)
const getAllUsers=expressAsyncHandler(async(req,res,next)=>{
    const users=await User.find()
    res.status(200).json({success:true,users})
})
// getting all user(admin)
const getOneUsers=expressAsyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
    if(!user){
        res.status(200).json({success:false,message:"User not found"})
    }
    res.status(200).json({success:true,user})
})

// deleting of user
const deleteUser = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
  
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);
  
    // If user not found, return 404 Not Found
    if (!deletedUser) {
      res.status(404);
      throw new Error('User not found');
    }
  
    // If user is deleted successfully, return success message
    res.json({ success: true, message: 'User deleted successfully' });
  });



module.exports={registerUser,loginUser,logOut,forgotPassword,getUserDetails,updatePassword,updateProfile,getAllUsers,getOneUsers,deleteUser}