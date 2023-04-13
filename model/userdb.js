const mongoose = require('mongoose');
const bcrypt = require("bcrypt");



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
      wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
             
}],
    
    })
    



userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
  
    bcrypt.genSalt(15, function (err, salt) {
      if (err) {
        return next(err);
      }
  
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
  
        user.password = hash;
        next();
      });
    });
  });




var User = mongoose.model('user',userSchema)
module.exports = { User }