const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();

// Startup related functions
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: { origin: '*' } // adjust for production
});

// Make io available to controllers
app.set('io', io);

// Register sockets
require('./socket/socket')(io);

// Listen for port connections
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`App is currently listening via port ${port}`));
