const mongoose = require("mongoose");

const fishSchema = new mongoose.Schema({
   breed:{
    type:String,
   required:true,
   },
   gender:{
      type:String,
      required:true
   },
   catagory:{
      type:String,
      required:true
   },
   price:{
      type:Number,
      required:true
   },
   aquarium:{
      type:String,
      required:true
   },
   image:{
      type:String,
      required:true
   }
  

})
var Fish = mongoose.model('Fish',fishSchema)
module.exports = { Fish };

