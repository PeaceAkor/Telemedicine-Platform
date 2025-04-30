import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorised Login " });
    }

    const dtoken = authHeader.split(" ")[1]; // Get the token after "Bearer"

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.doctor = { id: token_decode.id };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Token is invalid" });
  }
};

export default authDoctor;
