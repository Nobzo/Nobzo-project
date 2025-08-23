const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect("mongodb://localhost/blog")
    .then(()=> console.log("successfully connected to mongodb"))
    .catch((err)=> console.error(err));
};