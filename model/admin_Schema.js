const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
var moment = require('moment');
const { max } = require('moment');


const adminSchema = new mongoose.Schema
(
             {
                email: {
                  type: String,
                  required: true
                 
                },
                password: {
                  type: String,
                  required: true,
                  max:(20)
                 
                },
            });

            adminSchema.pre('save', function(next) {
              const admin = this;
              if (!admin.isModified('password')) {
                return next();
              }
            
              bcrypt.genSalt(15, function(err, salt) {
                if (err) {
                  return next(err);
                }
            
                bcrypt.hash(admin.password, salt, function(err, hash) {
                  if (err) {
                    return next(err);
                  }
            
                  admin.password = hash;
                  next();
                });
              });
            });
          
           
const Admin = mongoose.model('Admin', adminSchema)

module.exports = {Admin};

