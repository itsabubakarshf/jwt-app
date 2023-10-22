const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
firstName:{
    type:String,
    required:true,
    min:6,
    max:30
},
lastName:{
    type:String,
    required:true,
    min:6,
    max:30
},
email:{
    type:String,
    required:true,
    min:6,
    max:30
},
password:{
    type:String,
    required:true,
    min:8,
    max:30
},
date:{
    type:Date,
    default:Date.now
}
});

module.exports=mongoose.model('User',userSchema)