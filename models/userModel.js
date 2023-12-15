const mongoose = require('mongoose');

const ProdSchema=new mongoose.Schema({
        pid:String,
        pname:String,
        qnty:Number,
});
const BillSchema=new mongoose.Schema({
    email:String,
    total:Number,
    timestamp:{
        type:Date,
        default:Date.now
    },
    product:[{type:ProdSchema}],
});
const UserSchema = new mongoose.Schema({
    userId:String,
    email: String,
    pwd:String,
});


const commentSchema=new mongoose.Schema({
    email:String,
    ratingU:Number,
    comment:String,
});

const productSchema=new mongoose.Schema({
     pid:String,
     name:String,
     price:Number,
     rating:Number,
     Comment:[commentSchema],
});

const User = mongoose.model('User', UserSchema);
const Bill=mongoose.model('Bill',BillSchema);
const product=mongoose.model('product',productSchema); 
module.exports = {User,Bill,product};
