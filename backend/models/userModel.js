const mongoose=require("mongoose")
const validator=require("validator")
const crypto=require("crypto")

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[20,"You name is above 20 char"],
        minLength:[4,"You name is cannotbe less that 4 char"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your email"],
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your password"],
        minLength:[8,"Minimum Length Should be 8"]
    },
    avatar:[ {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }

    }],
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.methods.generateResetToken = function() {
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Set token and expiry
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    return resetToken;
  };

module.exports=mongoose.model("User",userSchema)