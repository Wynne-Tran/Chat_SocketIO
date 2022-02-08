const mongoose = require('mongoose')


const usersSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: true,
        require: true,
    },
    firstname:{
        type: String, 
        require: true,
    },
    lastname: {
        type: String, 
        require: true,
    },
    password: {
        type: String, 
        require: true,
    },
    createon: {
        type: Date,
        default: Date.now,
    }
   
})

usersSchema.static("getUsername", function(value) {
    return this.find({username: value})
  });


const UserSchema = mongoose.model('users',usersSchema)
module.exports = UserSchema