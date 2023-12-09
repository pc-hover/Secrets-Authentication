//jshint esversion:6
//using mongo db
// Types of Encryptions 
// Level 1 -> Simple storage of user data in database
// Level 2 -> Using mongoose-encryption to encrypt password using encryption key
//         -> Some data from code can be stored in external .env {environment variable} file such as encryption key ,api key etc
// Level 3 -> Hashing using Md5 
// Level 4 -> Hashing using bcrypt / Salting / Salting Rounds 
// Level 5 -> passport-local-mongoose {Session 276}
// Level 6 -> OAuth 2.0 google-strategy  

//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser =require("body-parser");
const ejs =require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");//No need for "passport-local" it will be required by "passport-local-mongoose"

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();
const port =3000;

// console.log(process.env.SECRET);

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine','ejs');


app.use(session({
secret:"Priyanshu is the king",
resave: false,
saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



mongoose.connect("mongodb://localhost:27017/Secrets");

const secretSchema = new mongoose.Schema({
    email:{
        type: String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    googleId:String
});

secretSchema.plugin(passportLocalMongoose);
secretSchema.plugin(findOrCreate);
const secret = process.env.SECRET;


//here scret is is an encryption key using which passworrd is encrypted

//Level - 5 
const User = mongoose.model("Users",secretSchema);

/*createStrategy(): This method is provided by passport-local-mongoose to set up the local authentication strategy. When you call User.createStrategy(), it creates a Passport LocalStrategy with the appropriate configuration for a Mongoose User model.

This line essentially tells Passport to use the local strategy for authentication, where user credentials (usually a username and password) are verified against the user model in your MongoDB collection. */
// passport.use(User.createStrategy());


/*The passport.serializeUser and passport.deserializeUser functions are used to store and retrieve the user information in the session. They work in conjunction with the passport-local-mongoose plugin. */

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
done(null,user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Deserialize user by fetching the user from the database using the stored identifier
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });//findorcreate is not a mongoose func we either need to write similar code using mongoose functions or  we can use it using mongoosefindorcreate npm package 
  }
));

app.get("/",(req,res)=>{
res.render("home.ejs");
});

app.get("/auth/google",
    passport.authenticate('google',{scope:['profile']})
    );

  app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  }); 


app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/register",(req,res)=>{
  res.render("register.ejs"); 
});
app.get("/logout",(req,res)=>{
  res.render("home.ejs"); 
});
app.get("/secrets",(req,res)=>{
  
    if(req.isAuthenticated())
    {
        res.render("secrets.ejs");
    }
    else{
        res.redirect("/login");
    }
});


app.post("/register",async (req,res)=>{
User.register({username: req.body.username},req.body.password,function (err,user) {
    if(err)
    {
        console.log(err);
        res.redirect("/register");
    }
    else{
       passport.authenticate("local")(req,res,function(){//here "local" is the strategy we are using for basic username password  authenticate 
        res.redirect("/secrets");
       })
    }
    
})
});
// console.log(md5("priyanshu123"));

app.post("/login", (req, res) => {

    const user = new User({
        username:req.body.username,
        password:req.body.password
    });
req.login(user, function(err) {
if (err) { 
    console.log(err);
 }
 else{ 
    passport.authenticate("local")(req,res,function (){ //Here "local" is the STRATEGY
        res.redirect("/secrets");
    });
}});
});


app.listen(port,()=>{
    console.log(`Server running at port : ${port}`);
});