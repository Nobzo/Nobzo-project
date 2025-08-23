const express = require("express");
const app = express();

// Start up related functions
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

// listen for port connections
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`App is currently listening via port ${port}`));