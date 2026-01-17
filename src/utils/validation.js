const validator=require("validator");
const config = require("../config/config");
const jwt=require("jsonwebtoken");

const validateSignUpData=(req)=>{
    const {firstName, lastName, email, password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    } else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
};

const validationEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

const getJsonWebToken = async (userID) => {
    const token = await jwt.sign({_id: userID}, `${config.jwtSecret}`, {expiresIn: "7d"});
    return token;
}

module.exports={validateSignUpData, validationEditProfileData, getJsonWebToken}