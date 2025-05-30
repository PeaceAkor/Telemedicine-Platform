import express from "express";
import cors from "cors";
import "dotenv/config";
import axios from "axios";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.mjs";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Static files (uploads)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Daily.co room creation route
app.post("/create-room", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.daily.co/v1/rooms",
      { properties: { exp: Math.round(Date.now() / 1000) + 3600 } }, // expire in 1 hour
      { headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` } }
    );
    res.json({ url: response.data.url });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create room", details: err.message });
  }
});

// Create HTTP server and bind Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    // Ensure type is set for all messages
    if (!data.type) {
      data.type = "text";
    }

    // Log the message with sender and room info
    console.log(
      `[Room: ${data.room}] ${data.sender}: ${data.message || "(file)"}`
    );

    // Broadcast the message to everyone in the room
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
