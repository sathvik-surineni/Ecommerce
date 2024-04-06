const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Producr Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "please Enter Product Price"],
        maxLength: [8, "Price Cannot exceed 8 character"]
    },
    rating: {
        type: Number,
        default: 0
    },
    image:[ {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }


    }],
    category:{
type:String,
required:[true,"Please enter Product Category"],
    },
    stock:{
        type:Number,
        required:[true,"Please Enter product Stock"],
        maxLength:[4,"Stock Cannot exceed 4 characters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        name:{
            type:String,

        },
        rating:{
            type:Number,

        },
        comment:{
            type:String,
        },
        createdDate:{
            type:Date,
            default:Date.now
        }
    }]

})


module.exports=mongoose.model("Product",productSchema)