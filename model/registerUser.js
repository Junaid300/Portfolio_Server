const mongoose = require('mongoose');

const User = mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    email :{
        type:String,
        required : true,
        unique:true
    },
    password : {
        type:String,
    }
})
module.exports = userSchema = mongoose.model('UserRegistration',User)