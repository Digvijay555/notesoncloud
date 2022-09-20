
// create connect conection
const mongoose = require("mongoose");

// connection string
const mongoURI = "mongodb://localhost:27017/notesOnCloud?directConnection=true"

// create connect function
const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("connected successfully");
    })
}

module.exports = connectToMongo;

