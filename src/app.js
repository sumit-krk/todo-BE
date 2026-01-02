const express=require("express");
require("dotenv").config();
const {connectDB}=require("./config/database");
const config = require("./config/config");
const cookieParser=require("cookie-parser");
const app=express();
// const PORT = process.env.PORT
// console.log("Port:", PORT);
app.use(express.json());
app.use(cookieParser());
const {authRoutes}=require("./routes/auth");
const { profileRoutes } = require("./routes/profile");
app.use("/", authRoutes)
app.use("/",profileRoutes)

connectDB().then(()=>{
    app.listen(config.port, ()=>{
        console.log(`Server is running on port ${config.port}`);
    })
    console.log("Database connected and server started");
}).catch((err)=>{
    console.log("Failed to connect to database", err.message);
});

