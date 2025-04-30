import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("Token received in headers:", token); // Log the token

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log the decoded token

    const user = await UserModel.findById(decoded.id).select("-password");
    console.log("User fetched from database:", user); // Log the user

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = { _id: decoded.id.toString() };
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
