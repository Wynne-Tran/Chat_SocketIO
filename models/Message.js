const mongoose = require('mongoose')


const msgSchema = new mongoose.Schema({
    from_user: {
        type: String,
        require: true,
    },
    to_user: {
        type: String,
        require: true,
    },
    room: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    date_sent: {
        type: Date,
        default: Date.now,
    }
   
})


const Msg = mongoose.model('message',msgSchema)
module.exports = Msg