const mongoose=require("mongoose")

const userModel=new mongoose.Schema({
    image:String,
    author:String
})

const User = mongoose.model("user", userModel);

module.exports=User;


