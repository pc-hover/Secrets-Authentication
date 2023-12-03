//jshint esversion:6
//using mongo db
// Types of Encryptions 
// Level 1 -> Simple storage of user data in database
// Level 2 -> Using mongoose-encryption to encrypt password using encryption key
// Level 3 -> Some data from code can be stored in external .env {environment variable} file such as encryption key ,api key etc
// Level 1

//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser =require("body-parser");
const ejs =require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const port =3000;

console.log(process.env.SECRET);

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine','ejs');



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

const secret = process.env.SECRET;
//here scret is is an encryption key using which passworrd is encrypted

secretSchema.plugin(encrypt, { secret: secret,encryptedFields:["password"] });//*********** */

const secretModel = mongoose.model("Users",secretSchema);

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

// secretModel.find({email:email})
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
    const email = req.body.username;
    const password = req.body.password;

    try {
        const foundUsers = await secretModel.find({ email: email });//will return an array
 console.log(foundUsers);
        if (foundUsers.length > 0) {
            const foundUser = foundUsers[0];

            if (foundUser.password === password) {
                res.render("secrets");
            } else {
                res.send("Incorrect password");
            }
        } else {
            res.send("User not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// User.findById(id)
// .then(user => {
//  done(null, user);
// })
// .catch(err => {
//   done(err, null);
// });
app.post("/register",async (req,res)=>{
const newUser = new secretModel(
{
     email : req.body.username,
     password : req.body.password
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

app.listen(port,()=>{
    console.log(`Server running at port : ${port}`);
});