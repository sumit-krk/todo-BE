const express=require("express");
const { validateSignUpData } = require("../utils/validation");
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

module.exports={authRoutes};