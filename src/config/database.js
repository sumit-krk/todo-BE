const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async()=>{
    try{
        await mongoose.connect(`${config.dbUrl}`)
        console.log("Database connected successfully");
    }catch(err){
        console.log("Database connection failed", err.message);
    }
}

module.exports = { connectDB };