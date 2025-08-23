const verifyAdminRole = (req, res, next) => {
    // deny non-admin user access
    if(req.user.role !== "ADMIN") return res.status(403).send("Access denied: You are not an admin");
    // move on if admin
    next();
}

module.exports = verifyAdminRole;