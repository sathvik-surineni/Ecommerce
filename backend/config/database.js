const mongoose=require("mongoose")
const connectDb=async()=>{
const connect=await mongoose.connect(process.env.DB_URL);
console.log("Database Connected",connect.connection.port);
}
module.exports=connectDb;