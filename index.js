<<<<<<< HEAD
const express = require("express");
=======
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
>>>>>>> 60571022a8105c030933491b28a8d3a0dbfd0f9b
const app = express();

// Start up related functions
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

<<<<<<< HEAD
=======
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // adjust for production
});

// Make io available to controllers
app.set('io', io);

// Register sockets
require('./socket/socket')(io);

>>>>>>> 60571022a8105c030933491b28a8d3a0dbfd0f9b
// listen for port connections
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`App is currently listening via port ${port}`));