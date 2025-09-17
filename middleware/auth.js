const jwt = require('jsonwebtoken');

function verifyAuthToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); // USE process.env.JWT_KEY
        req.user = decoded;
        next();
    } catch (ex) {
        console.error('JWT Verification Error:', ex);
        res.status(400).send({ message: 'Invalid token', details: ex });
    }
}

module.exports = verifyAuthToken;
