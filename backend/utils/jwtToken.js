const jwt=require('jsonwebtoken')
const sendToken=(user,statuscode,res)=>{
let jwtToken=jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
// options for cookies
const options={
    expires: new Date(
        Date.now()+process.env.COOKIE_EXPIRE *24 *60 *60 *1000
    ),
    httpOnly:true,
}
res.status(statuscode).cookie('token',jwtToken,options).json({
    success:true,
    user,jwtToken
})
}

module.exports=sendToken