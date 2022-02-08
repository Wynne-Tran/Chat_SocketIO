const mongoose = require('mongoose')


const msgSchema = new mongoose.Schema({
    from_user: String,
    to_user: String,
    room: String,
    message: String,
    date_sent: {
        type: Date,
        default: Date.now,
    }
   
})


const Msg = mongoose.model('message',msgSchema)
module.exports = Msg