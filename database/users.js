//mongoose is package used to create a schema in this file 
const mongoose_package_var = require('mongoose');

//user schema is a schema used in /register and /login in index.js 
//using mongoose.Schema({user object with its properties}) to create a schema
const UserSchema = new mongoose_package_var.Schema({
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

//creating a user model using above schema and assigning it to Usermodel variable
const Usermodel = mongoose_package_var.model('User_variable', UserSchema);

//assigning Usermodel to User_variable and exporting User_variable variable to index.js
exports.User_variable = Usermodel; 
