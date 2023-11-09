const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const moment = require('moment')


const userSchema = new mongoose.Schema
  (
    {
      name: {
        type: String,
        required: true
      },
      mobile: {
        type: Number,
        required: true

      },
      email: {
        type: String,
        required: true

      },
      password: {
        type: String,
        required: true,
        max: (20)

      },
      cart: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: {
          type: Number,
          default: 1
        },
        productName: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          default: 0
        },
        total:{
          type:Number,
          default:0
        }
      }],
      wishList: [

        { type: mongoose.Types.ObjectId, ref: 'products' }
      ],
      address: [ 
        {
          firstname: {
            type: String,
            required: true
          },
          lastname: {
            type: String,
            required: true
          },
          country:{
            type:String,
            requires:true
          },
          Address: {
            type: String,
            required: true
          },
          city: {
            type: String,
            required: true
          },
          state: {
            type: String,
            required: true
          },
          pincode: {
            type: Number,
            required: true
          },
          phone: {
            type: Number,
            required: true
          }
        }
      ],
      orders: [

        { type: mongoose.Types.ObjectId, ref: 'orders' }
      ]

    });

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

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

const Users = mongoose.model('users', userSchema)

module.exports = { Users };