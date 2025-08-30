const mongoose = require("mongoose");
const config = require("config");

module.exports = function() {
    const db = config.get("db");
    mongoose.connect(db)  // no need for useNewUrlParser or useUnifiedTopology
        .then(() => console.log(`Connected to MongoDB at ${db}`))
        .catch(err => console.error("MongoDB connection error:", err));
};




