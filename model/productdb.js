const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
   
    price:{
        type:Number,
        default:0
    },
   
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    countInStock:{
        type:Number,
        default:1
        // required:true,
        // min:0,
        // max:250,
    },
    isFeatured:{
        type:Boolean,
        default: false,
    },
    dateCreated:{
        type:Date,
        default:Date.now,
    },
    wishList:[ {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    }]

});
var Products = mongoose.model('products',productSchema)
module.exports = { Products };