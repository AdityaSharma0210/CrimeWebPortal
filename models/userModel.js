const mongoose=require("mongoose")
const plm=require("passport-local-mongoose");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        minLength:[4,"Username must have atlleast 4 characters"],
        required:[true,"Username Field cannot be empty"]
    },
    password:{
        type:String,
    },
    email:{
        type:String,
        required:[true, "Password Field can not be empty"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,         //this is for specifying the email writing format
            "Please fill a valid email address",
        ]
    },
    mobnom:{
        type:Number,
        match:[/^\d{3}-\d{3}-\d{4}$/.test('222-222-2222')],
    },
    
})
userSchema.plugin(plm);
const User = mongoose.model("user",userSchema);
module.exports=User