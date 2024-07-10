const mongoose=require("mongoose")
var schema = new mongoose.Schema({
    mobnom:{
        type:Number,
        match:[/^\d{3}-\d{3}-\d{4}$/.test('222-222-2222')],
    },
    naming:{
        type:String,
        required:[true]
    },

})
const userdetail = mongoose.model("mobnom",schema);
module.exports=userdetail