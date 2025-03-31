const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const chalk = require("chalk");
const connectDB = require("./config/mongodb"); // Import connectDB function

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000" },
});

// Start the server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(chalk.cyanBright(`Server is running on port ${PORT}`));
});
