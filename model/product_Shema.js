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
    richDescription:{
        type:String,
        default:''
    }
    ,price:{
        type:Number,
        default:0
    },
    brand:{
        type:String,
        default:''
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    countInStock:{
        type:Number,
        required:true,
        min:0,
        max:250,
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
      
          type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        
    }]

});
productSchema.pre('save', function(next) {
    if (typeof this.isFeatured === 'string') {
      this.isFeatured = this.isFeatured.toLowerCase() === 'true';
    }
    next();
  });
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productSchema.set('toJSON', {
    virtuals: true,
});


var Products = mongoose.model('products',productSchema)
module.exports = { Products };