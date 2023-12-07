//jshint esversion:6
//using mongo db
// Types of Encryptions 
// Level 1 -> Simple storage of user data in database
// Level 2 -> Using mongoose-encryption to encrypt password using encryption key
//         -> Some data from code can be stored in external .env {environment variable} file such as encryption key ,api key etc
// Level 3 -> Hashing using Md5 
// Level 4 -> Hashing using bcrypt / Salting / Salting Rounds 
// Level 5 -> Passports

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
    }
});

secretSchema.plugin(passportLocalMongoose);

const secret = process.env.SECRET;
//here scret is is an encryption key using which passworrd is encrypted

//Level - 5 
const User = mongoose.model("Users",secretSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
res.render("home.ejs");
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

// app.post("/login",async (req,res)=>{
// const email = req.body.username;
// const password = req.body.password;

// User.find({email:email})
// .then(foundUser=>{
//      if(foundUser.password === password)
//     {
//         res.render("secrets");
//     }
// })
// .catch(err=>{
//     console.log(err);
// })

// });

app.post("/login", async (req, res) => {
    //1. check user exits or not in database using email
    //2 if yes then bcrypt.compare user entered password with hash saved in db that is foundUser.password
    
});

// User.findById(id)
// .then(user => {
//  done(null, user);
// })
// .catch(err => {
//   done(err, null);
// });
app.post("/register",async (req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
const newUser = new User(
{
     email : req.body.username,
     password : hash
});
try{
newUser.save();
res.render("secrets");
}
catch(err)
{
    console.log(err);
}
});

});
// console.log(md5("priyanshu123"));

app.listen(port,()=>{
    console.log(`Server running at port : ${port}`);
});