const mongoose = require("mongoose");

let commentSchema = mongoose.Schema({
    cmnt: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    reacts: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("comment",commentSchema);