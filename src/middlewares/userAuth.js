const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const config = require("../config/config");

const verifyUser = async (req, res, next) => {
  try {
    // 1️⃣ Read Authorization header
    const authHeader = req.headers.authorization;

    let token;

    // 2️⃣ Extract Bearer token
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }else{
      token = req.cookies.token;
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token not provided",
      });
    }

    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, config.jwtSecret);

    // 4️⃣ Fetch user from DB
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // 5️⃣ Attach user to request
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { verifyUser };
