const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    fullName:{type:String, required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    note:{type: Number, default:0},
    role:{type:String,default:'simpleUser'},
    localisation:{type:String,default:''}
}
)

module.exports=mongoose.model('User',userSchema);



