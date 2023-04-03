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
//     products:
//         [{
//             product_id: {
//                 type: mongoose.Schema.Types.ObjectId,
//                   ref: 'products',
//               }
// }]
    
    
});


const Category = mongoose.model('category',categorySchema);
module.exports = {  Category  }