const jwt = require("jsonwebtoken");
const config = require("config");

const verifyAuthToken = ( req, res, next ) => {
    // Get auth token from the request header property
    const authToken = req.headers.authorization?.split(" ")[1];
    // check if bearer token is even included
    if(!authToken) return res.status(401).send("Access denied! No token provided.");
    
    try {
        
        const decoded = jwt.verify(authToken, config.get("blog_jwtPrivateKey")); // verify token using jwt's verify method

        req.user = decoded; //  attach decoded details to the user request
        
        next(); // move on
    } catch (ex) {
        console.error(`Invalid token: ${ex.jsonWebTokenError}`);
        return res.status(400).send("Invalid token!");
    }
}

module.exports = verifyAuthToken;