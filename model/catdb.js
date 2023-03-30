const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
   breed:{
    type:String,
    required:true
   },
   age:{
      type:String,
      required:true
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
      type:String,
      required:true

   },
   image:{
      type:String,
      required:true
   }

})
var Cat = mongoose.model('cat',catSchema)
module.exports = { Cat };

