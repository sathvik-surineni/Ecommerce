
const express=require("express")
const app=express()
const cookieParser=require('cookie-parser')
const errorHandler=require('./middleware/errorhandler')
const invalidpath=require('./middleware/invalidpath')
app.use(express.json())
app.use(cookieParser())
// Route Imports
const product=require("./routes/productRoute")
const user=require("./routes/userRoute")
app.use("/api/v1",product)
app.use("/api/v1",user)
// using of errorhandler
app.use(errorHandler)
app.use(invalidpath)




module.exports=app;