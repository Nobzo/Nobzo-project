require("dotenv").config();
const http = require('http');
const userRoutes = require("./routes/userRoutes");
const express = require('express');
const { Server } = require('socket.io');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Startup related functions
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

// Test route for Postman
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

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

// Routes
app.use("/api/users", userRoutes);

// Listen for port connections
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`App is currently listening via port ${port}`));
