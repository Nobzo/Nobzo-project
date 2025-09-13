const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const app = express();

// Start up related functions
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // adjust for production
});

// Make io available to controllers
app.set('io', io);

// Register sockets
require('./socket/socket')(io);

// listen for port connections
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`App is currently listening via port ${port}`));