const express=require("express");
const { verifyUser } = require("../middlewares/userAuth");

const profileRoutes=express.Router();

profileRoutes.get("/get-profile",verifyUser,async(req, res)=>{
   try{
    if(!req.user){
        throw new Error("User not found");
    }
    else{
        const {firstName, lastName, email, photoUrl, createdAt, updatedAt}=req.user;
        res.status(200).json({
            success:true,
            message:"User profile fetched successfully",
            data:{firstName, lastName, email, photoUrl, createdAt, updatedAt}
        })
    }
   }catch(err){
    res.status(500).json({
        success:false,
        message:"Error in fetching user profile",
        error:err.message
    });
   }
})

profileRoutes.patch("/edit-profile",verifyUser, async(req, res)=>{
    try{
        const userData=req.user;
        if(!userData){
            throw new Error("User not found");
        }
        const allowedEditFields = ["firstName", "lastName", "email", "photoUrl"];
        const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
        if(!isEditAllowed){
            throw new Error("Editing some fields is not allowed");
        }
        Object.keys(req.body).forEach(field => {
            userData[field] = req.body[field];
        });
        const updatedUser=await userData.save();
        res.status(200).json({
            success:true,
            message:"User profile edited successfully",
            data:updatedUser
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Error in editing user profile",
            error:err.message
        })
    }
})

module.exports={profileRoutes}

