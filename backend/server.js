const app=require('./app')
const dotenv=require('dotenv')
const connectDataBase=require("./config/database")
// Handling uncaught Exception Like prining the notdefined variables it causes errors
process.on('uncaughtException',(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting doen the server due to unhandled Exception`)
    process.exit(1)
})



// config
dotenv.config({path:"../backend/config/config.env"})

// connecting to database
connectDataBase()

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is listinig to port ${process.env.PORT}`)
})

// Unhandled Promise Rejection
// This error is handle for when server is not having proper path or error in config.env
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise rejection`)
    server.close(()=>{
        process.exit(1)
    })
})