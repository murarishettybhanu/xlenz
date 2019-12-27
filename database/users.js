//mongoose is package used to create a schema in this file 
const mongoose = require('mongoose');

//user schema is a schema used in /register and /login in index.js 
//using mongoose.Schema({user object with its properties}) to create a schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  }
});

//creating a user model using above schema
const User = mongoose.model('User', UserSchema);

//exporting User variable to index.js
exports.User = User; 
