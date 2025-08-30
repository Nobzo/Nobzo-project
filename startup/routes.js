const express = require("express");
const users = require("../controllers/user");
const login = require("../controllers/login");
const google = require("../controllers/googleAuth");


module.exports = (app)=>{
    app.use(express.json()); //parse incoming body to json
    const memeRoutes = require('../routes/memeRoutes');
    const commentRoutes = require('../routes/commentRoutes');
    const likeRoutes = require('../routes/likeRoutes');
    const promoteUserRoutes = require('../routes/promoteUser');

    app.use('/api/memes', memeRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/likes', likeRoutes);
    app.use("/api/users", users);
    app.use("/api/login", login);
    app.use("/api/auth", google);
    app.use("/api/promoteUser", promoteUserRoutes);

};