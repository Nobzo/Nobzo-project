const dotenv = require("dotenv");
const config = require("config");

module.exports = function() {
    dotenv.config(); // Load .env variables

    if (!process.env.JWT_KEY) {
        throw new Error("FATAL ERROR: JWT_KEY is not defined.");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("FATAL ERROR: MONGO_URI is not defined.");
    }
};