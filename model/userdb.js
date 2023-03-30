const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { wishlist } = require('../controller/user');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    number:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        max:(10),
        
    },
    cart: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: {
          type: Number,
          default: 1
        },
        price:{
            type:Number,
            default:0
        },
        image:{
            type:String,
            required:true

        },

      }],
     
    })
    


userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(this.password, salt)
        this.password = hashedpassword
        next()
    } catch (error) {
        next(error)
    }
})




var User = mongoose.model('user',userSchema)
module.exports = { User }