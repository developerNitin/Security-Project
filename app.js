//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));

// --------> mongodb
mongoose.connect("mongodb://localhost:27017/userdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedfields: "password"
});

const user = new mongoose.model("user", userSchema);
// -------->

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const Username = req.body.username;
  const Password = req.body.password;

  const newUser = new user({
    email: Username,
    password: Password,
  });

  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function(req, res) {
  const Username = req.body.username;
  const Password = req.body.password;

  user.findOne({
    email: Username
  }, function(err, founduser) {
    if (!err) {
      if (Password) {
        if (founduser.password === Password) {
          res.render("secrets");
        } else {
          res.send("wrong Password");
        }
      } else {
        res.send("please enter Password");
      }
    } else {
      res.send(err);
    }
  });
});




app.listen(3000, function() {
  console.log("server is runnoing on port 3000");
});
