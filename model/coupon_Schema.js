const mongoose = require('mongoose')
const { ObjectId} =require('mongodb')
const couponSchema = new mongoose.Schema(
    {      couponName: {
      type: String,
    
      required: true
  },
        couponCode: {
            type: String,
            trim: true,
            required: true
        },
        percentDiscount: {
            type: Number,
            required: true
        },
      quantity: {
        type: Number,
        required: true
    },
  
        startDate: {
            type: Date,
            required: true
        },
  
        endDate: {
            type: Date,
            required: true
        },
        maximumDiscount: {
            type: Number,
            required: true
        },
        minimumSpend: {
          type: Number,
          required: true
  },
        couponStatus: {
            type: Boolean,
            default: true
        },
        users: [
            {
                user: {
                    type: ObjectId,
                    ref: 'user'
                },
                useTime: {
                  type: Number,
                  default:0
              }
  
            }
        ]
  
    }
  )
  
  const Coupon = mongoose.model('coupon', couponSchema);
  module.exports = { Coupon }