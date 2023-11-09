const mongoose = require('mongoose')
const categorySchema = new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    products:
        [{
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                  ref: 'products',
              }
}]
    
    
});
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

const Category = mongoose.model('category',categorySchema)
module.exports = {  Category  }