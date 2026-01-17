const express=require("express");
const { validateSignUpData, getJsonWebToken } = require("../utils/validation");
const bcrypt=require("bcrypt");
const { User } = require("../models/user");

const authRoutes=express.Router();

authRoutes.post("/signup", async(req, res)=>{
    const {firstName, lastName, email, password, photoUrl}=req.body;
    try{
        validateSignUpData(req)
        const hasPassword=await bcrypt.hash(password, 10)
        const user=new User({firstName, lastName, email, photoUrl, password:hasPassword})
        const savedUser= await user.save();
        res.send("User signed up successfully");
    }catch(err){
        console.log("Error in signup", err.message);
        res.status(500).json({
            success:false,
            message:"Error in signup",
            error:err.message
        });
    }
});

authRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password",
        });
      }
  
      const loginUser = await User.findOne({ email });
      if (!loginUser) {
        return res.status(400).json({
          success: false,
          message: "User not found, please signup",
        });
      }
  
      const isPasswordMatched = await bcrypt.compare(
        password,
        loginUser.password
      );
  
      if (!isPasswordMatched) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      const token = await getJsonWebToken(loginUser._id);
  
      // ⭐ FIXED COOKIE
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,      // ❗ localhost ke liye
            sameSite: "lax",    // ❗ localhost ke liye
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
  
      // remove password before sending user
      const { password: _, ...safeUser } = loginUser.toObject();
  
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: safeUser,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Something went wrong",
      });
    }
  });
  

module.exports={authRoutes};