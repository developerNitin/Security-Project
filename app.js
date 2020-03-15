//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportlocalmongoose = require("passport-local-mongoose");

const saltRounds = 10;
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// --------> mongodb
mongoose.connect("mongodb://localhost:27017/userdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportlocalmongoose);

const user = new mongoose.model("user", userSchema);
// -------->

// --------> from-passport-local-mongoose
passport.use(user.createStrategy());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
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

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/secrets', isLoggedIn , (req, res)=>{
    res.render('secrets');
});

app.post("/register", function(req, res) {
  const Username = req.body.username;
  const Password = req.body.password;

  user.register(new user({username: Username, active: false}), Password, function(err, user) {
    if (!err) {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    } else {
      console.log(err);
      res.redirect("/register");
    }
  });
});

app.post("/login", function(req, res) {
  const Username = req.body.username;
  const Password = req.body.password;

  const newuser = new user({
    username: Username,
    password: Password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
});




app.listen(3000, function() {
  console.log("server is running on port 3000");
});
