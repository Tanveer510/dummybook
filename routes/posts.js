const mongoose = require('mongoose');

let postSchema = mongoose.Schema({
    content: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    reacts: [],
    media: {
        type: String,
        default: '',
    }
});

module.exports = mongoose.model("post",postSchema);