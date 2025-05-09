const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const authenRouters = require("./routes/authenRouters");
const userRoutes = require("./routes/userRoutes");
const coachRouter = require("./routes/coachRouter");
const adminRoutes = require("./routes/adminRouter");


const authMiddleware = require("./middleware/authMiddleware");

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
app.use("/api/authenticate", authenRouters);
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/coaches", coachRouter);

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000" },
});

// Define Socket.IO connection logic here
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("send-message", ({ roomId, message }) => {
    io.to(roomId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/*
 * --------------------------------------------------------------------------
 *  CHAT ROUTES
 *
 */

// Now import the chatController and pass `io` to it
const chatController = require("./controllers/userController/chatController")(
  io
);
const { getOrCreateChatRoom, sendMessage } = chatController;

// Define chat routes with the required middleware
const router = express.Router();
router.get(
  "/chatroom/:subscriptionId",
  authMiddleware(["user", "coach"]),
  getOrCreateChatRoom
);
router.post(
  "/chatroom/send-message",
  authMiddleware(["user", "coach"]),
  sendMessage
);
app.use("/api/users", router);


// Start the server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(chalk.cyanBright(`Server is running on port ${PORT}`));
});
