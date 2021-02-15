const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://tan1:tan1@cluster0.ywph5.mongodb.net/fakebookdb",{useNewUrlParser: true, useUnifiedTopology: true});

let userSchema = mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  luckyname: String,
  profile_pic: String,
  about: String,
  contact: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],
  msgs: [{chatid:String,another:String}]
});

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);