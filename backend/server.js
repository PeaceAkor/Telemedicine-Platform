import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.mjs";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(cors());
app.use(express.json()); // Move this line before your routes

// serve static files like images
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
console.log("User routes mounted at /api/user");
app.use("/api/messages", messageRoutes);

// default endpoint to check if the API is working
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// start server
app.listen(port, () => console.log(`Server started on port ${port}`));
