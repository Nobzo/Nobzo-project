// middleware/authorizeRole.js
module.exports = function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send("Unauthorized. No user found in request.");
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send("Forbidden. You don't have permission to access this resource.");
        }

        next();
    };
};
