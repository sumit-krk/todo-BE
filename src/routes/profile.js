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

module.exports={profileRoutes}

