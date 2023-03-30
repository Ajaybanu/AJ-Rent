const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
   breed:{
    type:String,
    required:true
   },
   age:{
      type:String,
   
   },
   gender:{
      type:String,
      
   },
   catagory:{
      type:String,
      required:true
   },
   price:{
      type:String,
      required:true

   },
   image:{
      type:String,
      required:true
   }

})
const Dog = mongoose.model('dog',dogSchema)
module.exports = { Dog };

