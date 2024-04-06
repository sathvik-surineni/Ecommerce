const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuthenticatedUser = expressAsyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: "Please Login To access" });
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decodedData.email });
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

const authorizedRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({ success: false, message: `Role:${req.user.role} not allowed to` });
        }
        next();
    }
}

module.exports = { isAuthenticatedUser, authorizedRole };
