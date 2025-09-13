const express = require("express");
const users = require("../controllers/user");
const logout = require("../controllers/logOutController");
const login = require("../controllers/login");
const google = require("../controllers/googleAuth");

module.exports = (app)=>{
    app.use(express.json()); //parse incoming body to json
    const memeRoutes = require('../routes/memeRoutes');
    const analytics = require("../routes/analytics");
    const commentRoutes = require('../routes/commentRoutes');
    const likeRoutes = require('../routes/likeRoutes');
    const promoteUserRoutes = require('../routes/promoteUser');
    const activityLogRoutes = require('../routes/activityLog');

    app.use('/api/analytics', analytics);
    app.use('/api/activityLogs', activityLogRoutes);
    app.use('/api/memes', memeRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/likes', likeRoutes);
    app.use("/api/users", users);
    app.use("/api/logout", logout);
    app.use("/api/login", login);
    app.use("/api/auth", google);
    app.use("/api/promoteUser", promoteUserRoutes);

};