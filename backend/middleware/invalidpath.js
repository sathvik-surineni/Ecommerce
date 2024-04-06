const invalidPathMiddleware=(request,response,next)=>{
    response.json({message:'Invalid Path'})
  }

  module.exports=invalidPathMiddleware;