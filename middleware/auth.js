const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    // Check for token
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "Authorization denied" });

    try {
        // Verify token
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        // Add user from payload
        req.user = decoded;
        next();
    } catch(e) {
        res.status(400).json({ error: "Invalid token" });
    }
    
}

module.exports = auth;