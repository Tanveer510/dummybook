let express = require('express');
let router = express.Router();

//Passport Stuff
const passport = require('passport');
const local = require("passport-local");

//Database Models
let usermodel = require('./users');
let postmodel = require('./posts');
let commentmodel = require('./comments');
let msgmodel = require("./messages");
let uuid = require('uuid');
passport.use(new local(usermodel.authenticate()));

//isLoggedIn Middleware
isLoggedIn=(req,res,next)=>{
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

//**********GET ROUTES***********/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json("HOMEPAGE");
});

// Profile Route
router.get('/profile',isLoggedIn,(req,res)=>{
  usermodel.findOne({username:req.session.passport.user})
  .then((currentuser)=>{
     res.status(200).json(currentuser);
  })
})

//For Logout
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
});

//Reacts on Posts
router.get('/post/:postID/react',(req,res)=>{
  postmodel.findOne({_id:req.params.postID})
  .then((foundPost)=>{
    if(!foundPost.reacts.includes(req.session.passport.user)){
      foundPost.reacts.push(req.session.passport.user)
    }
    else{
      let x = foundPost.reacts.indexOf(req.session.passport.user);
      foundPost.reacts.splice(x,1);
    }
    
    foundPost.save()
    .then((savedPost)=>{
      res.status(200).json(savedPost);
    })
  })
})

//All Posts(For Testing)
router.get('/allposts',(req,res)=>{
  postmodel.find()
  .then((foundlist)=>{
    res.status(200).json(foundlist);
  })
})
//All Posts(For Testing)
router.get('/allusers',(req,res)=>{
  usermodel.find()
  .then((foundlist)=>{
    res.status(200).json(foundlist);
  })
})

//**********POST ROUTES***********/

//For Registration
router.post('/registration',(req,res) =>{
  let newUser = new usermodel({
    name: req.body.name,
    username: req.body.username,
  });
  usermodel.register(newUser,req.body.password).then((u)=>{
    passport.authenticate('local')(req,res,()=>{
      res.redirect('/profile');
    })
  })
});

//For Login
router.post('/login', passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/',
}) ,function(req,res){})

//CreatePost
router.post('/createpost',isLoggedIn,(req,res)=>{
  usermodel.findOne({username:req.session.passport.user})
  .then((foundUser)=>{
    postmodel.create({
      content: req.body.content,
      user_id: foundUser._id
    })
    .then((createdPost)=>{
      foundUser.posts.push(createdPost._id);
      foundUser.save()
      .then((details)=>{
        res.status(200).json(details);
      });
    });
  });
})

//CreateComment
router.post("/comment/:postID",isLoggedIn,(req,res)=>{
  
  usermodel.findOne({username:req.session.passport.user})
  .then((foundUser)=>{
    commentmodel.create({
      cmnt:req.body.comment,
      user_id:foundUser._id,
      post_id:req.params.postID
    })
    .then((createdComment)=>{
      postmodel.findOne({_id:req.params.postID})
      .then((foundPost)=>{
        foundPost.comments.push(createdComment._id);
        foundPost.save()
        .then((savedPost)=>{
          res.status(200).json(savedPost)
        })
      })
    })
  })
})

//Messaging
router.post('/message/:reciever',(req,res)=>{//route starts
  usermodel.findOne({username:req.session.passport.user})
  .then((foundUser)=>{
    let result = foundUser.msgs.find(val => val.another===req.params.reciever);
    
    if(result === undefined){//if starts
            
      const chatId = uuid.v4();
      msgmodel.create({
        author: req.session.passport.user,
        reciever: req.params.reciever,
        msg: req.body.msg,
        chatid: chatId
      }).then((createdmsg)=>{
        foundUser.msgs.push({chatid:chatId,another:req.params.reciever})
        foundUser.save()
        .then((savedUser)=>{
          usermodel.findOne({username: req.params.reciever}).then((foundedreciever)=>{
            foundedreciever.msgs.push({chatid:chatId,another:req.session.passport.user})
            foundedreciever.save()
            .then((savedreciever)=>{
              res.status(200).json("done!");
            })
          })
        })
      })
      
    }//if ends
    else{//else starts

      let cid = result.chatid;
      msgmodel.create({
        author: req.session.passport.user,
        reciever: req.params.reciever,
        msg: req.body.msg,
        chatid: cid
      })
      .then((createdMsg)=>{
        res.status(200).json("Done!");
      })

    }//else ends
  
  })
})//route ends

module.exports = router;