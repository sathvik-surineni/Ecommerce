const errorHandlingMiddleware = (error, request, response, next) => {
  console.error(error); // Log the error for debugging purposes
  
  if (!response.headersSent) {
      response.status(500).json({ success: false, message: "Internal Server Error" });
  } else {
      // If headers have already been sent, delegate to the default Express error handler
      next(error);
  }
};

module.exports = errorHandlingMiddleware;
