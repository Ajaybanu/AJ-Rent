const mongoose = require('mongoose');
const { ObjectId} =require('mongodb')

    const orderSchema = new mongoose.Schema({
    
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [{
        }],
        deliveryAddress: {
            Address:{
                type:String,
                required:true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            pin: {
                type: String,
                required: true
            }
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        deliveryExpectedDate: {
            type: Date
        },
        payment: {
            type: String,
            required: true,
            default: "COD"
        },
        razorPayDetails: {
            orderId: {
                type: String,
                default: null
            },
            paymentId: {
                type: String,
                default: null
            }
        },
        orderStatus: {
            type: String,
            default: "Confirmed"
        },
        paymentStatus: {
            type: String,
            default: "pending"
        },
        couponApplied: {
            type: Boolean,
            default: false
        },
        couponCode: {
            type: String,
            default: null
        },
        subTotalPrice: {
            type: Number
        },
        totalPrice: {
            type: Number
        }
    }, {
        timestamps: true
    });
    

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});


const Order = mongoose.model('orders', orderSchema);
module.exports = { Order }