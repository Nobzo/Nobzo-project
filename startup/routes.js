const express = require("express");
const users = require("../routes/user");
const login = require("../routes/login");


module.exports = (app)=>{
    app.use(express.json()); //parse incoming body to json
    
    // route middlewares
    app.use("/api/users", users);
    app.use("/api/login", login);
};