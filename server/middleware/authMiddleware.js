const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.id;
        next();
    } catch (error){
        console.error("Token verification failed:", error);
        return res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;
// This middleware function checks for a valid JWT token in the request headers.