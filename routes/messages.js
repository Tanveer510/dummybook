const mongoose = require('mongoose');

let msgSchema = mongoose.Schema({
    author: String,
    reciever: String,
    msg: String,
    chatid: String
});

module.exports = mongoose.model('msg',msgSchema);