const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('../config/config');

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:[true, "First name is required"],
        minLength:[2, "First name must be at least 2 characters"],
        maxLength:[50, "First name cannot exceed 50 characters"]
    },
    lastName:{
        type:String,
        required:[true, "Last name is required"],
        minLength:[2, "Last name must be at least 2 characters"],
        maxLength:[50, "Last name cannot exceed 50 characters"]
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true,
        lowercase:true,
        validate:{
            validator:function(v){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message:props=>`${props.value} is not a valid email`
        }
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    photoUrl:{
        type: String
    }
}, {timestamps:true});

userSchema.methods.getJWTToken = async function(){
    const user=this;
    const token = await jwt.sign({_id: user._id}, `${config.jwtSecret}`, {
        expiresIn: "7d"
    });
    return token;
}

const User=mongoose.model("User", userSchema);
module.exports={User};